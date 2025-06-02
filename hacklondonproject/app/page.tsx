"use client"

import Button from "./components/button";
import FeatureSection from "./components/FeatureSection";

export default function Home() {
  
  return (
    <div className="h-500 overflow-y-auto bg-white [background:radial-gradient(100%_100%_at_50%_10%,#fff_20%,#63e_100%)] text-white">
      <div className="bg-white/5 w-full rounded-md flex flex-col h-full overflow-y-auto">
        <div className="flex flex-col gap-10 justify-items">

        
          <div className = "absolute top-0 right-0 flex flex-row justify-end p-10 items-end text-black w-1/4 gap-5">

            <Button  href = "/" text = "Home" type = "normal"/>
            <Button  href = "#target" text = "FAQ" type = "normal"/>
          </div>

          <div className="m-45 h-1/3 items-center flex flex-col justify-center text-black gap-5 ">

            <h1 className="text-8xl">accessify</h1>
            <h4>AI-Powered Learning for Dyslexia</h4>
          </div>
          
          <div className="items-center flex flex-col -mt-30 text-black">
            < Button href = "Learning" text = "Get started" type = "padded" />
          </div>
          

          <div className="h-1/3 items-center flex flex-col justify-center text-black gap-5 mt-10">

            <FeatureSection />
            
          </div>

          <div id = "target" className="h-1/3 items-center flex flex-col p-2 text-black gap-7 mt-30">

            <h1 className="text-4xl">Frequently Asked Questions</h1>
            <h4 className="text-xl font-bold">How does Accessify Help?</h4>
            <div className= "max-w-2xl mx-auto items-center flex flex-col justify-center text-center">
              <p>Accessify is a dyslexia-friendly learning platform and web extension that enhances readability with dyslexia-friendly fonts, AI-powered text simplification, and text-to-speech. It offers customizable accessibility features like contrast adjustments, distraction-free mode, and adaptive learning exercises, making digital content more inclusive, engaging, and easy to navigate. </p>
            </div>
            <h4 className="text-xl font-bold">What Does Our Educational Plan Offer?</h4>
            <div className= "max-w-2xl mx-auto items-center flex flex-col justify-center  text-center">
              <p>Users can engage in interactive learning activities like gamified spelling exercises, phonics training, and comprehension challenges. The platform also provides distraction-free reading modes, adaptive difficulty levels, and voice navigation to enhance accessibility. With personalized learning paths and multi-sensory tools, Accessify makes digital learning more inclusive, engaging, and supportive for users with dyslexia and other cognitive challenges </p>
            </div>
            <h4 className="text-xl font-bold">How does Accessify protect student privacy?</h4>
            <div className= "max-w-2xl mx-auto items-center flex flex-col justify-center  text-center">
              <p>Student privacy is our top priority. We use anonymized data, and comply with GDPR & COPPA. </p>
            </div>
            
          </div>

          <p className = "p-10 items-center justify-center flex flex-col text-black gap-5">Accessify 2025</p>

        </div>
      </div>
      
    </div>
  );
}
