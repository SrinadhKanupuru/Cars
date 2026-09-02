import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getDynamicBrands } from '../../data/brands';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Shield, Flag, Sparkles } from 'lucide-react';

const FALLBACK_BRAND_IMAGE = "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1000&q=80";

export function Brands() {
  const { cars } = useApp();

  const dynamicBrands = useMemo(() => {
    return getDynamicBrands(cars || []);
  }, [cars]);

  return (
    <div className="min-h-screen bg-slate-50/40 py-10 sm:py-12 text-slate-900">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{dynamicBrands.length} Prestigious Marques</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display text-slate-950 tracking-tight uppercase">
            Prestigious Marques
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Each marque represented in our portfolio represents generations of motorsport triumphs, aerodynamic innovations, and handcrafted artisanal mastery.
          </p>
        </div>

        {/* Full-Page Expansive Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {dynamicBrands.map((brand) => (
            <div
              key={brand.id}
              className="group rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Brand Cover Photo */}
              <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-950">
                <img
                  src={brand.image || FALLBACK_BRAND_IMAGE}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_BRAND_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 right-4 text-3xl filter drop-shadow-md">
                  {brand.logo}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block">
                      {brand.country} • Est. {brand.founded}
                    </span>
                    <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                      {brand.name}
                    </h2>
                  </div>
                  <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-slate-950 text-[11px] font-black shadow-xs">
                    {brand.modelsCount} Models
                  </span>
                </div>
              </div>

              {/* Brand Content Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-black text-brand-600 tracking-wider uppercase font-display">
                    {brand.tagline}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {brand.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400">Official Allocation</span>
                  <Link to={`/inventory?brand=${brand.name}`}>
                    <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right" className="text-xs px-3.5 py-2">
                      View {brand.name} Stock
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
