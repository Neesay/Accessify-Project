"use client";

import React from "react";
import Button from "../components/button";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  return (
    <>
      <div className="absolute top-0 right-0 flex flex-row justify-end p-10 items-end text-black w-1/4 gap-5">
        <Button href="/" text="Home" type="normal" />
      </div>

      
      <div
        className="grid grid-cols-2 grid-rows-2 gap-15 h-screen w-screen p-80"
        style={{
          background:
            "radial-gradient(100% 100% at 50% 10%, #fff 20%, #63e 100%)",
        }}
      >

        
        <button
          className="flex items-center justify-center bg-[#d695d9] text-black text-3xl font-bold hover:bg-[#E6C200] transition cursor-pointer rounded-2xl"
          onClick={() => router.push("/Learning/Scramble")}
        >
          Scramble
        </button>

        <button
          className="flex items-center justify-center bg-[#d695d9] text-black text-3xl font-bold hover:bg-[#3C8E3A]  transition cursor-pointer rounded-2xl"
          onClick={() => router.push("/Learning/Phonics")}
        >
          Phonics
        </button>

        <button
          className="flex items-center justify-center bg-[#d695d9] text-black text-3xl font-bold hover:bg-[#E65C50]  transition cursor-pointer rounded-2xl"
          onClick={() => router.push("/Learning/ReadOutLoud")}
        >
          Read Aloud
        </button>

        <button
          className="flex items-center justify-center bg-[#d695d9] text-black text-3xl font-bold hover:bg-[#005A8E]  transition cursor-pointer rounded-2xl"
          onClick={() => router.push("/Learning/LetterSwap")}
        >
          Letter Swaps
        </button>
      </div>
    </>
  );
}