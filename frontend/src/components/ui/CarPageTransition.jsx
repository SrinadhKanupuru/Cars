import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Zap, Gauge } from 'lucide-react';

export function CarPageTransition({ children }) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathRef = useRef(location.pathname);
  const isFirstMount = useRef(true);

  // Derive human-readable destination name
  const getDestinationName = (path) => {
    if (path === '/') return 'SHOWROOM SANCTUARY';
    if (path.startsWith('/inventory/')) return 'TELEMETRY DOSSIER';
    if (path === '/inventory') return 'HYPERCAR INVENTORY';
    if (path === '/brands') return 'PRESTIGIOUS MARQUES';
    if (path === '/services') return 'CONCIERGE SERVICES';
    if (path === '/about') return 'SPEEDX HERITAGE';
    if (path === '/contact') return 'CLIENT RELATIONS';
    if (path === '/login') return 'PORTAL ACCESS';
    if (path === '/register') return 'VIP APPLICATION';
    if (path.startsWith('/customer')) return 'VIP GARAGE';
    if (path.startsWith('/admin')) return 'PRINCIPAL CONSOLE';
    return 'SPEEDX FLEET';
  };

  useEffect(() => {
    // Avoid animating on initial cold mount, only on route changes
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevPathRef.current = location.pathname;
      return;
    }

    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      window.scrollTo({ top: 0, behavior: 'instant' });

      setIsTransitioning(true);
      setProgress(0);

      const startTime = performance.now();
      const duration = 1400; // Smooth, cinematic 1.4s transition so the car moves at a clear, leisurely pace

      const step = (now) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        
        // Smooth ease-in-out easing for realistic acceleration
        const easedProgress = rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

        setProgress(easedProgress);

        if (rawProgress < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(() => {
            setIsTransitioning(false);
            setProgress(0);
          }, 80);
        }
      };

      requestAnimationFrame(step);
    }
  }, [location.pathname]);

  return (
    <>
      {/* 1. TOP SPEED NEON LASER LINE */}
      {isTransitioning && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-slate-900 pointer-events-none overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-rose-500 to-amber-400 shadow-[0_0_15px_rgba(225,29,72,0.9)] transition-all ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* 2. FULLSCREEN CAR MOVING TRANSITION OVERLAY */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between items-center overflow-hidden bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
          
          {/* Top Destination Header */}
          <div className="pt-8 sm:pt-12 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] shadow-glow-red">
              <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
              <span>TRANSITIONING TO: {getDestinationName(location.pathname)}</span>
            </div>
          </div>

          {/* Center: THE SPEEDING HYPERCAR ACROSS THE SCREEN */}
          <div className="relative w-full h-44 sm:h-52 flex items-center justify-center overflow-hidden">
            
            {/* Speed Motion Lines in Background */}
            <div className="absolute inset-x-0 h-28 flex flex-col justify-around opacity-40">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />
            </div>

            {/* Asphalt Road with Moving Dash Marks */}
            <div className="absolute bottom-6 inset-x-0 h-6 bg-slate-900 border-y border-slate-800 flex items-center">
              <div className="w-full h-[2px] bg-[repeating-linear-gradient(90deg,#f8fafc_0px,#f8fafc_24px,transparent_24px,transparent_48px)] opacity-60 animate-shimmer" />
            </div>

            {/* The Moving Sports Car Container (Flies from Left -15% to Right 115%) */}
            <div
              className="absolute bottom-7 left-0 will-change-transform flex items-center"
              style={{
                transform: `translateX(${progress * 125 - 15}vw)`,
                transition: 'transform 16ms linear'
              }}
            >
              {/* Wind Drag & Light Speed Trail behind car */}
              <div className="w-48 sm:w-72 h-14 bg-gradient-to-r from-transparent via-brand-600/60 to-brand-500/90 blur-xs rounded-l-full transform -skew-x-12 opacity-80" />

              {/* Glowing Exhaust Flames */}
              <div className="relative -ml-4 flex items-center">
                <span className="w-10 h-3 bg-gradient-to-r from-transparent via-cyan-400 to-yellow-300 rounded-full blur-2xs animate-pulse" />
              </div>

              {/* Supercar Vector Graphic */}
              <div className="relative w-44 sm:w-56 h-20 -ml-3 filter drop-shadow-[0_8px_16px_rgba(225,29,72,0.6)]">
                <svg viewBox="0 0 240 80" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="carBodyGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#be123c" />
                      <stop offset="40%" stopColor="#e11d48" />
                      <stop offset="80%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="#ffe4e6" />
                    </linearGradient>
                    <linearGradient id="glassGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                    </linearGradient>
                    <radialGradient id="headlightBeam" cx="0%" cy="50%" r="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Forward Headlight High-Beam Light Cone */}
                  <polygon points="225,48 380,20 380,75 225,56" fill="url(#headlightBeam)" />

                  {/* Aerodynamic Low-slung Sports Car Body Silhouette */}
                  <path
                    d="M 15 54 L 35 54 Q 45 42 70 42 L 120 42 Q 145 28 175 28 L 195 38 L 225 48 Q 235 52 235 58 L 230 62 L 15 62 Z"
                    fill="url(#carBodyGradient)"
                  />

                  {/* Cockpit Canopy Glass */}
                  <path
                    d="M 85 42 L 120 42 Q 138 32 165 32 L 178 40 L 140 42 Z"
                    fill="url(#glassGradient)"
                    stroke="#38bdf8"
                    strokeWidth="0.75"
                  />

                  {/* Rear Wing / Spoiler */}
                  <path d="M 10 38 L 30 38 L 26 44 L 14 44 Z" fill="#0f172a" />
                  <line x1="18" y1="44" x2="18" y2="54" stroke="#0f172a" strokeWidth="2.5" />

                  {/* Rear Red Neon Light Bar */}
                  <line x1="12" y1="52" x2="25" y2="52" stroke="#ff1e38" strokeWidth="3" strokeLinecap="round" />

                  {/* Front Laser Headlight */}
                  <circle cx="228" cy="52" r="3" fill="#ffffff" />
                  <circle cx="228" cy="52" r="6" fill="#38bdf8" opacity="0.6" />

                  {/* Rear Wheel with Spinning Rim */}
                  <g transform="translate(55, 60)">
                    <circle cx="0" cy="0" r="14" fill="#090d16" stroke="#475569" strokeWidth="2" />
                    <circle cx="0" cy="0" r="8" fill="#1e293b" />
                    {/* Spinning Spokes */}
                    <line x1="-7" y1="0" x2="7" y2="0" stroke="#e2e8f0" strokeWidth="1.5" className="animate-spin" />
                    <line x1="0" y1="-7" x2="0" y2="7" stroke="#e2e8f0" strokeWidth="1.5" className="animate-spin" />
                    <circle cx="0" cy="0" r="3" fill="#e11d48" />
                  </g>

                  {/* Front Wheel with Spinning Rim */}
                  <g transform="translate(190, 60)">
                    <circle cx="0" cy="0" r="14" fill="#090d16" stroke="#475569" strokeWidth="2" />
                    <circle cx="0" cy="0" r="8" fill="#1e293b" />
                    {/* Spinning Spokes */}
                    <line x1="-7" y1="0" x2="7" y2="0" stroke="#e2e8f0" strokeWidth="1.5" className="animate-spin" />
                    <line x1="0" y1="-7" x2="0" y2="7" stroke="#e2e8f0" strokeWidth="1.5" className="animate-spin" />
                    <circle cx="0" cy="0" r="3" fill="#e11d48" />
                  </g>
                </svg>
              </div>
            </div>

          </div>

          {/* Bottom Telemetry HUD Ribbon */}
          <div className="pb-8 sm:pb-12 text-center">
            <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              <span className="text-cyan-400 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" /> {Math.round(progress * 280 + 60)} KM/H
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">GEAR {Math.min(7, Math.floor(progress * 6) + 1)}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">V12 TWIN-TURBO ONLINE</span>
            </div>
          </div>

        </div>
      )}

      {/* 3. PAGE CONTENT WITH SLIDE/FADE REVEAL */}
      <div className="w-full min-h-screen transition-opacity duration-300">
        {children}
      </div>
    </>
  );
}
