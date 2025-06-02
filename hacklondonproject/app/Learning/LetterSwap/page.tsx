"use client";

import React, { useState } from "react";
import Button from "@/app/components/button";


declare global {
  interface Window {
    selectedIndex?: number;
  }
}

export default function LetterSwap() {
  const [originalWord, setOriginalWord] = useState("apple"); 
  const [scrambledWord, setScrambledWord] = useState(scrambleWord("apple"));
  const [userWord, setUserWord] = useState(scrambleWord("apple"));
  const [message, setMessage] = useState("");

  function scrambleWord(word: string): string {
    let arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  }

  function swapLetters(index1: number, index2: number) {
    let arr = userWord.split("");
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
    setUserWord(arr.join(""));
  }

  function checkAnswer() {
    if (userWord === originalWord) {
      setMessage("✅ Correct!");
    } else {
      setMessage("❌ Keep Trying!");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 " style={{ background: 'radial-gradient(100% 100% at 50% 10%, #fff 20%, #63e 100%)' }}>

      <div className = "absolute top-0 right-0 flex flex-row justify-end p-10 items-end text-black w-1/4 gap-5">
      
        <Button  href = "/" text = "Home" type = "normal"/>
        
      </div>

      <h1 className="text-3xl font-bold mb-4">Letter Swap Game</h1>
      <p className="text-lg mb-2">Rearrange the letters to form the correct word!</p>

      <div className="flex gap-2 text-2xl font-bold mb-4">
        {userWord.split("").map((letter: string, index: number) => (
          <button
            key={index}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              if (window.selectedIndex !== undefined) {
                swapLetters(window.selectedIndex, index);
                window.selectedIndex = undefined;
              } else {
                window.selectedIndex = index;
              }
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      <button
        onClick={checkAnswer}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        Check Answer
      </button>

      {message && <p className="mt-4 text-lg font-semibold">{message}</p>}
    </div>
  );
}
