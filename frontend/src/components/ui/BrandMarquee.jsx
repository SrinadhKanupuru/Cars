import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getDynamicBrands } from '../../data/brands';

export function BrandMarquee() {
  const { cars } = useApp();

  // Dynamically compute brands from active cars + base catalogue
  const dynamicBrands = useMemo(() => {
    return getDynamicBrands(cars || []);
  }, [cars]);

  // Duplicate the brands array to enable a seamless 100% infinite marquee loop
  const marqueeItems = useMemo(() => {
    const repeatCount = dynamicBrands.length < 8 ? 4 : 2;
    const duplicated = [];
    for (let i = 0; i < repeatCount; i++) {
      duplicated.push(...dynamicBrands);
    }
    return duplicated;
  }, [dynamicBrands]);

  return (
    <section className="py-12 sm:py-16 bg-slate-50/60 border-b border-slate-100 overflow-hidden relative">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 mb-8 text-center">
        {/* Section Header */}
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 block mb-1">
          MARQUES OF DISTINCTION
        </span>
        <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-slate-950">
          OUR PREMIUM BRANDS
        </h2>
      </div>

      {/* Marquee Ticker Track */}
      <div className="relative w-full overflow-hidden marquee-container py-2">
        {/* Left & Right Gradient Blur Fade Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 to-transparent z-10" />

        {/* Continuous Scrolling Row */}
        <div className="animate-marquee-left flex items-center gap-4 px-4">
          {marqueeItems.map((brand, idx) => (
            <Link
              key={`${brand.id || brand.name}-${idx}`}
              to={`/inventory?brand=${encodeURIComponent(brand.name)}`}
              className="flex-shrink-0 flex flex-col items-center justify-center w-36 sm:w-44 py-5 px-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-brand-400 hover:-translate-y-0.5 transition-all text-center group cursor-pointer"
            >
              {/* Brand Emoji / Logo */}
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {brand.logo || '🏎️'}
              </span>

              {/* Brand Name Only */}
              <span className="text-[11px] font-black uppercase text-slate-900 tracking-wider">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandMarquee;
