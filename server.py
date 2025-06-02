import os
import uuid
import subprocess
import cv2
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DOWNLOAD_DIR = 'downloads'
PROCESSED_DIR = 'processed'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

def download_youtube_video(url):
    random_filename = f"{uuid.uuid4()}.mp4"
    output_path = os.path.join(DOWNLOAD_DIR, random_filename)
    command = [
        'yt-dlp',
        '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]',
        '--merge-output-format', 'mp4',
        '-o', output_path,
        url
    ]
    print("Running yt-dlp command:", " ".join(command))
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        print("yt-dlp failed:", result.stderr)
        return None
    if os.path.exists(output_path):
        print("Downloaded file:", output_path)
        return output_path
    else:
        print("No file found after yt-dlp.")
        return None

def find_strobe_frames(input_video, brightness_threshold=220, consecutive_frames=3):
    cap = cv2.VideoCapture(input_video)
    if not cap.isOpened():
        print("Error opening video for reading brightness.")
        return set()
    strobe_frames = set()
    run_count = 0
    run_start = -1
    frame_index = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        avg_brightness = np.mean(gray)
        if avg_brightness > brightness_threshold:
            run_count += 1
            if run_count == 1:
                run_start = frame_index
        else:
            if run_count >= consecutive_frames:
                for f in range(run_start, frame_index):
                    strobe_frames.add(f)
            run_count = 0
            run_start = -1
        frame_index += 1
    if run_count >= consecutive_frames:
        for f in range(run_start, frame_index):
            strobe_frames.add(f)
    cap.release()
    print(f"Found {len(strobe_frames)} strobe frames (threshold={brightness_threshold}, consecutive={consecutive_frames}).")
    return strobe_frames

def apply_strobe_mask(input_video, strobe_frames, output_path,
                      global_color_diff_threshold=50,
                      block_color_diff_threshold=40,
                      block_size=16):
    cap = cv2.VideoCapture(input_video)
    if not cap.isOpened():
        print("Error opening video file in apply_strobe_mask.")
        return False

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    prev_frame_original = None
    frame_index = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        current_frame_original = frame.copy()
        block_trigger = False
        if prev_frame_original is not None:
            diff = cv2.absdiff(current_frame_original, prev_frame_original)
            global_diff = np.mean(diff)
            if global_diff > global_color_diff_threshold:
                block_trigger = True
            else:
                h, w, _ = diff.shape
                num_blocks_y = h // block_size
                num_blocks_x = w // block_size
                for i in range(num_blocks_y):
                    for j in range(num_blocks_x):
                        block = diff[i * block_size:(i + 1) * block_size, j * block_size:(j + 1) * block_size]
                        block_mean = np.mean(block)
                        if block_mean > block_color_diff_threshold:
                            block_trigger = True
                            break
                    if block_trigger:
                        break
            if block_trigger:
                frame = np.zeros_like(frame)
            elif frame_index in strobe_frames:
                frame = (current_frame_original * 0.2).astype(np.uint8)
        else:
            if frame_index in strobe_frames:
                frame = (current_frame_original * 0.2).astype(np.uint8)
        out.write(frame)
        prev_frame_original = current_frame_original
        frame_index += 1
    cap.release()
    out.release()
    print(f"Dimming done. Wrote {frame_index} frames to {output_path}.")
    return True

def merge_audio(video_no_audio, original_video, final_output):
    temp_audio_name = f"temp_audio_{uuid.uuid4()}.aac"
    temp_audio = os.path.join(PROCESSED_DIR, temp_audio_name)
    extract_cmd = [
        'ffmpeg', '-y',
        '-i', original_video,
        '-vn',
        '-c:a', 'copy',
        temp_audio
    ]
    print("Extracting audio:", " ".join(extract_cmd))
    subprocess.run(extract_cmd, check=True)
    merge_cmd = [
        'ffmpeg', '-y',
        '-i', video_no_audio,
        '-i', temp_audio,
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '18',
        '-c:a', 'copy',
        final_output
    ]
    print("Merging audio:", " ".join(merge_cmd))
    subprocess.run(merge_cmd, check=True)
    os.remove(temp_audio)

@app.route('/process', methods=['POST'])
def process_endpoint():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'Missing "url"'}), 400
    video_url = data['url']
    try:
        downloaded_path = download_youtube_video(video_url)
        if not downloaded_path:
            return jsonify({'error': 'Download failed'}), 500
        strobe_frames = find_strobe_frames(downloaded_path, brightness_threshold=220, consecutive_frames=3)
        print("Number of strobe frames:", len(strobe_frames))
        no_audio_path = os.path.join(PROCESSED_DIR, f"{uuid.uuid4()}.mp4")
        success = apply_strobe_mask(downloaded_path, strobe_frames, no_audio_path)
        if not success:
            return jsonify({'error': 'Failed to apply strobe mask'}), 500
        final_path = os.path.join(PROCESSED_DIR, f"{uuid.uuid4()}.mp4")
        merge_audio(no_audio_path, downloaded_path, final_path)
        processed_url = request.host_url.rstrip('/') + '/videos/' + os.path.basename(final_path)
        return jsonify({'processed_url': processed_url}), 200
    except Exception as e:
        print("Exception in /process:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/videos/<filename>')
def serve_video(filename):
    return send_from_directory(PROCESSED_DIR, filename)

if __name__ == '__main__':
    app.run(debug=False)
