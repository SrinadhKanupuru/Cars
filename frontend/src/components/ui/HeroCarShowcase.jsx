import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Flame, Gauge, RotateCcw } from 'lucide-react';

export const showcaseCars = [
  {
    id: 'huracan-evo',
    brand: 'LAMBORGHINI',
    model: 'Huracán EVO',
    badge: 'FLAGSHIP V10',
    hp: '631 HP',
    accel: '2.9s',
    topSpeed: '325 km/h',
    price: '$325,000',
    colorHex: '#ea580c',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '488-pista',
    brand: 'FERRARI',
    model: '488 Pista',
    badge: 'TRACK MASTERPIECE',
    hp: '710 HP',
    accel: '2.85s',
    topSpeed: '340 km/h',
    price: '$495,000',
    colorHex: '#dc2626',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'mclaren-720s',
    brand: 'MCLAREN',
    model: '720S Performance',
    badge: 'APEX VELOCITY',
    hp: '710 HP',
    accel: '2.8s',
    topSpeed: '341 km/h',
    price: '$345,000',
    colorHex: '#f97316',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '911-turbo-s',
    brand: 'PORSCHE',
    model: '911 Turbo S',
    badge: 'ALL-WEATHER BENCHMARK',
    hp: '640 HP',
    accel: '2.6s',
    topSpeed: '330 km/h',
    price: '$289,000',
    colorHex: '#64748b',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
  }
];

export function HeroCarShowcase({ onSelectCar }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [phase, setPhase] = useState('driving');

  const activeCar = showcaseCars[selectedIdx] || showcaseCars[0];

  const triggerAnimation = (idx = selectedIdx) => {
    setSelectedIdx(idx);
    setAnimKey(prev => prev + 1);
    setPhase('driving');
  };

  useEffect(() => {
    const tBraking = setTimeout(() => setPhase('braking'), 4800);
    const tStopped = setTimeout(() => setPhase('stopped'), 5800);
    const tSpecs = setTimeout(() => setPhase('specs'), 6500);
    const tSelector = setTimeout(() => setPhase('selector'), 7500);

    return () => {
      clearTimeout(tBraking);
      clearTimeout(tStopped);
      clearTimeout(tSpecs);
      clearTimeout(tSelector);
    };
  }, [animKey]);

  const handleSelect = (idx) => {
    triggerAnimation(idx);
    if (onSelectCar) onSelectCar(showcaseCars[idx]);
  };

  const showSpecs = phase === 'specs' || phase === 'selector';
  const showSelector = phase === 'selector';

  return (
    <div className="w-full flex flex-col items-center justify-center select-none relative overflow-hidden">
      
      {/* Replay Cinematic Drive-in Button */}
      <div className="absolute top-2 left-2 sm:left-4 z-30">
        <button
          type="button"
          onClick={() => triggerAnimation()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 hover:bg-brand-600 border border-slate-800/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all shadow-lg cursor-pointer"
          title="Replay drive-in animation"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Replay Drive-in</span>
        </button>
      </div>

      {/* Main Cinematic Automotive Stage */}
      <div 
        key={animKey}
        className="relative w-full h-[340px] sm:h-[430px] lg:h-[480px] xl:h-[520px] flex items-center justify-center overflow-hidden"
      >
        {/* Ambient Ground Lighting / Horizon Reflection */}
        <div 
          className="absolute inset-x-6 bottom-4 h-44 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse at center, ${activeCar.colorHex} 0%, rgba(225, 29, 72, 0.15) 45%, transparent 75%)`
          }}
        />

        {/* Dynamic Headlight Beam Flares on Drive-In */}
        <div
          className="absolute left-[38%] top-[55%] w-32 h-16 bg-gradient-to-r from-amber-100/40 via-white/20 to-transparent blur-md rounded-full pointer-events-none transform -rotate-6"
          style={{
            animation: 'headlightPulse 6s ease-out forwards',
          }}
        />

        {/* ========================================================================= */}
        {/* PHYSICAL DRIVING VEHICLE CONTAINER */}
        {/* ========================================================================= */}
        <div
          className="relative w-full h-full flex items-center justify-center p-2"
          style={{
            animation: 'supercarDriveIn 6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Dynamic Ground Shadow */}
          <div 
            className="absolute bottom-6 w-[80%] h-12 bg-black/60 blur-xl rounded-full pointer-events-none transform scale-y-50"
            style={{
              animation: 'groundShadow 6s ease-out forwards'
            }}
          />

          {/* High-Resolution Vehicle Visual */}
          <img
            src={activeCar.image}
            alt={`${activeCar.brand} ${activeCar.model}`}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80';
            }}
            className="w-full h-full object-contain filter drop-shadow-[0_30px_45px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-out"
          />
        </div>

        {/* ========================================================================= */}
        {/* PERFORMANCE SPECIFICATION CARDS (Reveals at 6.5s) */}
        {/* ========================================================================= */}
        <div 
          className={`absolute bottom-3 left-3 sm:left-6 z-20 flex flex-wrap items-center gap-2 transition-all duration-700 ease-out transform ${
            showSpecs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-white shadow-xl">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">0–100</span>
            <span className="text-xs font-black font-display text-white pl-0.5">{activeCar.accel}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-white shadow-xl">
            <Flame className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">POWER</span>
            <span className="text-xs font-black font-display text-white pl-0.5">{activeCar.hp}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-white shadow-xl">
            <Gauge className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">V-MAX</span>
            <span className="text-xs font-black font-display text-white pl-0.5">{activeCar.topSpeed}</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* BRAND & MODEL SELECTOR (Reveals at 7.5s) */}
      {/* ========================================================================= */}
      <div 
        className={`w-full max-w-xl mt-2 px-2 transition-all duration-700 ease-out transform ${
          showSelector ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md grid grid-cols-2 sm:grid-cols-4 gap-1.5 shadow-2xl">
          {showcaseCars.map((car, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={car.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-md font-black scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-semibold'
                }`}
              >
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-tight line-clamp-1">
                  {car.brand}
                </span>
                <span className={`text-[9px] font-bold leading-tight line-clamp-1 ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>
                  {car.model}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Embedded Dynamic Keyframe Animations */}
      <style>{`
        @keyframes supercarDriveIn {
          0% {
            transform: translate3d(140%, 8px, 0) scale(0.92) rotate(1deg);
            opacity: 0;
            filter: blur(4px);
          }
          20% {
            transform: translate3d(100%, 4px, 0) scale(0.95) rotate(0.8deg);
            opacity: 1;
            filter: blur(1.5px);
          }
          65% {
            transform: translate3d(8%, -2px, 0) scale(0.99) rotate(-0.3deg);
            filter: blur(0px);
          }
          80% {
            transform: translate3d(-3%, 4px, 0) scale(1.01) rotate(-1.2deg);
          }
          90% {
            transform: translate3d(0.5%, -1px, 0) scale(1.0) rotate(0.2deg);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1.02) rotate(0deg);
            filter: blur(0px);
          }
        }

        @keyframes groundShadow {
          0% {
            opacity: 0;
            transform: translate3d(120%, 0, 0) scaleX(0.7);
          }
          30% {
            opacity: 0.6;
            transform: translate3d(70%, 0, 0) scaleX(0.9);
          }
          80% {
            opacity: 0.85;
            transform: translate3d(-2%, 0, 0) scaleX(1.05);
          }
          100% {
            opacity: 0.75;
            transform: translate3d(0, 0, 0) scaleX(1);
          }
        }

        @keyframes headlightPulse {
          0% { opacity: 0; transform: translate3d(60px, 0, 0) scale(0.5); }
          40% { opacity: 0.8; transform: translate3d(20px, 0, 0) scale(1.2); }
          80% { opacity: 0.9; transform: translate3d(0, 0, 0) scale(1); }
          100% { opacity: 0.6; transform: translate3d(0, 0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
}
