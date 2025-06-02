"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import { motion } from "framer-motion";

// List of phonics-based words using the Orton-Gillingham approach
const phonicsWords = [
  { word: "elephant", sound: ["eleh",  "phant"] },
  { word: "butterfly", sound: ["but","ter",   "fly"] },
  { word: "cucumber", sound: ["cue", "kum","ber"] },
  { word: "dinosaur", sound: ["die",   "no" ,  "saur"] },
  { word: "kangaroo", sound: ["cann", "ga", "roo"] },
  { word: "chocolate", sound: ["ch",   "o",   "c"  , "o"   ,"l",   "a",   "t",   "e"] },
  { word: "parrot", sound: ["p",   "a",   "r",   "r",   "o",   "t"] },
  { word: "telephone", sound: ["t",   "e",   "l",   "e",   "p",   "h",   "o",   "n",   "e"] },
  { word: "pencil", sound: ["p",   "e",   "n",   "c",   "i",   "l"] },
  { word: "rainbow", sound: ["r",   "a",   "i",   "n",   "b",   "o",   "w"] },
];

export default function PhonicsGame() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [activePhoneme, setActivePhoneme] = useState(-1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentWord = phonicsWords[currentIndex];

  const speakWord = (text: string[]) => {
    if (!window.speechSynthesis) return alert("Text-to-Speech is not supported in this browser.");
    const utterance = new SpeechSynthesisUtterance();
    utterance.rate = 0.8; 
    utterance.pitch = 1;
    utterance.volume = 1;

    let index = 0;
    utterance.text = text.join(" ");
    utterance.onboundary = () => {
      setActivePhoneme(index);
      index++;
    };

    utterance.onend = () => setActivePhoneme(-1);
    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (userInput.toLowerCase().trim() === currentWord.word.toLowerCase()) {
      setMessage("✅ Correct!");
    } else {
      setMessage("❌ Try Again!");
    }
  };

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % phonicsWords.length);
    setUserInput("");
    setMessage("");
    setActivePhoneme(-1);
  };

  if (!isMounted) return <div>Loading...</div>;

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center p-5" style={{ background: 'radial-gradient(100% 100% at 50% 10%, #fff 20%, #63e 100%)' }}>
      <div className="absolute top-0 right-0 flex flex-row justify-end p-5 gap-5">
        <Button href="/" text="Home" type="normal" />
      </div>

      <h1 className="text-3xl font-bold mb-4">Phonics Game (Orton-Gillingham)</h1>
      <p className="text-lg text-gray-700 mb-4">Listen to the sounds and type the word:</p>

      <button
        onClick={() => speakWord(currentWord.sound)}
        className="mb-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        🔊 Hear Sounds
      </button>

      {/* Phoneme Visualization with Animation */}
      <div className="flex gap-2 text-4xl font-bold text-blue-600">
        {currentWord.sound.map((phoneme, index) => (
          <motion.span
            key={index}
            className="bg-yellow-300 px-4 py-2 rounded-md shadow-md"
            animate={{ scale: activePhoneme === index ? 1.3 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {phoneme}
          </motion.span>
        ))}
      </div>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type the word..."
        className="mt-4 p-3 border border-black rounded-md text-center text-lg shadow-md"
      />

      <button
        onClick={checkAnswer}
        className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        Check Answer
      </button>

      {message && <p className="mt-2 text-lg font-semibold">{message}</p>}

      <button
        onClick={nextWord}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Next Word
      </button>
    </div>
  );
}