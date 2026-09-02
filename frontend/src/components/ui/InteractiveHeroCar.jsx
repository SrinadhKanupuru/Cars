import React, { useState } from 'react';

export function InteractiveHeroCar() {
  const [lightsOn, setLightsOn] = useState(false);

  return (
    <div
      className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] flex items-center justify-center cursor-pointer select-none group"
      onMouseEnter={() => setLightsOn(true)}
      onMouseLeave={() => setLightsOn(false)}
      onTouchStart={() => setLightsOn(true)}
      onTouchEnd={() => setLightsOn(false)}
      onClick={() => setLightsOn(!lightsOn)}
    >
      {/* 1. Realistic Road / Tarmac Illumination Spread */}
      <div
        className={`absolute inset-x-8 bottom-0 h-48 bg-gradient-to-t from-amber-400/20 via-amber-200/10 to-transparent blur-3xl pointer-events-none transition-opacity duration-500 ease-out ${
          lightsOn ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 2. Main High-Resolution Supercar Image */}
      <div className="relative w-full h-full flex items-center justify-center p-2">
        <img
          src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80"
          alt="Lamborghini Huracán Performante"
          className={`w-full h-full object-contain filter drop-shadow-2xl transition-all duration-500 ease-out ${
            lightsOn ? 'brightness-105 contrast-105' : 'brightness-95'
          }`}
        />

        {/* ========================================================================= */}
        {/* 3. PHOTOREALISTIC Y-LED HEADLIGHT DRL IGNITION (HUGGING THE ACTUAL LENSES) */}
        {/* ========================================================================= */}

        {/* LEFT HEADLIGHT (Exact Huracán Y-Shape DLR Cluster) */}
        <div
          className={`absolute left-[42.5%] top-[58.5%] pointer-events-none transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${
            lightsOn ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          {/* Internal Y-DLR LED Core Glow */}
          <div
            className="w-20 h-9 bg-gradient-to-r from-amber-300 via-amber-100 to-white blur-[3px] mix-blend-screen transform rotate-[14deg]"
            style={{
              clipPath: 'polygon(15% 10%, 100% 35%, 85% 95%, 0% 75%)'
            }}
          />

          {/* Intense Lens Flare Hotspot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-6 bg-white blur-[3px] rounded-full shadow-[0_0_20px_6px_rgba(255,220,120,0.95)]" />

          {/* Soft Optical Flare Beam Horizon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-1.5 bg-gradient-to-r from-transparent via-amber-100 to-transparent blur-[1px] opacity-80" />
        </div>

        {/* RIGHT HEADLIGHT (Exact Huracán Right Lens Cluster) */}
        <div
          className={`absolute left-[76.5%] top-[56.5%] pointer-events-none transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${
            lightsOn ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          {/* Internal Right DLR Core Glow */}
          <div
            className="w-14 h-7 bg-gradient-to-r from-white via-amber-100 to-amber-300 blur-[3px] mix-blend-screen transform -rotate-[16deg]"
            style={{
              clipPath: 'polygon(0% 40%, 85% 10%, 100% 70%, 15% 95%)'
            }}
          />

          {/* Intense Lens Flare Hotspot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-5 bg-white blur-[3px] rounded-full shadow-[0_0_20px_6px_rgba(255,220,120,0.95)]" />

          {/* Soft Optical Flare Beam Horizon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-1.5 bg-gradient-to-r from-transparent via-amber-100 to-transparent blur-[1px] opacity-80" />
        </div>
      </div>

      {/* 4. Minimal Glowing Status Pill (No Tooltips, Clean Luxury Design) */}
      <div className="absolute bottom-2 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-slate-800 shadow-lg pointer-events-none transition-opacity duration-300">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            lightsOn ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-600'
          }`}
        />
        <span className="tracking-wider uppercase">
          {lightsOn ? 'LED MATRIX ON' : 'HOVER FOR LIGHTS'}
        </span>
      </div>
    </div>
  );
}
