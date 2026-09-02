import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Gauge, Zap, Calendar, ArrowRight, ShieldCheck, Star, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/cn';

export function CarCard({ car, layout = "grid", onBookTestDrive }) {
  const { isWishlisted, toggleWishlist } = useApp();
  const wishlisted = isWishlisted(car.id);

  const getAvailabilityBadge = (status) => {
    switch (status) {
      case 'Available':
        return <Badge variant="success" dot size="sm" className="shadow-xs font-bold">Available</Badge>;
      case 'Reserved':
        return <Badge variant="warning" dot size="sm" className="shadow-xs font-bold">Reserved</Badge>;
      case 'Sold':
        return <Badge variant="dark" dot size="sm" className="shadow-xs font-bold">Sold</Badge>;
      default:
        return <Badge variant="default" size="sm" className="shadow-xs font-bold">{status}</Badge>;
    }
  };

  if (layout === "list") {
    return (
      <div className="group rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-luxury hover:shadow-luxury-hover hover:border-slate-300 transition-all duration-400 flex flex-col md:flex-row gap-6 items-center hover:-translate-y-1">
        {/* Car Image with Badge */}
        <div className="relative w-full md:w-80 h-52 sm:h-60 rounded-2xl overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center p-2 image-sheen">
          <img
            src={car.images && car.images[0] ? car.images[0] : "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80"}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-xl"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80";
            }}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {getAvailabilityBadge(car.availability)}
            {car.isNewArrival && (
              <Badge variant="primary" size="sm" className="animate-pulse shadow-glow-red">New Arrival</Badge>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(car.id);
            }}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 hover:text-brand-600 shadow-md transition-all active:scale-90 cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-brand-600 text-brand-600 animate-bounce" : ""}`} />
          </button>
        </div>

        {/* Info & Specs */}
        <div className="flex-1 w-full space-y-3.5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-brand-600">{car.brand}</span>
                <div className="flex items-center text-amber-500 text-xs font-semibold gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{car.rating || '4.9'}</span>
                </div>
              </div>
              <Link to={`/inventory/${car.id}`} className="hover:text-brand-600 transition-colors">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-display mt-0.5">{car.model}</h3>
              </Link>
              <p className="text-xs text-slate-500 line-clamp-1">{car.engine}</p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Acquisition Price</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 font-display">{formatPrice(car.price)}</span>
            </div>
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-100 text-center hover:border-slate-200 transition-colors">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-brand-600" /> Power
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{car.horsepower} HP</p>
            </div>
            <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-100 text-center hover:border-slate-200 transition-colors">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3 text-brand-600" /> 0-100
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{car.zeroToHundred}</p>
            </div>
            <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-100 text-center hover:border-slate-200 transition-colors">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-brand-600" /> Year
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{car.year}</p>
            </div>
            <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-100 text-center hover:border-slate-200 transition-colors">
              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-600" /> Top Speed
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{car.topSpeed}</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Mileage: <strong className="text-slate-800">{car.mileage}</strong> • Trans: <strong className="text-slate-800">{car.transmission.split(' ')[0]}</strong>
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onBookTestDrive && car.availability === 'Available' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBookTestDrive(car)}
                  className="flex-1 sm:flex-none text-xs rounded-xl"
                >
                  Book Drive
                </Button>
              )}
              <Link to={`/inventory/${car.id}`} className="flex-1 sm:flex-none">
                <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right" className="w-full text-xs rounded-xl shadow-luxury">
                  Telemetry Dossier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout - Studio Aesthetic
  return (
    <div className="group rounded-3xl border border-slate-200/90 bg-white p-4 shadow-luxury hover:shadow-luxury-hover hover:border-slate-300 hover-lift transition-all duration-400 flex flex-col justify-between h-full relative overflow-hidden">
      <div>
        {/* Car Image with Badge - Clickable Link with Image Sheen Animation */}
        <Link 
          to={`/inventory/${car.id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-50 mb-3.5 flex items-center justify-center block image-sheen cursor-pointer border border-slate-100"
        >
          <img
            src={car.images && car.images[0] ? car.images[0] : "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80"}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80";
            }}
          />
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start z-10">
            {getAvailabilityBadge(car.availability)}
            {car.isNewArrival && (
              <Badge variant="primary" size="sm" className="animate-pulse shadow-glow-red font-bold">New Arrival</Badge>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(car.id);
            }}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 hover:text-brand-600 shadow-md transition-all active:scale-90 z-10 cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-brand-600 text-brand-600 animate-bounce" : ""}`} />
          </button>
          <div className="absolute bottom-2.5 left-2.5 right-2.5 py-1 px-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] flex items-center justify-between font-medium border border-white/10">
            <span>{car.year} Model</span>
            <span className="font-mono text-cyan-300 font-bold">{car.mileage}</span>
          </div>
        </Link>

        {/* Header Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-600">{car.brand}</span>
            <div className="flex items-center text-amber-500 text-xs font-semibold gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{car.rating || '4.9'}</span>
            </div>
          </div>
          <Link to={`/inventory/${car.id}`} className="hover:text-brand-600 transition-colors">
            <h3 className="text-base font-extrabold text-slate-950 font-display line-clamp-1 group-hover:text-brand-600 transition-colors">
              {car.model}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-1">{car.engine}</p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 my-2.5 border-y border-slate-100">
          <div className="text-center">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block">Power</span>
            <span className="text-xs font-black text-slate-900">{car.horsepower} HP</span>
          </div>
          <div className="text-center border-x border-slate-100">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block">0-100</span>
            <span className="text-xs font-black text-brand-600">{car.zeroToHundred}</span>
          </div>
          <div className="text-center">
            <span className="text-[9px] text-slate-400 font-semibold uppercase block">Top Speed</span>
            <span className="text-xs font-black text-slate-900">{car.topSpeed}</span>
          </div>
        </div>
      </div>

      {/* Footer Price and CTA */}
      <div className="pt-1 flex items-center justify-between gap-2">
        <div>
          <span className="text-[9px] text-slate-400 font-semibold uppercase block">Acquisition</span>
          <span className="text-base font-black text-slate-950 font-display">{formatPrice(car.price)}</span>
        </div>
        <Link to={`/inventory/${car.id}`}>
          <Button variant="dark" size="sm" icon={ArrowRight} iconPosition="right" className="rounded-xl text-xs px-3.5 py-1.5 shadow-sm group-hover:bg-brand-600 group-hover:border-brand-600 transition-colors">
            Dossier
          </Button>
        </Link>
      </div>
    </div>
  );
}
