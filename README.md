# Accessify

A Chrome (Manifest V3) browser extension **plus** a small Flask micro‑service that bundles multiple on‑page accessibility helpers:

* Epilepsy‑safe video playback (masks strobe frames via OpenCV + yt‑dlp)
* Dyslexia mode (larger fonts, better spacing, pastel background)
* Colour‑blind CSS filters (protanopia, deuteranopia, tritanopia)
* Irlen overlay (tinted sheet to reduce glare)
* In‑page text‑to‑speech (Web Speech API)
* One‑click paragraph summariser powered by OpenAI GPT‑4o

This README is patterned after my *HorseRaceSimulator* guide—just new content for **Accessify**.

---

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Contributing](#contributing)
4. [License](#license)

---

## Installation

> *Tested on Windows 10/11, macOS Sonoma, Ubuntu 22.04.*

### 1  Clone the repo

```bash
git clone https://github.com/your‑username/Accessify.git
cd Accessify
```

### 2  Install prerequisites

| Tool                                    | Windows                                                | macOS (brew)               | Ubuntu / Debian                               |
| --------------------------------------- | ------------------------------------------------------ | -------------------------- | --------------------------------------------- |
| **Python 3.11**                         | winget install Python.Python.3.11                      | `brew install python@3.11` | `sudo apt install python3.11 python3.11‑venv` |
| **ffmpeg**                              | choco install ffmpeg                                   | `brew install ffmpeg`      | `sudo apt install ffmpeg`                     |
| **Google Chrome 122+**                  | [https://google.com/chrome](https://google.com/chrome) | same                       | same                                          |
| **Node 18+** *(only for the demo site)* | winget install OpenJS.NodeJS.LTS                       | `brew install node`        | `sudo apt install nodejs npm`                 |

### 3  Set your OpenAI key

```bash
# macOS / Linux
echo 'export OPENAI_API_KEY="sk‑..."' >> ~/.bash_profile && source ~/.bash_profile

# Windows PowerShell
setx OPENAI_API_KEY "sk‑..."   # persist
env:OPENAI_API_KEY="sk‑..."   # for current session
```

### 4  Install Python and Node dependencies

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# (optional) Next.js demo site
cd learn && npm install && cd ..
```

### 5  Build & run everything

```bash
# Cross‑platform helper (needs dev dependencies already installed)
npm run dev          # starts Flask on :5000 + Next.js on :3000

# OR the Bash version (macOS/Linux)
./dev.sh
```

### 6  Load the extension

1. Open **chrome://extensions**
2. Toggle **Developer mode**
3. Click **Load unpacked** → select the `extension/` folder inside this repo.

---

## Usage

### Summariser / TTS / Overlays

1. Navigate to any article.
2. Click the **Accessify ℹ︎** icon in your toolbar.
3. Toggle **Dyslexia Mode**, **Colour‑blind Filters**, or **Irlen Overlay** as needed.
4. Hit **Speak** to hear the page or **Summarise** for an AI digest.

### Epilepsy‑Safe Video

1. Open a YouTube video.
2. Popup → **Epilepsy Mode**.
3. The page reloads with a processed MP4; flashing frames are removed.

### Dev demo

`http://localhost:3000` hosts a small Next.js playground that embeds YouTube iframes and sample articles so you can test every feature without leaving localhost.

*(Screenshots live in `/docs/screens/`—add your own or swap these placeholders.)*

---

## Contributing

1. **Fork** the repo.
2. `git checkout -b feature/awesome‑idea`
3. Make changes + commit: `git commit -am "✨ Add awesome idea"`
4. Push: `git push origin feature/awesome‑idea`
5. Open a **Pull Request**—I review quickly!

### Bugs & Feature Requests

* File an issue with *clear reproduction steps*.
* PRs should pass `flake8` (backend) and `eslint` (frontend).

---

## License

MIT. See [`LICENSE`](LICENSE).

---

> *Happy hacking & stay accessible!*
