"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


interface ButtonProps{
  href:string
  type?: string
  text: string

}

export default function Button({href, type, text} : ButtonProps) {
  const router = useRouter()

  
  function handleClick(){
    if (href){
      router.push(href)
    }

  }


  return (
  
    <div>
      
      <button className = { `${type == 'normal' ? 'text-black': 'text-black px-3 py-3 bg-sky-600 hover:bg-amber-200'} font-bold text-xl transition-all duration-300 rounded-xl cursor-pointer`} onClick = {handleClick}>{text}</button>
    
    </div>
      



   
  )
}
