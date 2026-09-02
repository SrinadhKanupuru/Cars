import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Gauge, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  Star, 
  Truck, 
  Calendar, 
  Heart, 
  Users,
  Clock,
  Car,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { CarCard } from '../../components/ui/CarCard';
import { TestDriveModal } from '../../components/ui/TestDriveModal';
import { EnquiryModal } from '../../components/ui/EnquiryModal';
import { BrandMarquee } from '../../components/ui/BrandMarquee';
import { formatPrice } from '../../utils/cn';

export function Home() {
  const { cars, toggleWishlist, isWishlisted } = useApp();
  const navigate = useNavigate();

  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedCarForDrive, setSelectedCarForDrive] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const videoRef = React.useRef(null);

  // Time in seconds when the car finishes slowing down and stops
  const CAR_STOP_TIME = 4.0;

  const handleTimeUpdate = (e) => {
    const video = e.currentTarget;
    if (video.duration && video.currentTime >= video.duration - 0.2) {
      video.pause();
      setShowContent(true);
      return;
    }
    if (video.currentTime >= CAR_STOP_TIME && !showContent) {
      setShowContent(true);
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowContent(true);
  };

  // Fallback timer to guarantee content shows even if autoplay is delayed
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 4800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenDriveModal = (car) => {
    setSelectedCarForDrive(car || cars[0]);
    setTestDriveModalOpen(true);
  };

  // Top 4 Featured Sports Cars (Huracán, 488 Pista, 720S, 911 Turbo S)
  const featuredCars = [
    cars.find(c => c.id === 'huracan-evo') || cars[1],
    cars.find(c => c.id === '488-pista') || cars[0],
    cars.find(c => c.id === 'mclaren-720s') || cars[2],
    cars.find(c => c.id === '911-turbo-s') || cars[3],
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. CINEMATIC SUNSET ADVENTURE HERO SECTION WITH REVEAL-ON-STOP ANIMATION */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-between pt-12 pb-8 lg:py-16 bg-[#0c0805] overflow-hidden border-b border-amber-950/40">
        
        {/* Full Hero Background Layer - Cinematic Background Video from public */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#0c0805]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.08] scale-100 transition-transform duration-1000 ease-out"
          >
            <source src="/it_will_not_come_as_you_give_i.mp4" type="video/mp4" />
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Cinematic Overlays: Warm golden dusk atmospheric lighting and contrast */}
          <div className={`absolute inset-0 bg-gradient-to-r from-[#0c0805]/95 via-[#0c0805]/70 lg:via-[#0c0805]/45 to-transparent transition-opacity duration-1000 ${
            showContent ? 'opacity-100' : 'opacity-60'
          }`} />
          <div className={`absolute inset-0 bg-gradient-to-t from-[#0c0805] via-transparent to-[#0c0805]/60 transition-opacity duration-1000 ${
            showContent ? 'opacity-100' : 'opacity-60'
          }`} />
          <div className="absolute inset-0 bg-radial-[at_75%_30%] from-amber-600/20 via-transparent to-transparent mix-blend-screen" />
        </div>

        {/* Main Hero Headline & Content Container - Fades and Slides In When Car Stops */}
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 flex-1 flex items-center relative z-20">
          <div className="max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-8">
            
            {/* Main Headline (Reveals smoothly when car stops) */}
            <div className={`space-y-3 transition-all duration-1000 delay-200 ease-out transform ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-display tracking-tight leading-[1.04] text-white">
                MOVING <br />
                FORWARD, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500">
                  SMARTER
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-200 font-normal pt-1 max-w-xl leading-relaxed drop-shadow-md">
                Discover next-generation sports cars, off-road hypercars, and certified collector marques engineered for supreme exhilaration.
              </p>
            </div>

            {/* Dual Action Buttons (Reveals smoothly when car stops) */}
            <div className={`flex flex-wrap items-center gap-3.5 pt-1 transition-all duration-1000 delay-500 ease-out transform ${
              showContent ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'
            }`}>
              <Link to="/inventory">
                <button
                  type="button"
                  className="bg-white hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider px-9 py-4 rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 font-display"
                >
                  <span>UPGRADE NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <button
                type="button"
                onClick={() => handleOpenDriveModal(cars[0])}
                className="bg-slate-950/70 hover:bg-slate-900 text-white border border-amber-400/30 font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-4 rounded-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>BOOK A TEST DRIVE</span>
              </button>
            </div>

            {/* Stat Ribbon Cards (Staggered reveal when car stops) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-amber-500/20">
              <div className={`flex items-center gap-3 p-3.5 rounded-2xl bg-[#140e09]/85 backdrop-blur-md border border-amber-500/20 shadow-lg hover-lift transition-all duration-700 delay-700 ease-out transform ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-black font-display text-white block leading-tight">100+</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">PREMIUM CARS</span>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3.5 rounded-2xl bg-[#140e09]/85 backdrop-blur-md border border-amber-500/20 shadow-lg hover-lift transition-all duration-700 delay-[850ms] ease-out transform ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-black font-display text-white block leading-tight">20+</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">TOP BRANDS</span>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3.5 rounded-2xl bg-[#140e09]/85 backdrop-blur-md border border-amber-500/20 shadow-lg hover-lift transition-all duration-700 delay-[1000ms] ease-out transform ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-black font-display text-white block leading-tight">500+</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">HAPPY CLIENTS</span>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3.5 rounded-2xl bg-[#140e09]/85 backdrop-blur-md border border-amber-500/20 shadow-lg hover-lift transition-all duration-700 delay-[1150ms] ease-out transform ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-black font-display text-white block leading-tight">15+</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">YEARS OF TRUST</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Hero Footer Tagline & Scroll Indicator */}
        <div className={`w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-500/20 transition-all duration-1000 delay-1000 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 text-center sm:text-left">
            TOP-QUALITY AUTOMOTIVE PRODUCTS, ENGINEERED FOR PERFORMANCE
          </p>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono">SCROLL DOWN</span>
            <div className="w-6 h-6 rounded-full border border-amber-400/40 flex items-center justify-center text-amber-400 animate-bounce">
              ↓
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED SPORTS CARS SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600 block mb-1">
                HANDPICKED SHOWROOM
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tight text-slate-950">
                FEATURED SPORTS CARS
              </h2>
            </div>
            <Link 
              to="/inventory" 
              className="text-xs font-black uppercase tracking-wider text-slate-800 hover:text-brand-600 transition-colors flex items-center gap-1.5 group self-start sm:self-auto"
            >
              <span>VIEW FULL INVENTORY</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => {
              const wishlisted = isWishlisted(car.id);
              return (
                <div
                  key={car.id}
                  className="group rounded-3xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Area with Heart */}
                    <Link 
                      to={`/inventory/${car.id}`}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-50 mb-3 flex items-center justify-center p-2 block cursor-pointer"
                    >
                      <img
                        src={car.images[0]}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(car.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-brand-600 shadow-md transition-all cursor-pointer"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${wishlisted ? "fill-brand-600 text-brand-600" : ""}`} />
                      </button>
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider">
                        {car.year}
                      </span>
                    </Link>

                    {/* Make & Model */}
                    <Link to={`/inventory/${car.id}`} className="block hover:text-brand-600 transition-colors">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{car.brand}</p>
                      <h3 className="text-base font-black uppercase font-display text-slate-950 line-clamp-1">
                        {car.model}
                      </h3>
                    </Link>

                    {/* Price */}
                    <p className="text-lg font-black text-brand-600 mt-2 font-display">
                      {formatPrice(car.price)}
                    </p>

                    {/* Specs underneath */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                      <span>{car.horsepower} HP</span>
                      <span>•</span>
                      <span>{car.zeroToHundred || '2.9s'} 0-100</span>
                      <span>•</span>
                      <span>{car.mileage || '1,200 km'}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link to={`/inventory/${car.id}`} className="block w-full">
                      <button
                        type="button"
                        className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OUR PREMIUM BRANDS MARQUEE (DYNAMIC INFINITE TICKER) */}
      {/* ========================================================================= */}
      <BrandMarquee />

      {/* Modals */}
      <TestDriveModal
        isOpen={testDriveModalOpen}
        onClose={() => setTestDriveModalOpen(false)}
        selectedCar={selectedCarForDrive}
      />
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        selectedCar={selectedCarForDrive}
      />
    </div>
  );
}
