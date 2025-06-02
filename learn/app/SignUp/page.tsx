"use client"

import Button from "../components/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username != "") && (password != "")){
      let storing_password = hashPassword(password)
      // store the stuff

      setUsername("")
      setPassword("")

    }
  };

  async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 
    return hashedPassword;
  }

  async function insertUser(u: string, p: Promise<string>){
    const response = await fetch(`/api/people`, {
      method: "POST",
      body: JSON.stringify({
        username: u,
        password: p
      })
    })

    if (response.ok){
      const { event } = await response.json()
      
    }
    else{
      setError("Invalid Credentials")
    }
  }

  return (
    <div className="bg-gradient-to-bl from-pink-100 to-purple-500 h-screen text-white flex items-center justify-center">
      <div className="bg-white/65 w-3/4 rounded-md flex flex-col h-auto p-10 shadow-lg">

        <div className="absolute top-0 right-0 flex flex-row justify-end p-10 items-end text-black w-1/4 gap-5">
          <Button href="/" text="Home" type="normal" />
          <Button href="/Login" text="Login" type="normal" />
          <Button href="/SignUp" text="Sign up" type="normal" />
        </div>

        <div className="h-1/2 flex flex-col items-center justify-center text-black gap-5">
          <h1 className="text-7xl font-bold">Sign Up</h1>
          <h4 className="text-lg">{error}</h4>
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
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition font-semibold shadow-md"
          >
            Submit
          </button>
        </form>

        <p className="p-10 flex flex-row text-black justify-center text-sm">Accessify 2025</p>
      </div>
    </div>
  );
}
