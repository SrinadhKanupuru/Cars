import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Volume2, Bot, Zap, MessageSquare } from 'lucide-react';

export function TransformerHeroCar() {
  const [isRobot, setIsRobot] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speechTimeoutRef = useRef(null);

  const speakGreeting = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Hello! Welcome to SpeedX Motors.");
      utterance.rate = 1.0;
      utterance.pitch = 0.85; // Slightly robotic/heroic pitch
      utterance.volume = 1.0;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMouseEnter = () => {
    setIsRobot(true);
    // Slight delay to sync with the visual transformation
    speechTimeoutRef.current = setTimeout(() => {
      speakGreeting();
    }, 200);
  };

  const handleMouseLeave = () => {
    setIsRobot(false);
    setSpeaking(false);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative w-full h-[340px] sm:h-[430px] lg:h-[480px] flex items-center justify-center cursor-pointer select-none group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => {
        if (!isRobot) {
          handleMouseEnter();
        } else {
          handleMouseLeave();
        }
      }}
    >
      {/* Ambient Cyber / Engine Glow Aura */}
      <div
        className={`absolute inset-0 rounded-3xl blur-3xl pointer-events-none transition-all duration-700 ${
          isRobot
            ? 'bg-gradient-to-tr from-brand-600/20 via-red-500/15 to-blue-500/20 opacity-100 scale-105'
            : 'bg-brand-600/10 opacity-60 scale-95'
        }`}
      />

      {/* Interactive Speech Holographic Bubble */}
      <div
        className={`absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-500 transform ${
          isRobot
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-3 scale-90'
        }`}
      >
        <div className="flex items-center gap-2.5 bg-slate-950/95 text-white px-4 py-2.5 rounded-2xl border-2 border-brand-500 shadow-2xl backdrop-blur-md">
          <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center animate-pulse shrink-0 text-white">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-brand-400 font-bold uppercase tracking-widest block leading-none">
              SpeedX Autobot AI
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-white font-display mt-0.5 whitespace-nowrap">
              👋 "Hello! Welcome to SpeedX Motors."
            </p>
          </div>
          {speaking && (
            <span className="flex items-center gap-0.5 text-brand-500 pl-1">
              <span className="w-1 h-3 bg-brand-500 rounded-full animate-bounce" />
              <span className="w-1 h-4 bg-brand-500 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0.3s]" />
            </span>
          )}
        </div>
        {/* Downward Pointer Arrow */}
        <div className="w-3 h-3 bg-slate-950 border-r-2 border-b-2 border-brand-500 transform rotate-45 mx-auto -mt-1.5" />
      </div>

      {/* Transformation Stage Container */}
      <div className="relative w-full h-full flex items-center justify-center p-2">
        
        {/* 1. SPORTS CAR MODE (Visible when NOT hovered) */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
            isRobot
              ? 'opacity-0 scale-90 rotate-[-2deg] blur-xs pointer-events-none'
              : 'opacity-100 scale-100 rotate-0 blur-none'
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80"
            alt="SPEEDX Flagship Hypercar"
            className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* 2. MECHA ROBOT TRANSFORMER MODE (Visible when HOVERED) */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
            isRobot
              ? 'opacity-100 scale-100 rotate-0 blur-none'
              : 'opacity-0 scale-110 rotate-[2deg] blur-xs pointer-events-none'
          }`}
        >
          <img
            src="/speedx-robot.jpg"
            alt="SPEEDX Mecha Transformer Robot"
            className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(225,29,72,0.3)] animate-pulse-subtle"
          />
        </div>
      </div>

      {/* Interactive Mode Badge */}
      <div className="absolute bottom-2 right-4 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full border border-slate-800 shadow-xl transition-all">
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            isRobot ? 'bg-brand-500 animate-ping shadow-[0_0_10px_#e11d48]' : 'bg-emerald-500'
          }`}
        />
        <span className="tracking-wider uppercase">
          {isRobot ? '🤖 AUTOBOT TRANSFORMED' : 'HOVER TO TRANSFORM & GREET'}
        </span>
      </div>
    </div>
  );
}
