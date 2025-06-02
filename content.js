/**
 * 1) Video Processing (Epilepsy Mode)
*/
function createOverlay(message) {
  const overlay = document.createElement("div");
  overlay.id = "gpt-epilepsy-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.75)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "100000";
  overlay.style.color = "#fff";
  overlay.style.fontSize = "2em";
  overlay.innerText = message;
  document.body.appendChild(overlay);
  return overlay;
}

function updateOverlay(message) {
  const overlay = document.getElementById("gpt-epilepsy-overlay");
  if (overlay) {
    overlay.innerText = message;
  }
}

function removeOverlay() {
  const overlay = document.getElementById("gpt-epilepsy-overlay");
  if (overlay) {
    overlay.remove();
  }
}

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;
    const checkExist = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(checkExist);
        resolve(el);
      }
      elapsed += interval;
      if (elapsed >= timeout) {
        clearInterval(checkExist);
        reject(`Element ${selector} not found`);
      }
    }, interval);
  });
}

// Call your Flask server to process the video
async function fetchProcessedVideoUrl(originalUrl) {
  try {
    const response = await fetch("http://localhost:5000/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: originalUrl })
    });
    if (!response.ok) {
      console.error("Server returned error:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data.processed_url;
  } catch (err) {
    console.error("Error calling backend:", err);
    return null;
  }
}

async function replaceVideo() {
  try {
    createOverlay("Downloading...");
    let playerContainer;
    try {
      playerContainer = await waitForElement("#player, .html5-video-player", 5000);
    } catch (e) {
      // If not found, just use the body
      playerContainer = document.body;
    }
    const originalVideoUrl = window.location.href;
    console.log("Sending to server for processing:", originalVideoUrl);
    const processedVideoUrl = await fetchProcessedVideoUrl(originalVideoUrl);
    if (!processedVideoUrl) {
      console.error("No processed video URL returned.");
      updateOverlay("Error during processing");
      setTimeout(removeOverlay, 2000);
      return;
    }
    console.log("Got processed video URL:", processedVideoUrl);
    updateOverlay("Processing...");
    playerContainer.innerHTML = "";
    const customVideo = document.createElement("video");
    customVideo.controls = true;
    customVideo.autoplay = true;
    customVideo.src = processedVideoUrl;
    customVideo.style.width = "100%";
    customVideo.style.height = "100%";
    playerContainer.appendChild(customVideo);
    setTimeout(removeOverlay, 1000);
  } catch (error) {
    console.error("Error replacing video:", error);
    updateOverlay("Error occurred");
    setTimeout(removeOverlay, 2000);
  }
}

// Expose this function globally for Epilepsy Mode
window.replaceVideo = replaceVideo;
console.log("Content script loaded; replaceVideo is now available on window.");


/**
 * 2) Accessibility & TTS Functions
 */
chrome.storage.sync.get(["dyslexiaLevel", "colorBlindMode"], (data) => {
  applyDyslexiaMode(data.dyslexiaLevel || "none");
  applyColorBlindFilter(data.colorBlindMode || "none");
});

let speech = new SpeechSynthesisUtterance();
let isSpeaking = false;
speech.onend = () => {
  isSpeaking = false;
};

function startSpeech(text, speed) {
  if (isSpeaking) stopSpeech();
  speech.text = text;
  speech.rate = speed || 1;
  speechSynthesis.speak(speech);
  isSpeaking = true;
}

function stopSpeech() {
  speechSynthesis.cancel();
  isSpeaking = false;
}

function updateSpeechSpeed(speed) {
  if (isSpeaking) {
    speechSynthesis.cancel();
    speech.rate = speed;
    speechSynthesis.speak(speech);
  }
}

function applyDyslexiaMode(level) {
  const styles = {
    mild: {
      fontSize: "18px",
      letterSpacing: "0.08em",
      lineHeight: "1.5",
      backgroundColor: "#FDF7E3"
    },
    moderate: {
      fontSize: "22px",
      letterSpacing: "0.12em",
      lineHeight: "1.6",
      backgroundColor: "#FAF8E4"
    },
    strong: {
      fontSize: "26px",
      letterSpacing: "0.15em",
      lineHeight: "1.8",
      backgroundColor: "#FFF8D6"
    },
    none: {
      fontSize: "",
      letterSpacing: "",
      lineHeight: "",
      backgroundColor: ""
    }
  };
  let selectedStyle = styles[level];
  document.body.style.fontSize = selectedStyle.fontSize;
  document.body.style.letterSpacing = selectedStyle.letterSpacing;
  document.body.style.lineHeight = selectedStyle.lineHeight;
  document.body.style.backgroundColor = selectedStyle.backgroundColor;
}

function applyColorBlindFilter(type) {
  document.documentElement.style.filter = "";
  const filters = {
    protanopia: "grayscale(30%) sepia(100%) hue-rotate(-20deg)",
    deuteranopia: "grayscale(30%) sepia(100%) hue-rotate(20deg)",
    tritanopia: "grayscale(30%) sepia(100%) hue-rotate(90deg)",
    "high-contrast": "contrast(1.5)",
    none: ""
  };
  document.documentElement.style.filter = filters[type] || "";
}


/**
 * 3) Irlen Mode (Reduce Framerate)
 */

let reduceFrameRate = false;
let lastScrollTime = 0;
let lastScrollPos = { x: 0, y: 0 };
const throttleDelay = 100; // 100 ms => ~10 FPS

function toggleIrlenMode() {
  reduceFrameRate = !reduceFrameRate;
  console.log("Irlen Mode toggled:", reduceFrameRate);
}

function handleScroll(e) {
  if (!reduceFrameRate) return; // If not in Irlen mode, do nothing

  const now = Date.now();
  if (now - lastScrollTime < throttleDelay) {
    // Too soon since last scroll event, revert scroll
    e.preventDefault();
    window.scrollTo(lastScrollPos.x, lastScrollPos.y);
    return;
  }
  lastScrollTime = now;
  lastScrollPos = { x: window.scrollX, y: window.scrollY };
}

window.addEventListener("scroll", handleScroll, { passive: false });


/**
 * 4) Summarize Paragraphs with ChatGPT
 */

// Hard-code your key for local testing (example only)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 2000;

async function summarizeParagraph(paragraphText, attempt = 1) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that summarizes text succinctly." },
          { role: "user", content: "Summarise the following:\n" + paragraphText }
        ],
        max_tokens: 200
      })
    });

    // Check if response is OK
    if (!response.ok) {
      // If 429 Too Many Requests, retry with backoff
      if (response.status === 429 && attempt < MAX_RETRIES) {
        console.warn(`OpenAI 429 error on attempt ${attempt}, retrying...`);
        // Exponential backoff
        const delayMs = INITIAL_BACKOFF_MS * 2 ** (attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return summarizeParagraph(paragraphText, attempt + 1);
      }

      // Otherwise, log and return null
      console.error("OpenAI API error:", response.status, response.statusText);
      return null;
    }

    // Parse JSON
    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content?.trim();
    return summary || null;

  } catch (err) {
    console.error("Error calling OpenAI:", err);
    return null;
  }
}


async function summarizeAllParagraphs() {
  const paragraphs = Array.from(document.querySelectorAll("p"));

  // Simple overlay while summarizing
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  overlay.style.color = "#fff";
  overlay.style.fontSize = "24px";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "999999";
  overlay.textContent = "Summarizing paragraphs...";
  document.body.appendChild(overlay);

  for (const p of paragraphs) {
    const originalText = p.innerText.trim();
    if (!originalText) continue;

    const summary = await summarizeParagraph(originalText);
    if (summary) {
      p.innerText = summary;
    }
  }
  document.body.removeChild(overlay);
}


/**
 * 5) Listen for Messages from Popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Dyslexia
  if (message.action === "changeDyslexiaLevel") {
    chrome.storage.sync.set({ dyslexiaLevel: message.level });
    applyDyslexiaMode(message.level);
  }

  // Color Blind
  if (message.action === "toggleColorBlindMode") {
    chrome.storage.sync.set({ colorBlindMode: message.type });
    applyColorBlindFilter(message.type);
  }

  // TTS
  if (message.action === "speakText") {
    startSpeech(message.text, message.speed);
  }
  if (message.action === "stopSpeech") {
    stopSpeech();
  }
  if (message.action === "changeSpeechSpeed") {
    updateSpeechSpeed(message.speed);
  }
  if (message.action === "getSpeechStatus") {
    sendResponse({ isSpeaking });
  }

  // Irlen Mode
  if (message.action === "toggleIrlenMode") {
    toggleIrlenMode();
  }

  // Summarize
  if (message.action === "summarizePage") {
    summarizeAllParagraphs();
  }

  return true;
});
