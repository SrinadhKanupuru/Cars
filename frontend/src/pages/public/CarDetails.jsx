import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  ChevronLeft,
  ChevronRight,
  Gauge,
  Zap,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Activity,
  FileText,
  Search,
  MapPin,
  ShieldCheck,
  Fuel,
  Cpu,
  Radio,
  Sliders,
  Wrench,
  User,
  ArrowRight,
  TrendingUp,
  Download,
  AlertCircle,
  Volume2,
  VolumeX,
  Flame,
  Maximize2,
  X,
  RotateCcw,
  Compass,
  DollarSign,
  Calculator,
  Award,
  Check,
  Eye,
  SlidersHorizontal,
  Play,
  Pause,
  RefreshCw,
  Move
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { TestDriveModal } from '../../components/ui/TestDriveModal';
import { EnquiryModal } from '../../components/ui/EnquiryModal';
import { formatPrice } from '../../utils/cn';
import { engineSound } from '../../utils/engineAudio';

// Dynamic telemetry and sensor generator for each unique car
export const getCarTelemetry = (car) => {
  if (!car) return {
    fuelTitle: 'Fuel Level',
    fuelLabel: '98 Octane Ready',
    fuelLevel: 85,
    rangeKm: 580,
    systemScore: 95,
    diagnosticScore: 98,
    flPsi: 32,
    frPsi: 32,
    rlPsi: 34,
    rrPsi: 34,
    flTemp: 42,
    frTemp: 42,
    rlTemp: 48,
    rrTemp: 48,
    brakingDist: '31.2 m',
    downforceKg: '490 kg',
    weightPowerRatio: '1.92 kg/hp',
    powerCurve: [
      { rpm: 2000, hp: 280, torque: 590 },
      { rpm: 3500, hp: 440, torque: 720 },
      { rpm: 5000, hp: 590, torque: 770 },
      { rpm: 6500, hp: 690, torque: 760 },
      { rpm: 8000, hp: 710, torque: 710 },
      { rpm: 8500, hp: 680, torque: 640 },
    ]
  };

  const brand = car.brand?.toLowerCase() || '';
  const fuelType = car.fuelType?.toLowerCase() || '';
  const isElectric = fuelType.includes('electric');
  const isHybrid = fuelType.includes('hybrid');
  const hp = car.horsepower || 600;

  // Deterministic seed based on car id character codes
  const charSum = (car.id || 'car').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  // 1. Fuel / Battery Level & Subtitle
  let fuelLevel = 82 + (charSum % 15); // 82% to 97%
  let fuelLabel = '98 Octane Shell V-Power';
  let fuelTitle = 'Fuel Level';

  if (isElectric) {
    fuelTitle = 'Battery SOC';
    fuelLabel = '102 kWh DC Fast Pack (800V)';
    fuelLevel = 90 + (charSum % 8);
  } else if (isHybrid) {
    fuelTitle = 'Hybrid Reserve';
    fuelLabel = 'V12 + 3 E-Motors Charged';
    fuelLevel = 86 + (charSum % 11);
  } else if (hp >= 750) {
    fuelLabel = '100 Octane Race Spec';
  } else if (brand.includes('rolls')) {
    fuelTitle = 'V12 Reserve';
    fuelLabel = 'Goodwood Bespoke Fuel';
    fuelLevel = 88 + (charSum % 9);
  } else if (brand.includes('porsche')) {
    fuelLabel = 'Super Plus 98 RON';
  }

  // 2. Cruising Range (Km)
  let rangeKm = 440 + (charSum % 160);
  if (isElectric) {
    rangeKm = 480 + (charSum % 80);
  } else if (brand.includes('rolls')) {
    rangeKm = 560 + (charSum % 90);
  } else if (brand.includes('bugatti')) {
    rangeKm = 360 + (charSum % 60);
  } else if (brand.includes('koenigsegg')) {
    rangeKm = 410 + (charSum % 50);
  } else if (brand.includes('bmw') || brand.includes('mercedes')) {
    rangeKm = 540 + (charSum % 110);
  } else if (brand.includes('porsche')) {
    rangeKm = 510 + (charSum % 80);
  }

  // 3. System Score & Diagnostic Health
  const systemScore = 94 + (charSum % 5); // 94% to 99%
  const diagnosticScore = 97 + (charSum % 3); // 97% to 99%

  // 4. Tire Pressures (PSI) & Temps
  let flPsi = 32, frPsi = 32, rlPsi = 34, rrPsi = 34;
  let flTemp = 38 + (charSum % 8);
  let frTemp = 38 + (charSum % 8);
  let rlTemp = 42 + (charSum % 10);
  let rrTemp = 42 + (charSum % 10);

  if (hp >= 750 || brand.includes('porsche') || brand.includes('koenigsegg')) {
    flPsi = 30; frPsi = 30; rlPsi = 33; rrPsi = 33;
  } else if (brand.includes('rolls')) {
    flPsi = 36; frPsi = 36; rlPsi = 38; rrPsi = 38;
  } else if (brand.includes('ferrari') || brand.includes('mclaren')) {
    flPsi = 31; frPsi = 31; rlPsi = 33; rrPsi = 33;
  }

  // 5. Dyno Power Curve Points
  const maxHp = car.horsepower || 650;
  const maxTorque = parseInt(car.torque) || 750;
  const powerCurve = [
    { rpm: 2000, hp: Math.round(maxHp * 0.38), torque: Math.round(maxTorque * 0.72) },
    { rpm: 3500, hp: Math.round(maxHp * 0.62), torque: Math.round(maxTorque * 0.94) },
    { rpm: 5000, hp: Math.round(maxHp * 0.82), torque: maxTorque },
    { rpm: 6500, hp: Math.round(maxHp * 0.96), torque: Math.round(maxTorque * 0.96) },
    { rpm: 8000, hp: maxHp, torque: Math.round(maxTorque * 0.88) },
    { rpm: 8800, hp: Math.round(maxHp * 0.94), torque: Math.round(maxTorque * 0.78) },
  ];

  return {
    fuelTitle,
    fuelLabel,
    fuelLevel,
    rangeKm,
    systemScore,
    diagnosticScore,
    flPsi,
    frPsi,
    rlPsi,
    rrPsi,
    flTemp,
    frTemp,
    rlTemp,
    rrTemp,
    brakingDist: (29.5 + (charSum % 30) / 10).toFixed(1) + ' m',
    downforceKg: Math.round(380 + (charSum % 240)) + ' kg',
    weightPowerRatio: (1.75 + (charSum % 35) / 100).toFixed(2) + ' kg/hp',
    powerCurve
  };
};

export function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cars, isWishlisted, toggleWishlist, showToast } = useApp();

  const car = cars.find(c => c.id === id) || cars[0];
  const telemetry = useMemo(() => getCarTelemetry(car), [car]);

  // Gallery State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const imagesCount = car.images?.length || 1;

  const [viewMode, setViewMode] = useState('studio'); // 'studio' | 'hud' | 'track'
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'specs' | 'finance' | 'compare' | 'service'

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % imagesCount);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
  };

  // Optional Slideshow Loop
  useEffect(() => {
    if (!isAutoPlaying || imagesCount <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % imagesCount);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, imagesCount]);

  // Modals & Search
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(() => {
    return searchParams.get('openBooking') === 'true';
  });
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (searchParams.get('openBooking') === 'true') {
      setTestDriveModalOpen(true);
    }
  }, [searchParams]);

  // Engine Audio State
  const [isEngineRunning, setIsEngineRunning] = useState(false);

  // TPMS Sensor Calibration Simulation
  const [calibratingTpms, setCalibratingTpms] = useState(false);

  // Financial / EMI Loan Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(4.5);

  // Animated Telemetry Gauge Sweep
  const [animPercent, setAnimPercent] = useState({
    fuel: 0,
    range: 0,
    system: 0,
    diagnostic: 0,
    ringFuel: 0,
    ringRange: 0,
    ringSystem: 0,
    ringDiagnostic: 0
  });

  // Calculate Loan EMI
  const { downPaymentAmount, loanAmount, monthlyPayment, totalInterest, totalCost } = useMemo(() => {
    const price = car.price || 350000;
    const dp = Math.round((price * downPaymentPercent) / 100);
    const principal = price - dp;
    const monthlyRate = (interestRate / 100) / 12;
    let emi = 0;
    if (monthlyRate > 0 && loanTermMonths > 0) {
      emi = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1));
    } else {
      emi = Math.round(principal / (loanTermMonths || 1));
    }
    const totCost = dp + (emi * loanTermMonths);
    const totInt = totCost - price;

    return {
      downPaymentAmount: dp,
      loanAmount: principal,
      monthlyPayment: emi,
      totalInterest: Math.max(0, totInt),
      totalCost: totCost
    };
  }, [car.price, downPaymentPercent, loanTermMonths, interestRate]);

  // Telemetry Gauge Animation Loop on Mount or Car Change
  useEffect(() => {
    let start = null;
    const duration = 2400; // 2.4s sleek sweep

    const TARGETS = {
      fuel: telemetry.fuelLevel,
      range: telemetry.rangeKm,
      system: telemetry.systemScore,
      diagnostic: telemetry.diagnosticScore,
      rangeRing: Math.min(Math.round((telemetry.rangeKm / 750) * 100), 100)
    };

    const animateGauges = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      let fRing, rRing, sRing, dRing, fNum, rNum, sNum, dNum;

      if (progress < 0.4) {
        const p1 = progress / 0.4;
        const easeUp = 1 - Math.cos((p1 * Math.PI) / 2);
        fRing = Math.round(easeUp * 100);
        rRing = Math.round(easeUp * 100);
        sRing = Math.round(easeUp * 100);
        dRing = Math.round(easeUp * 100);
        fNum = Math.round(easeUp * 100);
        rNum = Math.round(easeUp * 750);
        sNum = Math.round(easeUp * 100);
        dNum = Math.round(easeUp * 100);
      } else if (progress < 0.5) {
        fRing = 100; rRing = 100; sRing = 100; dRing = 100;
        fNum = 100; rNum = 750; sNum = 100; dNum = 100;
      } else {
        const p3 = (progress - 0.5) / 0.5;
        const easeDown = 1 - Math.pow(1 - p3, 3);
        fRing = Math.round(100 - (100 - TARGETS.fuel) * easeDown);
        rRing = Math.round(100 - (100 - TARGETS.rangeRing) * easeDown);
        sRing = Math.round(100 - (100 - TARGETS.system) * easeDown);
        dRing = Math.round(100 - (100 - TARGETS.diagnostic) * easeDown);
        fNum = Math.round(100 - (100 - TARGETS.fuel) * easeDown);
        rNum = Math.round(750 - (750 - TARGETS.range) * easeDown);
        sNum = Math.round(100 - (100 - TARGETS.system) * easeDown);
        dNum = Math.round(100 - (100 - TARGETS.diagnostic) * easeDown);
      }

      setAnimPercent({
        fuel: fNum,
        range: rNum,
        system: sNum,
        diagnostic: dNum,
        ringFuel: fRing,
        ringRange: rRing,
        ringSystem: sRing,
        ringDiagnostic: dRing
      });

      if (progress < 1) {
        requestAnimationFrame(animateGauges);
      } else {
        setAnimPercent({
          fuel: TARGETS.fuel,
          range: TARGETS.range,
          system: TARGETS.system,
          diagnostic: TARGETS.diagnostic,
          ringFuel: TARGETS.fuel,
          ringRange: TARGETS.rangeRing,
          ringSystem: TARGETS.system,
          ringDiagnostic: TARGETS.diagnostic
        });
      }
    };

    const animId = requestAnimationFrame(animateGauges);
    return () => {
      cancelAnimationFrame(animId);
      engineSound.stopEngine();
    };
  }, [id, telemetry]);

  const wishlisted = isWishlisted(car.id);

  // Engine Audio Toggle & Throttle Rev
  const toggleEngineStart = () => {
    if (!isEngineRunning) {
      engineSound.startEngine(car.engine?.toLowerCase() || 'v8');
      setIsEngineRunning(true);
      setCurrentRpm(1100);
      showToast(`Engine Started: ${car.brand} ${car.engine?.split(' ')?.[0] || 'V8'} Idle at 1,100 RPM`, "info");
    } else {
      engineSound.stopEngine();
      setIsEngineRunning(false);
      setCurrentRpm(0);
      showToast("Engine Ignitions Powered Off", "info");
    }
  };

  // Calibrate TPMS Sensor Sweep
  const handleCalibrateTpms = () => {
    setCalibratingTpms(true);
    showToast("Re-calibrating TPMS telemetry sensors...", "info");
    setTimeout(() => {
      setCalibratingTpms(false);
      showToast("4-Wheel TPMS balance optimal & verified at target pressure!", "success");
    }, 1600);
  };

  // Share & Export Report Handlers
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Telemetry Dossier URL copied to clipboard!", "success");
    }
  };

  const handleExportReport = () => {
    showToast(`Generating certified PDF inspection dossier for ${car.brand} ${car.model}...`, "info");
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      showToast("Certified Technical Provenance Dossier downloaded successfully!", "success");
    }, 1400);
  };

  const fallbackCarImage = "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80";
  const currentImage = (car.images && car.images[activeImageIndex]) || fallbackCarImage;

  // Camera Perspective Labels
  const angleLabels = ['Front 3/4', 'Side Profile', 'Cockpit View', 'Rear Aero', 'Engine Bay'];

  // Closest Supercar Competitors for Benchmark Tab
  const competitors = [
    { model: `${car.brand} ${car.model}`, hp: car.horsepower, zero100: parseFloat(car.zeroToHundred) || 2.9, topSpeed: parseInt(car.topSpeed) || 330, isSelf: true },
    { model: 'Ferrari SF90 Stradale', hp: 986, zero100: 2.5, topSpeed: 340, isSelf: false },
    { model: 'Porsche 911 GT3 RS', hp: 518, zero100: 3.2, topSpeed: 296, isSelf: false },
    { model: 'McLaren 720S Performance', hp: 710, zero100: 2.9, topSpeed: 341, isSelf: false }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans antialiased pb-24 lg:pb-16 ${
      viewMode === 'hud' ? 'bg-[#060B14] text-cyan-400' : 'bg-[#F4F7FC] text-slate-800'
    }`}>
      
      {/* ========================================================================= */}
      {/* 1. TOP APP BAR & QUICK CONTROLS */}
      {/* ========================================================================= */}
      <header className={`sticky top-0 z-30 transition-all duration-300 border-b backdrop-blur-md ${
        viewMode === 'hud' 
          ? 'bg-slate-950/90 border-cyan-500/30 shadow-[0_4px_20px_rgba(6,182,212,0.15)] text-cyan-400'
          : 'bg-white/95 border-slate-200/90 shadow-xs text-slate-800'
      }`}>
        <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium min-w-0 overflow-hidden">
            <button 
              type="button" 
              onClick={() => navigate('/inventory')}
              className={`font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
                viewMode === 'hud' ? 'hover:text-cyan-200 text-cyan-500' : 'hover:text-brand-600 text-slate-500'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Inventory</span>
            </button>
            <span className="opacity-40">/</span>
            <span className="hidden md:inline opacity-70">Supercar Dossier</span>
            <span className="opacity-40 hidden md:inline">/</span>
            <span className={`font-black truncate ${viewMode === 'hud' ? 'text-white' : 'text-slate-900'}`}>
              {car.brand} {car.model}
            </span>
          </div>

          {/* Center Mode Switcher (Studio vs HUD vs Track) */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300/40 dark:border-slate-800 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setViewMode('studio')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'studio' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Showroom
            </button>
            <button
              type="button"
              onClick={() => setViewMode('hud')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'hud' 
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.6)]' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-cyan-400'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>Cyber HUD</span>
            </button>
          </div>

          {/* Quick Actions Right */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Quick Engine Sound Rev Toggle */}
            <button
              type="button"
              onClick={toggleEngineStart}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isEngineRunning 
                  ? 'bg-rose-600 text-white border-rose-500 shadow-glow-red animate-pulse' 
                  : viewMode === 'hud'
                    ? 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/40'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title={isEngineRunning ? "Cut Engine Ignition" : "Start V8/V10/V12 Engine Sound"}
            >
              {isEngineRunning ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden lg:inline">{isEngineRunning ? 'Engine Live' : 'Start Audio'}</span>
            </button>

            {/* Export PDF Dossier */}
            <button
              type="button"
              onClick={handleExportReport}
              className="bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs px-2.5 sm:px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Certified Dossier</span>
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(car.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                wishlisted 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : viewMode === 'hud'
                    ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose-600 text-rose-600 animate-bounce" : ""}`} />
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                viewMode === 'hud'
                  ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/50'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
              title="Share Car Dossier"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN VEHICLE SHOWCASE & LIVE TELEMETRY STAGE */}
      {/* ========================================================================= */}
      <main className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
        
        {/* ======================================================================= */}
        {/* ROW 1: VEHICLE DIAGNOSTICS & TPMS + LIVE ASSET PASSPORT */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* 1.1 LEFT CARD: VEHICLE SENSOR & TPMS GAUGE CARD (8 Cols) */}
          <div className={`lg:col-span-8 rounded-3xl border p-4 sm:p-6 lg:p-7 shadow-luxury flex flex-col justify-between relative overflow-hidden transition-all duration-500 ${
            viewMode === 'hud' 
              ? 'bg-slate-950/95 border-cyan-500/40 bg-cyber-grid-dark text-cyan-300' 
              : 'bg-white border-slate-200/90 bg-radial-glow'
          }`}>
            
            {/* HUD Scanline Effect when in HUD Mode */}
            {viewMode === 'hud' && (
              <div className="absolute inset-0 pointer-events-none scanline opacity-30 animate-hud-scan" />
            )}

            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/60 dark:border-cyan-500/20 gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full shrink-0 ${
                  isEngineRunning ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className={`text-lg sm:text-2xl font-black uppercase tracking-tight ${
                      viewMode === 'hud' ? 'text-white' : 'text-slate-950 font-display'
                    }`}>
                      {car.brand} {car.model}
                    </h1>
                    {car.isFeatured && (
                      <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                        Flagship
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <span className={`text-sm sm:text-base font-black px-3.5 py-1.5 rounded-xl border ${
                  viewMode === 'hud'
                    ? 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40 font-mono shadow-glow-cyan'
                    : 'text-brand-600 bg-brand-50 border-brand-200'
                }`}>
                  {formatPrice(car.price)}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 uppercase">
                  {car.availability || 'AVAILABLE'}
                </span>
              </div>
            </div>

            {/* Middle Section: Car Image & TPMS Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center py-4 sm:py-6 relative z-10">
              
              {/* Car Profile Image & Tire Sensors (8 cols on desktop) */}
              <div className="md:col-span-8 relative flex flex-col items-center justify-center">
                
                {/* Main Vehicle Showcase Image */}
                <div 
                  className={`relative w-full h-64 xs:h-72 sm:h-84 md:h-92 lg:h-[420px] rounded-3xl overflow-hidden flex items-center justify-center p-3 sm:p-6 group transition-all select-none ${
                    viewMode === 'hud'
                      ? 'bg-slate-900/80 border border-cyan-500/40 shadow-inner'
                      : 'bg-gradient-to-b from-slate-100/90 via-slate-50/70 to-slate-200/50 border border-slate-200/80 shadow-inner'
                  }`}
                >
                  {/* Vehicle Image */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={currentImage}
                      alt={`${car.brand} ${car.model}`}
                      draggable={false}
                      className="w-full h-full object-contain filter drop-shadow-2xl select-none transition-all duration-300 group-hover:scale-102"
                      onError={(e) => {
                        e.currentTarget.src = fallbackCarImage;
                      }}
                    />
                  </div>
                </div>

                {/* TPMS Pressure & Temperature Readings (Front + Rear Axles) */}
                <div className={`w-full grid grid-cols-2 gap-2.5 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${
                  viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-100'
                }`}>
                  
                  {/* Front Axle TPMS */}
                  <div className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all ${
                    viewMode === 'hud'
                      ? 'bg-cyan-950/40 border-cyan-500/30'
                      : 'bg-slate-50/90 border-slate-200/80'
                  }`}>
                    <div className="text-left">
                      <span className="text-[9px] sm:text-[10px] font-bold opacity-60 block uppercase">FL AXLE</span>
                      <strong className={`text-xs sm:text-sm font-black ${viewMode === 'hud' ? 'text-cyan-200 font-mono' : 'text-slate-900'}`}>
                        {telemetry.flPsi} PSI
                      </strong>
                      <span className="text-[9px] opacity-60 block">{telemetry.flTemp}°C Temp</span>
                    </div>
                    <span className="opacity-30">|</span>
                    <div className="text-right">
                      <span className="text-[9px] sm:text-[10px] font-bold opacity-60 block uppercase">FR AXLE</span>
                      <strong className={`text-xs sm:text-sm font-black ${viewMode === 'hud' ? 'text-cyan-200 font-mono' : 'text-slate-900'}`}>
                        {telemetry.frPsi} PSI
                      </strong>
                      <span className="text-[9px] opacity-60 block">{telemetry.frTemp}°C Temp</span>
                    </div>
                  </div>

                  {/* Rear Axle TPMS */}
                  <div className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all ${
                    viewMode === 'hud'
                      ? 'bg-cyan-950/40 border-cyan-500/30'
                      : 'bg-slate-50/90 border-slate-200/80'
                  }`}>
                    <div className="text-left">
                      <span className="text-[9px] sm:text-[10px] font-bold opacity-60 block uppercase">RL AXLE</span>
                      <strong className={`text-xs sm:text-sm font-black ${viewMode === 'hud' ? 'text-cyan-200 font-mono' : 'text-slate-900'}`}>
                        {telemetry.rlPsi} PSI
                      </strong>
                      <span className="text-[9px] opacity-60 block">{telemetry.rlTemp}°C Temp</span>
                    </div>
                    <span className="opacity-30">|</span>
                    <div className="text-right">
                      <span className="text-[9px] sm:text-[10px] font-bold opacity-60 block uppercase">RR AXLE</span>
                      <strong className={`text-xs sm:text-sm font-black ${viewMode === 'hud' ? 'text-cyan-200 font-mono' : 'text-slate-900'}`}>
                        {telemetry.rrPsi} PSI
                      </strong>
                      <span className="text-[9px] opacity-60 block">{telemetry.rrTemp}°C Temp</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* 3 Circular Telemetry Gauges (Responsive: 3 Columns on Mobile, Stacked on Desktop) */}
              <div className={`md:col-span-4 grid grid-cols-3 md:flex md:flex-col justify-around gap-2.5 sm:gap-4 md:border-l md:pl-6 pt-3 md:pt-0 border-t md:border-t-0 ${
                viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-100'
              }`}>
                
                {/* Gauge 1: Fuel / Battery */}
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3.5 text-center md:text-left">
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${
                    viewMode === 'hud' ? 'bg-cyan-950/60 shadow-glow-cyan' : 'bg-slate-100'
                  }`}>
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 -rotate-90 transition-transform" viewBox="0 0 36 36">
                      <path
                        className={viewMode === 'hud' ? 'text-slate-800' : 'text-slate-200'}
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-amber-500 transition-all duration-75 ease-out"
                        strokeDasharray={`${animPercent.ringFuel}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className={`absolute text-[11px] sm:text-xs font-black ${
                      viewMode === 'hud' ? 'text-amber-400 font-mono' : 'text-slate-900'
                    }`}>
                      {animPercent.fuel}%
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[11px] sm:text-xs font-black block truncate ${
                      viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {telemetry.fuelTitle}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold opacity-60 uppercase block truncate">
                      {telemetry.fuelLabel}
                    </span>
                  </div>
                </div>

                {/* Gauge 2: Cruising Range */}
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3.5 text-center md:text-left">
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${
                    viewMode === 'hud' ? 'bg-cyan-950/60 shadow-glow-cyan' : 'bg-slate-100'
                  }`}>
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 -rotate-90 transition-transform" viewBox="0 0 36 36">
                      <path
                        className={viewMode === 'hud' ? 'text-slate-800' : 'text-slate-200'}
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-cyan-500 transition-all duration-75 ease-out"
                        strokeDasharray={`${animPercent.ringRange}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className={`absolute text-[10px] sm:text-[11px] font-black ${
                      viewMode === 'hud' ? 'text-cyan-300 font-mono' : 'text-slate-900'
                    }`}>
                      {animPercent.range}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[11px] sm:text-xs font-black block ${
                      viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                    }`}>
                      Range Km
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold opacity-60 uppercase block">
                      Autonomy Est.
                    </span>
                  </div>
                </div>

                {/* Gauge 3: System Score */}
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3.5 text-center md:text-left">
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${
                    viewMode === 'hud' ? 'bg-cyan-950/60 shadow-glow-emerald' : 'bg-slate-100'
                  }`}>
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 -rotate-90 transition-transform" viewBox="0 0 36 36">
                      <path
                        className={viewMode === 'hud' ? 'text-slate-800' : 'text-slate-200'}
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500 transition-all duration-75 ease-out"
                        strokeDasharray={`${animPercent.ringSystem}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className={`absolute text-[11px] sm:text-xs font-black ${
                      viewMode === 'hud' ? 'text-emerald-400 font-mono' : 'text-slate-900'
                    }`}>
                      {animPercent.system}%
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[11px] sm:text-xs font-black block ${
                      viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                    }`}>
                      System Health
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-500 uppercase block">
                      100% Certified
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Gallery Thumbnail Switcher with Angle Labels */}
            {car.images && car.images.length > 1 && (
              <div className={`flex items-center gap-2 pt-3 border-t overflow-x-auto scrollbar-none relative z-10 ${
                viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-100'
              }`}>
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider mr-1 shrink-0">
                  Perspectives:
                </span>
                <div className="flex items-center gap-2.5 shrink-0">
                  {car.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative px-2.5 py-1.5 rounded-xl border-2 transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                        activeImageIndex === idx 
                          ? viewMode === 'hud'
                            ? 'border-cyan-400 bg-cyan-950/80 shadow-glow-cyan text-white scale-105'
                            : 'border-brand-600 bg-brand-50/50 shadow-sm text-slate-950 scale-105'
                          : 'border-slate-200/80 dark:border-slate-800 opacity-60 hover:opacity-100 text-slate-500'
                      }`}
                    >
                      <div className="w-7 h-5 rounded-md overflow-hidden bg-slate-200 shrink-0">
                        <img src={img} alt={`Perspective ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold uppercase whitespace-nowrap">
                        {angleLabels[idx] || `Angle 0${idx + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* 1.2 RIGHT CARD: GPS RADAR MAP & VEHICLE PASSPORT (4 Cols) */}
          <div className={`lg:col-span-4 rounded-3xl border p-4 sm:p-6 shadow-luxury flex flex-col justify-between gap-4 transition-all duration-500 ${
            viewMode === 'hud'
              ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300'
              : 'bg-white border-slate-200/90'
          }`}>
            
            {/* Live GPS Radar Map Preview */}
            <div className={`relative h-40 sm:h-48 rounded-2xl overflow-hidden border flex items-center justify-center ${
              viewMode === 'hud'
                ? 'bg-slate-900 border-cyan-500/40 shadow-inner'
                : 'bg-slate-100 border-slate-200'
            }`}>
              {/* Radar Grid Graphic */}
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              
              {/* Rotating Radar Scanner Line */}
              <div className="absolute w-44 h-44 rounded-full border border-cyan-500/30 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-ping opacity-20" />
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-radar-sweep" />
              </div>

              {/* Pulsing GPS Radar Pin */}
              <div className="relative z-10 flex flex-col items-center max-w-[92%]">
                <span className="w-9 h-9 rounded-full bg-cyan-400/30 animate-ping absolute" />
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg border-2 border-white relative z-10">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="bg-slate-950/95 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mt-2 backdrop-blur-md shadow-md border border-cyan-500/40 max-w-full truncate text-center font-mono">
                  {car.location || 'SpeedX Sanctuary (Monaco)'}
                </span>
              </div>
            </div>

            {/* Key Passport Specs Grid */}
            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2.5 sm:gap-y-3 pt-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] sm:text-[10px] opacity-60 font-bold uppercase">Body Architecture</span>
                <p className={`font-black truncate ${viewMode === 'hud' ? 'text-white' : 'text-slate-900'}`}>
                  {car.bodyType || 'Coupe / Supercar'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] sm:text-[10px] opacity-60 font-bold uppercase">State Registry</span>
                <p className="font-black text-emerald-600">Showroom Certified</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] sm:text-[10px] opacity-60 font-bold uppercase">Exterior Livery</span>
                <p className={`font-black truncate ${viewMode === 'hud' ? 'text-white' : 'text-slate-900'}`} title={car.exteriorColor}>
                  {car.exteriorColor || 'Bespoke Atelier'}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] sm:text-[10px] opacity-60 font-bold uppercase">Model Year</span>
                <p className={`font-black ${viewMode === 'hud' ? 'text-white font-mono' : 'text-slate-900'}`}>{car.year}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] sm:text-[10px] opacity-60 font-bold uppercase">Engine Output</span>
                <p className={`font-black truncate ${viewMode === 'hud' ? 'text-cyan-300 font-mono' : 'text-slate-900'}`}>
                  {car.horsepower} HP ({car.engine?.split(' ')?.[0] || 'V8'})
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] sm:text-[10px] opacity-60 font-bold uppercase">Transmission</span>
                <p className={`font-black truncate ${viewMode === 'hud' ? 'text-white' : 'text-slate-900'}`}>
                  {car.transmission?.split(' ')?.[0] || 'Dual-Clutch'}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className={`pt-3 sm:pt-4 border-t flex flex-col sm:flex-row items-center gap-2 ${
              viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-100'
            }`}>
              <button
                type="button"
                onClick={() => setTestDriveModalOpen(true)}
                className="w-full sm:flex-1 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition-all shadow-luxury hover:shadow-glow-red flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Test Drive</span>
              </button>

              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className={`w-full sm:w-auto py-3 px-4 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center ${
                  viewMode === 'hud'
                    ? 'border-cyan-500/40 hover:bg-cyan-950 text-cyan-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800 shadow-2xs'
                }`}
              >
                Inquire
              </button>
            </div>

          </div>

        </div>

        {/* ======================================================================= */}
        {/* ROW 2: TABBED SUB-NAVIGATION & SPECIALIST PROFILE STRIP */}
        {/* ======================================================================= */}
        <div className={`rounded-3xl border shadow-luxury overflow-hidden transition-all duration-500 ${
          viewMode === 'hud'
            ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300'
            : 'bg-white border-slate-200/90'
        }`}>
          
          {/* Sub-Navigation Tabs Header */}
          <div className={`flex items-center gap-4 sm:gap-8 px-4 sm:px-6 pt-3 sm:pt-4 border-b text-xs font-black uppercase tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none ${
            viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`pb-3 relative transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard' 
                  ? viewMode === 'hud' ? 'text-cyan-300' : 'text-brand-600'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Telemetry Hub</span>
              {activeTab === 'dashboard' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full ${
                  viewMode === 'hud' ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-brand-600'
                }`} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-3 relative transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'specs' 
                  ? viewMode === 'hud' ? 'text-cyan-300' : 'text-brand-600'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Powertrain & Specs</span>
              {activeTab === 'specs' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full ${
                  viewMode === 'hud' ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-brand-600'
                }`} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('finance')}
              className={`pb-3 relative transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'finance' 
                  ? viewMode === 'hud' ? 'text-cyan-300' : 'text-brand-600'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>EMI & Lease Calculator</span>
              {activeTab === 'finance' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full ${
                  viewMode === 'hud' ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-brand-600'
                }`} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className={`pb-3 relative transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compare' 
                  ? viewMode === 'hud' ? 'text-cyan-300' : 'text-brand-600'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Supercar Benchmark</span>
              {activeTab === 'compare' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full ${
                  viewMode === 'hud' ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-brand-600'
                }`} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('service')}
              className={`pb-3 relative transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'service' 
                  ? viewMode === 'hud' ? 'text-cyan-300' : 'text-brand-600'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Provenance Logbook</span>
              {activeTab === 'service' && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full ${
                  viewMode === 'hud' ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-brand-600'
                }`} />
              )}
            </button>
          </div>

          {/* Assigned Concierge / Technician Passport Strip */}
          <div className={`p-4 sm:p-5 lg:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center ${
            viewMode === 'hud' ? 'bg-slate-900/60' : 'bg-slate-50/50'
          }`}>
            
            {/* Left: Specialist Profile */}
            <div className="md:col-span-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-500 shadow-md shrink-0 bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Sebastian Vance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className={`text-xs sm:text-sm font-black truncate ${
                    viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Sebastian Vance
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                </div>
                <span className="text-[11px] opacity-70 font-semibold block truncate">Master Supercar Concierge</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                  Verified Specialist
                </span>
              </div>
            </div>

            {/* Center: Live Telemetry Metadata */}
            <div className={`md:col-span-5 grid grid-cols-3 gap-2 text-xs border-y md:border-y-0 md:border-x py-2.5 md:py-0 md:px-4 ${
              viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-200'
            }`}>
              <div>
                <span className="text-[9px] font-bold opacity-60 block uppercase">Direct Hotline</span>
                <span className={`font-black text-[11px] sm:text-xs truncate block ${
                  viewMode === 'hud' ? 'text-white font-mono' : 'text-slate-900'
                }`}>
                  +1 (800) 773-3390
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold opacity-60 block uppercase">Verified Mileage</span>
                <span className={`font-black text-[11px] sm:text-xs truncate block ${
                  viewMode === 'hud' ? 'text-cyan-300 font-mono' : 'text-slate-900'
                }`}>
                  {car.mileage}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold opacity-60 block uppercase">0–100 km/h</span>
                <span className="font-black text-brand-600 text-[11px] sm:text-xs truncate block">
                  {car.zeroToHundred}
                </span>
              </div>
            </div>

            {/* Right: Technical Serial & Instant Concierge Contact */}
            <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3 text-xs">
              <div className="text-left md:text-right">
                <span className="text-[9px] font-bold opacity-60 block uppercase">Chassis Serial</span>
                <span className={`font-mono font-bold text-[10px] sm:text-[11px] ${
                  viewMode === 'hud' ? 'text-cyan-400' : 'text-slate-700'
                }`}>
                  {car.vin.slice(0, 10)}...
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm"
              >
                Contact
              </button>
            </div>

          </div>

        </div>

        {/* ======================================================================= */}
        {/* TAB 1: TELEMETRY DASHBOARD & LIVE DYNO GRAPH */}
        {/* ======================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* 3.1 DYNAMIC DYNO HORSEPOWER & TORQUE CURVE */}
              <div className={`rounded-3xl border p-4 sm:p-5 shadow-luxury flex flex-col justify-between gap-3 ${
                viewMode === 'hud'
                  ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300'
                  : 'bg-white border-slate-200/90'
              }`}>
                <div className={`flex items-center justify-between pb-3 border-b ${
                  viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-600" />
                    <h4 className={`text-xs font-black uppercase tracking-wider ${
                      viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                    }`}>
                      Dyno Output Dynamics
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/50 px-2.5 py-0.5 rounded-md font-mono">
                    Peak: {car.horsepower} HP
                  </span>
                </div>

                {/* Dynamic SVG Wave Dyno Chart */}
                <div className="py-2 relative h-36 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="dynoGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e11d48" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,85 Q50,70 90,52 T180,22 T250,15 T300,32 L300,100 L0,100 Z"
                      fill="url(#dynoGradient)"
                    />
                    <path
                      d="M0,85 Q50,70 90,52 T180,22 T250,15 T300,32"
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="250" cy="15" r="5" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                  
                  {/* Floating Peak Marker */}
                  <div className="absolute top-2 right-12 bg-slate-950 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md font-mono border border-brand-500/40">
                    {car.horsepower} HP @ 8,000 RPM
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-2.5 border-t text-[9px] font-bold uppercase opacity-60 ${
                  viewMode === 'hud' ? 'border-cyan-500/20 font-mono' : 'border-slate-100'
                }`}>
                  <span>2,000 RPM</span>
                  <span>4,500</span>
                  <span>7,000</span>
                  <span>8,800 RPM</span>
                </div>
              </div>

              {/* 3.2 SCHEDULED SERVICE REMINDERS */}
              <div className={`rounded-3xl border p-4 sm:p-5 shadow-luxury flex flex-col justify-between gap-3 ${
                viewMode === 'hud'
                  ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300'
                  : 'bg-white border-slate-200/90'
              }`}>
                <div className={`flex items-center justify-between pb-3 border-b ${
                  viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-slate-700 dark:text-cyan-400" />
                    <h4 className={`text-xs font-black uppercase tracking-wider ${
                      viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                    }`}>
                      Maintenance Milestones
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold opacity-60 uppercase">3 Milestones Logged</span>
                </div>

                <div className="space-y-2.5 py-1">
                  <div className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs gap-2 ${
                    viewMode === 'hud'
                      ? 'bg-cyan-950/40 border-cyan-500/30'
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="min-w-0">
                      <strong className={`font-bold block truncate ${viewMode === 'hud' ? 'text-white' : 'text-slate-900'}`}>
                        5,000 km Fluid & Brake Audit
                      </strong>
                      <span className="text-[10px] opacity-60 truncate block">Factory Certified Spec</span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                      PASSED
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs gap-2 ${
                    viewMode === 'hud'
                      ? 'bg-cyan-950/40 border-cyan-500/30'
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="min-w-0">
                      <strong className={`font-bold block truncate ${viewMode === 'hud' ? 'text-white' : 'text-slate-900'}`}>
                        15,000 km Carbon Ceramic Inspection
                      </strong>
                      <span className="text-[10px] opacity-60 truncate block">Laser Rotor Micrometry</span>
                    </div>
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md shrink-0">
                      SCHEDULED
                    </span>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between ${
                  viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-100'
                }`}>
                  <span className="text-[10px] opacity-60 font-bold uppercase">Logbook Verified</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('service')}
                    className="text-xs font-black text-brand-600 hover:underline cursor-pointer"
                  >
                    View All Logbook →
                  </button>
                </div>
              </div>

              {/* 3.3 SYSTEM DIAGNOSTIC HEALTH RING */}
              <div className={`rounded-3xl border p-4 sm:p-5 shadow-luxury flex flex-col justify-between items-center text-center gap-3 md:col-span-2 lg:col-span-1 ${
                viewMode === 'hud'
                  ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300'
                  : 'bg-white border-slate-200/90'
              }`}>
                <div className={`w-full flex items-center justify-between pb-3 border-b ${
                  viewMode === 'hud' ? 'border-cyan-500/20' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    <h4 className={`text-xs font-black uppercase tracking-wider ${
                      viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                    }`}>
                      Diagnostic Integrity
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Optimal</span>
                </div>

                <div className="relative w-22 h-22 sm:w-26 sm:h-26 my-1 flex items-center justify-center">
                  <svg className="w-22 h-22 sm:w-26 sm:h-26 -rotate-90 transition-transform" viewBox="0 0 36 36">
                    <path
                      className={viewMode === 'hud' ? 'text-slate-800' : 'text-slate-100'}
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-brand-600 transition-all duration-75 ease-out"
                      strokeDasharray={`${animPercent.ringDiagnostic}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className={`text-lg sm:text-xl font-black leading-none ${
                      viewMode === 'hud' ? 'text-white font-mono' : 'text-slate-900'
                    }`}>
                      {animPercent.diagnostic}%
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-emerald-500 uppercase">0 Faults</span>
                  </div>
                </div>

                <p className="text-xs opacity-70 max-w-[240px] leading-relaxed">
                  250-point certified diagnostic audit passed with 0 telemetry fault codes.
                </p>

                <button
                  type="button"
                  onClick={handleCalibrateTpms}
                  disabled={calibratingTpms}
                  className={`w-full py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                    calibratingTpms
                      ? 'bg-cyan-600 text-white animate-pulse'
                      : viewMode === 'hud'
                        ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {calibratingTpms ? 'Calibrating Sensors...' : 'Calibrate Sensors'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: PERFORMANCE & ENGINEERING SPECS */}
        {/* ======================================================================= */}
        {activeTab === 'specs' && (
          <div className={`rounded-3xl border p-4 sm:p-6 lg:p-8 shadow-luxury space-y-6 animate-fade-in ${
            viewMode === 'hud'
              ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300'
              : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200/60 dark:border-cyan-500/20">
              <div>
                <h3 className={`text-base sm:text-lg font-black uppercase tracking-tight ${
                  viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                }`}>
                  Chassis & Powertrain Architecture
                </h3>
                <p className="text-xs opacity-70">Official Factory Technical Passport & Dynamic Metrics</p>
              </div>
              <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/50 px-3 py-1 rounded-xl self-start sm:self-auto">
                {car.brand} Racing Division
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 text-xs">
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                viewMode === 'hud' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] opacity-60 font-bold uppercase">Combustion / Electric Architecture</span>
                <p className={`text-sm font-black ${viewMode === 'hud' ? 'text-white font-mono' : 'text-slate-900'}`}>{car.engine}</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                viewMode === 'hud' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] opacity-60 font-bold uppercase">Transmission System</span>
                <p className={`text-sm font-black ${viewMode === 'hud' ? 'text-white font-mono' : 'text-slate-900'}`}>{car.transmission}</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                viewMode === 'hud' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] opacity-60 font-bold uppercase">Drivetrain Configuration</span>
                <p className={`text-sm font-black ${viewMode === 'hud' ? 'text-white font-mono' : 'text-slate-900'}`}>{car.drivetrain || 'All-Wheel Drive / RWD'}</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                viewMode === 'hud' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] opacity-60 font-bold uppercase">Braking Distance (100–0 km/h)</span>
                <p className={`text-sm font-black text-emerald-600 ${viewMode === 'hud' ? 'font-mono' : ''}`}>{telemetry.brakingDist}</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                viewMode === 'hud' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] opacity-60 font-bold uppercase">Peak Downforce @ 250 km/h</span>
                <p className={`text-sm font-black ${viewMode === 'hud' ? 'text-white font-mono' : 'text-slate-900'}`}>{telemetry.downforceKg}</p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                viewMode === 'hud' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-[10px] opacity-60 font-bold uppercase">Power-to-Weight Ratio</span>
                <p className={`text-sm font-black text-brand-600 ${viewMode === 'hud' ? 'font-mono' : ''}`}>{telemetry.weightPowerRatio}</p>
              </div>
            </div>

            {/* Features Pill Grid */}
            <div className="pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider mb-3 opacity-80">
                Factory Equipped Telemetry & Aerodynamics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {car.features.map((feat, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      viewMode === 'hud'
                        ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200'
                        : 'bg-slate-50 border-slate-100 text-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs opacity-80 leading-relaxed pt-3 border-t border-slate-200/60 dark:border-cyan-500/20">
              {car.description}
            </p>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: FINANCIAL & LEASE EMI CALCULATOR */}
        {/* ======================================================================= */}
        {activeTab === 'finance' && (
          <div className={`rounded-3xl border p-4 sm:p-6 lg:p-8 shadow-luxury space-y-6 animate-fade-in ${
            viewMode === 'hud'
              ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300'
              : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200/60 dark:border-cyan-500/20">
              <div>
                <h3 className={`text-base sm:text-lg font-black uppercase tracking-tight ${
                  viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                }`}>
                  VIP Supercar Acquisition & Lease Calculator
                </h3>
                <p className="text-xs opacity-70">Customize your personalized loan or concierge lease structure</p>
              </div>
              <span className="text-xs font-black text-brand-600 bg-brand-50 dark:bg-brand-950/50 px-3 py-1 rounded-xl self-start sm:self-auto">
                Asset Value: {formatPrice(car.price)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Interactive Sliders (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Slider 1: Down Payment */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="opacity-70">Down Payment ({downPaymentPercent}%)</span>
                    <span className="font-black text-brand-600">{formatPrice(downPaymentAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] opacity-50 font-bold">
                    <span>10% Min</span>
                    <span>30% Standard</span>
                    <span>60% Max</span>
                  </div>
                </div>

                {/* Slider 2: Loan Term */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="opacity-70">Financing Tenure</span>
                    <span className="font-black">{loanTermMonths} Months ({(loanTermMonths / 12).toFixed(1)} Years)</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[12, 24, 36, 48, 60].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setLoanTermMonths(term)}
                        className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          loanTermMonths === term
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {term}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider 3: Interest Rate APR */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="opacity-70">Annual Percentage Rate (APR)</span>
                    <span className="font-black text-emerald-600">{interestRate}% APR</span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="8.5"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

              </div>

              {/* Right Column: Financial Summary Card (5 cols) */}
              <div className={`lg:col-span-5 p-5 sm:p-6 rounded-3xl border flex flex-col justify-between gap-4 ${
                viewMode === 'hud'
                  ? 'bg-cyan-950/60 border-cyan-500/40 text-white shadow-glow-cyan'
                  : 'bg-slate-900 text-white shadow-xl'
              }`}>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Monthly Outflow</span>
                  <div className="text-3xl sm:text-4xl font-black font-display text-brand-500 mt-1">
                    {formatPrice(monthlyPayment)}<span className="text-xs text-slate-400 font-normal"> /mo</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-y border-slate-700/80 py-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Principal Financed:</span>
                    <span className="font-black">{formatPrice(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Interest (Term):</span>
                    <span className="font-black text-amber-400">{formatPrice(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Capital Cost:</span>
                    <span className="font-black text-emerald-400">{formatPrice(totalCost)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-luxury active:scale-95 cursor-pointer"
                >
                  Apply for VIP Pre-Approval
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: SUPERCAR COMPARATIVE BENCHMARK */}
        {/* ======================================================================= */}
        {activeTab === 'compare' && (
          <div className={`rounded-3xl border p-4 sm:p-6 lg:p-8 shadow-luxury space-y-6 animate-fade-in ${
            viewMode === 'hud'
              ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300'
              : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200/60 dark:border-cyan-500/20">
              <div>
                <h3 className={`text-base sm:text-lg font-black uppercase tracking-tight ${
                  viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                }`}>
                  Head-to-Head Marque Benchmark
                </h3>
                <p className="text-xs opacity-70">Comparative telemetry against class-leading supercars</p>
              </div>
            </div>

            <div className="space-y-4">
              {competitors.map((comp, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    comp.isSelf 
                      ? 'bg-brand-50/50 dark:bg-brand-950/40 border-brand-500/60 shadow-sm'
                      : viewMode === 'hud'
                        ? 'bg-slate-900/60 border-cyan-500/20'
                        : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/50 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <strong className={`text-xs sm:text-sm font-black ${
                        comp.isSelf ? 'text-brand-600' : viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {comp.model}
                      </strong>
                      {comp.isSelf && (
                        <span className="text-[9px] font-black uppercase bg-brand-600 text-white px-2 py-0.5 rounded-full">
                          Current Spec
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold">{comp.hp} HP</span>
                  </div>

                  {/* Visual Benchmark Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[10px] opacity-70 mb-1">
                        <span>0–100 km/h</span>
                        <span className="font-bold">{comp.zero100}s</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-600 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${Math.min(100, (3.5 / comp.zero100) * 80)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] opacity-70 mb-1">
                        <span>Top Velocity</span>
                        <span className="font-bold">{comp.topSpeed} km/h</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-cyan-500 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${(comp.topSpeed / 360) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] opacity-70 mb-1">
                        <span>Horsepower</span>
                        <span className="font-bold">{comp.hp} BHP</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full rounded-full transition-all duration-700" 
                          style={{ width: `${(comp.hp / 1000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: CERTIFIED SERVICE & MAINTENANCE LOGBOOK */}
        {/* ======================================================================= */}
        {activeTab === 'service' && (
          <div className={`rounded-3xl border p-4 sm:p-6 lg:p-8 shadow-luxury space-y-4 animate-fade-in ${
            viewMode === 'hud'
              ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300'
              : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-200/60 dark:border-cyan-500/20">
              <div>
                <h3 className={`text-base sm:text-lg font-black uppercase tracking-tight ${
                  viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                }`}>
                  Certified Provenance & Digital Service History
                </h3>
                <p className="text-xs opacity-70">Complete cryptographic audit trail of maintenance and factory calibrations</p>
              </div>
              <button
                type="button"
                onClick={handleExportReport}
                className="bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-black text-xs px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Download Sealed PDF</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                viewMode === 'hud' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div>
                  <strong className={`text-xs sm:text-sm font-black block ${
                    viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Pre-Delivery 250-Point Technical Inspection
                  </strong>
                  <span className="opacity-60">SpeedX Master Technical Bay • Inspection ID: #CHK-9821</span>
                </div>
                <span className="font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-xl self-start sm:self-auto">
                  PASSED (0 FAULTS)
                </span>
              </div>

              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                viewMode === 'hud' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div>
                  <strong className={`text-xs sm:text-sm font-black block ${
                    viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Factory Dynamometer Calibration & Fluid Flush
                  </strong>
                  <span className="opacity-60">Official Marque Certified Service Center • Monaco</span>
                </div>
                <span className="font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-xl self-start sm:self-auto">
                  CERTIFIED 100%
                </span>
              </div>

              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                viewMode === 'hud' ? 'bg-cyan-950/40 border-cyan-500/30' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div>
                  <strong className={`text-xs sm:text-sm font-black block ${
                    viewMode === 'hud' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Carbon Ceramic Laser Rotor Inspection
                  </strong>
                  <span className="opacity-60">Precision Micrometry Audit • 98.4% Rotor Life Remaining</span>
                </div>
                <span className="font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-xl self-start sm:self-auto">
                  VERIFIED OPTIMAL
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 3. MOBILE STICKY ACTION BAR */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Acquisition Price</span>
          <span className="text-base font-black text-slate-950 dark:text-white font-display">
            {formatPrice(car.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(car.id)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 active:scale-95"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-brand-600 text-brand-600" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setTestDriveModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-md"
          >
            Book Drive
          </button>

          <button
            type="button"
            onClick={() => setEnquiryModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-2xs"
          >
            Inquire
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FULLSCREEN LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fade-in text-white select-none">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-base sm:text-lg">
                {car.brand} {car.model}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 font-mono text-amber-400 font-bold border border-white/10">
                Photo {activeImageIndex + 1} of {imagesCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {imagesCount > 1 && (
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    isAutoPlaying
                      ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4 text-slate-950" /> : <Play className="w-4 h-4 text-amber-400" />}
                  <span>{isAutoPlaying ? 'Pause Slideshow' : 'Play Slideshow'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Stage */}
          <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
            <div className="relative max-w-full max-h-[75vh] flex items-center justify-center">
              <img
                src={currentImage}
                alt={`${car.brand} ${car.model}`}
                draggable={false}
                className="max-w-full max-h-[75vh] object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none"
              />
            </div>

            {/* Left & Right Arrow Controls */}
            {imagesCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 sm:left-8 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all cursor-pointer shadow-2xl border border-white/10"
                  title="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 sm:right-8 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all cursor-pointer shadow-2xl border border-white/10"
                  title="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer Thumbnails */}
          {imagesCount > 1 && (
            <div className="space-y-3 pt-2 max-w-4xl mx-auto w-full">
              <div className="flex items-center justify-center gap-3 overflow-x-auto py-1">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx ? 'border-amber-400 scale-110 shadow-lg ring-1 ring-amber-400/50' : 'border-white/20 opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <TestDriveModal
        isOpen={testDriveModalOpen}
        onClose={() => setTestDriveModalOpen(false)}
        selectedCar={car}
      />
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        selectedCar={car}
      />
    </div>
  );
}
