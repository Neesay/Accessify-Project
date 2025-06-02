"use client";
import Button from "@/app/components/button";
import { useState, useEffect } from "react";

const words = [
  "apple", "banana", "grape", "orange", "lemon", "strawberry", "blueberry", "mango", "pineapple", "peach",
  "cherry", "watermelon", "papaya", "kiwi", "plum", "coconut", "avocado", "fig", "pomegranate",
  "tomato", "cucumber", "carrot", "broccoli", "spinach", "cabbage", "pumpkin", "lettuce", "onion", "pepper",
  "potato", "radish", "beetroot", "garlic", "ginger", "corn", "mushroom", "peas", "bean", "zucchini",
  "table", "chair", "couch", "lamp", "mirror", "window", "door", "shelf", "cabinet", "desk",
  "pen", "pencil", "paper", "notebook", "eraser", "marker", "chalk", "stapler", "scissors", "ruler"
];

function shuffleWord(word: string) {
  let new_word = word.split("").sort(() => Math.random() - 0.5).join("");
  if (new_word === word){
    shuffleWord(word);
  }
  return new_word;
}

export default function WordScramble() {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setScrambledWord(shuffleWord(newWord));
  }, []);

  const checkAnswer = () => {
    if (userInput.toLowerCase() === currentWord) {
      setMessage("✅ Correct!");
    } else {
      setMessage("❌ Try Again!");
    }
  };

  const nextWord = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setScrambledWord(shuffleWord(newWord));
    setUserInput("");
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 " style={{ background: 'radial-gradient(100% 100% at 50% 10%, #fff 20%, #63e 100%)' }}>
      <h1 className="text-3xl font-bold mb-4">Word Scramble</h1>
      <p className="text-lg text-gray-700 mb-2">Unscramble the word below:</p>

      <div className="absolute top-0 right-0 flex flex-row justify-end p-10 items-end text-black w-1/4 gap-5">
        <Button href="/" text="Home" type="normal" />
      </div>


      {scrambledWord && (
        <div className="text-4xl font-bold text-blue-600 bg-white px-6 py-3 rounded-md shadow-lg">
          {scrambledWord}
        </div>
      )}

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type the correct word..."
        className="mt-4 p-3 border border-black rounded-md text-center"
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
        New Word
      </button>
    </div>
  );
}