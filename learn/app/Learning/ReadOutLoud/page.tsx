"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";

export default function ReadOutLoud() {
  const router = useRouter();
  const [text, setText] = useState(""); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");

  useEffect(() => {
    setHighlightedText(text);
  }, [text]);

  const speakText = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (!text.trim()) {
      alert("Please enter some text to read.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // Speed
    utterance.pitch = 1; // Pitch
    utterance.volume = 1; // Volume

    const words = text.split(" ");
    let index = 0;

    utterance.onboundary = (event) => {
      if (event.charIndex !== undefined && index < words.length) {
        const before = text.substring(0, event.charIndex);
        const current = words[index]; // Ensuring we get a valid word
        const after = text.substring(event.charIndex + current.length);

        setHighlightedText(`${before} <span class='bg-yellow-300 text-black font-bold'>${current}</span> ${after}`);
        index++;
      }
    };

    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setHighlightedText(text); // Reset text after reading
    };

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  return (
    <div className="h-screen w-screen [background:radial-gradient(100%_100%_at_50%_10%,#fff_20%,#63e_100%)] text-white flex flex-col items-center justify-center p-5">

      <div className="absolute top-0 right-0 flex flex-row justify-end p-10 items-end text-black w-1/4 gap-5">
        <Button href="/" text="Home" type="normal" />
      </div>

      <h1 className="text-3xl font-bold mb-4 text-black">Read Aloud Tool</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something to be read aloud..."
        className="w-3/4 p-4 text-black text-lg border border-gray-400 rounded-lg bg-white shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none leading-relaxed font-[OpenDyslexic] tracking-wide"
        rows={4}
      ></textarea>

      <div
        className="w-3/4 mt-4 p-4 text-black text-lg border border-gray-400 rounded-md bg-white shadow-md leading-relaxed font-[OpenDyslexic] tracking-wide"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      ></div>

      <button
        onClick={speakText}
        disabled={isSpeaking}
        className={`mt-4 px-6 py-3 text-white text-lg font-bold rounded-lg transition ${
          isSpeaking ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isSpeaking ? "Speaking..." : "Read Aloud"}
      </button>
    </div>
  );
}
