"use client"

import Button from "../components/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();


  async function hashPassword(password: string) {
    const salt = "$2a$10$7EqJtq98hPqEX7fNZaFWo.";
    const hashedPassword = await bcrypt.hash(password, salt); 
    return hashedPassword;
  }


  async function logIn(u: string, p: string){
    const response = await fetch(`/api/user?username=${encodeURIComponent(username)}`, {method:"GET"});

    if (response.ok){
      const { event } = await response.json()

      setMessage(event)
    }
    else{
      setMessage("Please try again later")
    }
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hashed_password = hashPassword(password)
    //logIn(username, password)
    setUsername("")
    setPassword("")

    router.push("/Learning")
    
  };



  return (
    <div className="bg-gradient-to-bl from-pink-100 to-purple-500 h-screen text-white flex items-center justify-center">
      <div className="bg-white/65 w-3/4 rounded-md flex flex-col h-auto p-10 shadow-lg">

        <div className="absolute top-0 right-0 flex flex-row justify-end p-10 items-end text-black w-1/4 gap-5">
          <Button href="/" text="Home" type="normal" />
          <Button href="/Login" text="Login" type="normal" />
          <Button href="/SignUp" text="Sign up" type="normal" />
        </div>

        <div className="h-1/2 flex flex-col items-center justify-center text-black gap-5">
          <h1 className="text-7xl font-bold">Login</h1>
          <h4 className="text-lg text-red-400">{message}</h4>
        </div>

        <form 
          className="flex flex-col h-fit items-center justify-center gap-5 w-full"
          onSubmit={handleSubmit}
        >
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-1/4 p-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500 transition-all"
          />

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-1/4 p-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500 transition-all"
          />

          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition font-semibold shadow-md cursor-pointer"
            >
            Submit
          </button>
        </form>

        <p className="p-10 flex flex-row text-black justify-center text-sm">Accessify 2025</p>
      </div>
    </div>
  );
}
