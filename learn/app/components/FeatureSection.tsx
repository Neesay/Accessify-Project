"use client"

import { MdBackpack } from "react-icons/md";
import { MdKeyboardVoice } from "react-icons/md";
import { FaCompass } from "react-icons/fa";
import { MdHeadsetMic } from "react-icons/md";
import { BiNoEntry } from "react-icons/bi";
import { FaCameraRetro } from "react-icons/fa";


export default function FeaturesSection() {
    return (
      <section className="relative py-16">
        
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900">Breaking Down Boundaries</h2>
          <p className="text-black mt-2">
            We're dedicated to creating the most <span className="font-bold">advanced, accessible,</span> and <span className="font-bold">affordable</span> literacy app available, combining the latest & greatest technologies.
          </p>
        </div>
  
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          
          <div className="flex items-center space-x-4">
            <MdKeyboardVoice className="w-12 h-12" />
            <div>
              <h3 className="text-lg font-semibold text-black">Voice Recognition</h3>
              <p className="text-black">AI-powered voice recognition to test your reading & pronunciation!</p>
            </div>
          </div>
  
          <div className="flex items-center space-x-4">
            <MdHeadsetMic className="w-12 h-12" />
            <div>
              <h3 className="text-lg font-semibold text-black">Phonics</h3>
              <p className="text-black">
                A structured, multisensory learning approach that helps learners decode language.
              </p>
            </div>
          </div>
  
          <div className="flex items-center space-x-4">
            <MdBackpack className="w-12 h-12" />
            <div>
              <h3 className="text-lg font-semibold text-black">Thousands of Words</h3>
              <p className="text-black">
                Our dictionary contains thousands of words categorized by difficulty and frequency.
              </p>
            </div>
          </div>
  
          <div className="flex items-center space-x-4">
            <FaCameraRetro className="w-12 h-12" />
            <div>
              <h3 className="text-lg font-semibold text-black">Vision</h3>
              <p className="text-black">
                Need help reading? Take a photo in the app, and we'll read the text back to you!
              </p>
            </div>
          </div>
  
          <div className="flex items-center space-x-4">
            <BiNoEntry className="w-12 h-12 flex-shrink-0:" />
            <div>
              <h3 className="text-lg font-semibold text-black">No Ads</h3>
              <p className="text-black">And there never will be!</p>
            </div>
          </div>
  
          <div className="flex items-center space-x-4 ">
            <FaCompass className="w-12 h-12 flex-shrink-0:" />
            <div>
              <h3 className="text-lg font-semibold text-black">GDPR Compliant</h3>
              <p className="text-black">We take your data & privacy seriously.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }