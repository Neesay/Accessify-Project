document.addEventListener("DOMContentLoaded", () => {
  // Epilepsy Mode Button
  const epilepsyBtn = document.getElementById("epilepsyBtn");
  if (epilepsyBtn) {
    epilepsyBtn.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          console.error("No active tab found.");
          return;
        }
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: async () => {
            if (typeof window.replaceVideo === "function") {
              await window.replaceVideo();
            } else {
              console.error("replaceVideo not found on this page.");
            }
          }
        });
      });
    });
  }

  // Accessibility Controls
  const dyslexiaLevelSelect = document.getElementById("dyslexiaLevel");
  const colorBlindSelect = document.getElementById("colorBlindToggle");
  const speakButton = document.getElementById("speakButton");
  const stopButton = document.getElementById("stopButton");
  const speedSlider = document.getElementById("speedSlider");
  const linkButton = document.getElementById("linkButton");
  const irlenBtn = document.getElementById("irlenBtn");
  const summariseBtn = document.getElementById("summariseBtn");

  // Load stored settings
  chrome.storage.sync.get(["dyslexiaLevel", "colorBlindMode"], (data) => {
    if (dyslexiaLevelSelect) dyslexiaLevelSelect.value = data.dyslexiaLevel || "none";
    if (colorBlindSelect) colorBlindSelect.value = data.colorBlindMode || "none";
  });

  // Summarise button
  if (summariseBtn) {
    summariseBtn.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          console.error("No active tab found.");
          return;
        }
        // Send a message to content.js to summarize
        chrome.tabs.sendMessage(tabs[0].id, { action: "summarizePage" });
      });
    });
  }

  // Dyslexia Mode
  if (dyslexiaLevelSelect) {
    dyslexiaLevelSelect.addEventListener("change", (event) => {
      const level = event.target.value;
      chrome.storage.sync.set({ dyslexiaLevel: level });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "changeDyslexiaLevel", level });
        }
      });
    });
  }

  // Color Blind Mode
  if (colorBlindSelect) {
    colorBlindSelect.addEventListener("change", (event) => {
      const mode = event.target.value;
      chrome.storage.sync.set({ colorBlindMode: mode });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "toggleColorBlindMode", type: mode });
        }
      });
    });
  }

  // Read Selected Text
  if (speakButton) {
    speakButton.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => window.getSelection().toString()
          }, (result) => {
            const selectedText = result[0]?.result.trim();
            if (selectedText) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "speakText",
                text: selectedText,
                speed: parseFloat(speedSlider.value)
              });
            } else {
              alert("Please select some text first!");
            }
          });
        }
      });
    });
  }

  // Stop TTS
  if (stopButton) {
    stopButton.addEventListener("click", () => {
      if (!stopButton.disabled) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stopSpeech" });
          }
        });
      }
    });
  }

  // Adjust Speed
  if (speedSlider) {
    speedSlider.addEventListener("input", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "changeSpeechSpeed",
            speed: parseFloat(speedSlider.value)
          });
        }
      });
    });
  }

  // Learn button
  if (linkButton) {
    linkButton.addEventListener("click", () => {
      chrome.tabs.create({ url: "http://localhost:3002" });
    });
  }

  // Irlen Mode Button
  if (irlenBtn) {
    irlenBtn.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          console.error("No active tab found.");
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleIrlenMode" });
      });
    });
  }

  // Periodically check TTS status to enable/disable "Stop" button
  updateStopButton();
  setInterval(updateStopButton, 1000);

  function updateStopButton() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getSpeechStatus" }, (response) => {
          if (chrome.runtime.lastError) {
            // Possibly no listener in the content script or page
            return;
          }
          const isSpeaking = response?.isSpeaking;
          stopButton.disabled = !isSpeaking;
        });
      }
    });
  }
});
