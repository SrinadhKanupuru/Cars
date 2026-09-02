import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  List, 
  Heart, 
  Search,
  SlidersHorizontal, 
  X,
  ChevronRight,
  ChevronLeft,
  Zap,
  Gauge,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../utils/cn';
import { getDynamicBrands } from '../../data/brands';

const FALLBACK_CAR_IMAGE = "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80";

export function Inventory() {
  const { cars, wishlist, toggleWishlist, isWishlisted } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialBrand = searchParams.get('brand') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [layout, setLayout] = useState('grid');
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [priceRange, setPriceRange] = useState(5000000); // Up to $5M default
  const [bodyType, setBodyType] = useState('All Types');
  const [fuelType, setFuelType] = useState('All Fuel Types');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    if (initialBrand) {
      setSelectedBrand(initialBrand);
    }
  }, [initialBrand]);

  const handleClearAll = () => {
    setSelectedBrand('');
    setPriceRange(5000000);
    setBodyType('All Types');
    setFuelType('All Fuel Types');
    setSortBy('newest');
    setSearchTerm('');
    setSearchParams({});
    setCurrentPage(1);
  };

  // Count active filters (for badge)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBrand && selectedBrand !== 'All Brands') count++;
    if (priceRange < 5000000) count++;
    if (bodyType !== 'All Types') count++;
    if (fuelType !== 'All Fuel Types') count++;
    if (sortBy !== 'newest') count++;
    if (searchTerm.trim()) count++;
    return count;
  }, [selectedBrand, priceRange, bodyType, fuelType, sortBy, searchTerm]);

  // Filter & Sort Logic
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // 1. Search keyword
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match = 
          car.brand?.toLowerCase().includes(q) || 
          car.model?.toLowerCase().includes(q) ||
          car.tagline?.toLowerCase().includes(q) ||
          car.engine?.toLowerCase().includes(q);
        if (!match) return false;
      }

      // 2. Brand filter
      if (selectedBrand && selectedBrand !== 'All Brands') {
        const b = selectedBrand.toLowerCase();
        const carB = car.brand?.toLowerCase() || '';
        if (!carB.includes(b) && !b.includes(carB)) {
          return false;
        }
      }

      // 3. Price Range
      if (car.price > priceRange) {
        return false;
      }

      // 4. Body Type
      if (bodyType !== 'All Types') {
        if (!car.bodyType?.toLowerCase().includes(bodyType.toLowerCase())) {
          return false;
        }
      }

      // 5. Fuel Type
      if (fuelType !== 'All Fuel Types') {
        if (!car.fuelType?.toLowerCase().includes(fuelType.toLowerCase())) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'hp-desc':
          return (b.horsepower || 0) - (a.horsepower || 0);
        case 'newest':
        default:
          return (b.year || 2024) - (a.year || 2024);
      }
    });
  }, [cars, searchTerm, selectedBrand, priceRange, bodyType, fuelType, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage) || 1;
  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCars.slice(start, start + itemsPerPage);
  }, [filteredCars, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-slate-50/40 py-6 sm:py-8 text-slate-900 font-sans antialiased">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 space-y-6 sm:space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-4 sm:pb-6">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-brand-600 block mb-1">
              SPEEDX MOTORS SHOWROOM
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display uppercase tracking-tight text-slate-950">
              INVENTORY
            </h1>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center justify-between sm:justify-end gap-2">
            <span>Showing <strong className="text-slate-900 font-bold">{filteredCars.length}</strong> supercars</span>
            
            {/* Mobile Filters Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Full-Width Expansive 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">
          
          {/* ========================================================================= */}
          {/* 1. DESKTOP FILTERS SIDEBAR (Hidden on Mobile, Sticky on Desktop) */}
          {/* ========================================================================= */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 lg:sticky lg:top-24 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">FILTERS</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
                >
                  Clear All ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* BRAND */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">BRAND</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="">All Brands</option>
                {getDynamicBrands(cars).map((b) => (
                  <option key={b.id || b.name} value={b.name}>
                    {b.name} ({b.modelsCount})
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE RANGE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>MAX PRICE</span>
                <span className="text-brand-600 font-black font-display text-xs">
                  {priceRange >= 1000000 ? `$${(priceRange / 1000000).toFixed(1)}M` : `$${(priceRange / 1000).toFixed(0)}k`}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>$50,000</span>
                <span>$5,000,000</span>
              </div>
            </div>

            {/* BODY TYPE */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">BODY TYPE</label>
              <select
                value={bodyType}
                onChange={(e) => {
                  setBodyType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="All Types">All Types</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible / Spider</option>
              </select>
            </div>

            {/* FUEL TYPE */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">FUEL TYPE</label>
              <select
                value={fuelType}
                onChange={(e) => {
                  setFuelType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="All Fuel Types">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid / PHEV</option>
                <option value="Electric">Electric</option>
                <option value="FlexFuel">FlexFuel (E85)</option>
              </select>
            </div>

            {/* SORT BY */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">SORT BY</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                <option value="newest">Newest Year First</option>
                <option value="price-desc">Price: Highest First</option>
                <option value="price-asc">Price: Lowest First</option>
                <option value="hp-desc">Horsepower: Highest First</option>
              </select>
            </div>

            {/* APPLY FILTERS BUTTON */}
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-brand-600 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm active:scale-95 cursor-pointer"
            >
              APPLY FILTERS
            </button>
          </aside>

          {/* ========================================================================= */}
          {/* 2. RIGHT CARS GRID AREA */}
          {/* ========================================================================= */}
          <main className="w-full lg:col-span-9 space-y-4 sm:space-y-6">
            
            {/* Top Control Bar: Search + Layout Toggle + Item Count */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              
              {/* Keyword Search Input */}
              <div className="relative w-full sm:w-80 md:w-96">
                <input
                  type="text"
                  placeholder="Search by brand, model, horsepower..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Layout Switcher & Item Info */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => setLayout('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      layout === 'grid' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout('list')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      layout === 'list' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[11px] sm:text-xs text-slate-600 font-bold truncate">
                  {filteredCars.length} vehicles available
                </span>
              </div>
            </div>

            {/* Active Filters Pill Bar (Mobile & Desktop) */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Active:</span>
                {selectedBrand && selectedBrand !== 'All Brands' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/70 text-slate-800 text-[11px] font-semibold shrink-0">
                    {selectedBrand}
                    <button type="button" onClick={() => setSelectedBrand('')} className="hover:text-brand-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {bodyType !== 'All Types' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/70 text-slate-800 text-[11px] font-semibold shrink-0">
                    {bodyType}
                    <button type="button" onClick={() => setBodyType('All Types')} className="hover:text-brand-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {fuelType !== 'All Fuel Types' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/70 text-slate-800 text-[11px] font-semibold shrink-0">
                    {fuelType}
                    <button type="button" onClick={() => setFuelType('All Fuel Types')} className="hover:text-brand-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {priceRange < 5000000 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/70 text-slate-800 text-[11px] font-semibold shrink-0">
                    Max: ${(priceRange / 1000).toFixed(0)}k
                    <button type="button" onClick={() => setPriceRange(5000000)} className="hover:text-brand-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] font-bold text-brand-600 hover:underline shrink-0 ml-1"
                >
                  Reset All
                </button>
              </div>
            )}

            {/* No Results Fallback */}
            {paginatedCars.length === 0 && (
              <div className="text-center py-16 sm:py-20 space-y-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-base sm:text-lg font-black text-slate-900 font-display">No vehicles match your active filters</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Try broadening your search term, adjusting the price slider, or resetting filters.</p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-brand-600/30"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Car Cards Grid */}
            <div className={`grid ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6' : 'grid-cols-1 gap-4 sm:gap-5'}`}>
              {paginatedCars.map((car) => {
                const wishlisted = isWishlisted(car.id);
                const carImg = (car.images && car.images[0]) || FALLBACK_CAR_IMAGE;

                if (layout === 'list') {
                  return (
                    <div
                      key={car.id}
                      className="group rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col md:flex-row gap-4 sm:gap-6 items-center"
                    >
                      <Link 
                        to={`/inventory/${car.id}`}
                        className="relative w-full md:w-72 lg:w-80 h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-50 shrink-0 block"
                      >
                        <img
                          src={carImg}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-xl"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_CAR_IMAGE;
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(car.id);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-brand-600 shadow-md transition-all cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${wishlisted ? "fill-brand-600 text-brand-600" : ""}`} />
                        </button>
                      </Link>

                      <div className="flex-1 w-full space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{car.brand}</span>
                            <Link to={`/inventory/${car.id}`}>
                              <h3 className="text-lg sm:text-xl font-black font-display text-slate-950 hover:text-brand-600 transition-colors">
                                {car.model}
                              </h3>
                            </Link>
                          </div>
                          <p className="text-lg sm:text-xl font-black text-brand-600 font-display">
                            {formatPrice(car.price)}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{car.description}</p>
                        <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100 flex-wrap">
                          <span>{car.horsepower} HP</span>
                          <span>•</span>
                          <span>{car.zeroToHundred} 0-100</span>
                          <span>•</span>
                          <span>{car.topSpeed} V-Max</span>
                          <span>•</span>
                          <span>{car.year}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={car.id}
                    className="group rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Area */}
                      <Link 
                        to={`/inventory/${car.id}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="relative w-full h-44 sm:h-52 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 mb-3 sm:mb-3.5 flex items-center justify-center block cursor-pointer"
                      >
                        <img
                          src={carImg}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_CAR_IMAGE;
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(car.id);
                          }}
                          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-brand-600 shadow-md transition-all cursor-pointer"
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-brand-600 text-brand-600" : ""}`} />
                        </button>
                        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                          {car.year}
                        </span>
                      </Link>

                      {/* Make & Model Link */}
                      <Link 
                        to={`/inventory/${car.id}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="block hover:text-brand-600 transition-colors"
                      >
                        <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{car.brand}</p>
                        <h3 className="text-sm sm:text-base font-black uppercase font-display text-slate-950 line-clamp-1">
                          {car.model}
                        </h3>
                      </Link>

                      {/* Price */}
                      <p className="text-base sm:text-lg font-black text-brand-600 mt-1.5 font-display">
                        {formatPrice(car.price)}
                      </p>

                      {/* Specs */}
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 mt-1 font-medium flex-wrap">
                        <span>{car.horsepower} HP</span>
                        <span>•</span>
                        <span>{car.zeroToHundred || '2.9s'} 0-100</span>
                        <span>•</span>
                        <span>{car.mileage || '1,200 km'}</span>
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100">
                      <Link to={`/inventory/${car.id}`} className="block w-full">
                        <button
                          type="button"
                          className="w-full py-2 sm:py-2.5 rounded-xl bg-slate-950 hover:bg-brand-600 active:scale-95 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-6 sm:pt-8 pb-4">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE FILTERS SLIDE-OVER DRAWER (Z-50) */}
      {/* ========================================================================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Slide-in Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto z-10 space-y-6">
            <div className="space-y-5">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-950 font-display">
                    FILTER SUPERCARS
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* BRAND */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">BRAND</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">All Brands</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Lamborghini">Lamborghini</option>
                  <option value="McLaren">McLaren</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Rolls-Royce">Rolls-Royce</option>
                  <option value="Bugatti">Bugatti</option>
                  <option value="Koenigsegg">Koenigsegg</option>
                  <option value="Mercedes-AMG">Mercedes-AMG</option>
                  <option value="BMW M">BMW M</option>
                  <option value="Audi Sport">Audi Sport</option>
                  <option value="Nissan GT-R">Nissan GT-R</option>
                  <option value="Aston Martin">Aston Martin</option>
                </select>
              </div>

              {/* PRICE RANGE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>MAX PRICE</span>
                  <span className="text-brand-600 font-black font-display text-xs">
                    {priceRange >= 1000000 ? `$${(priceRange / 1000000).toFixed(1)}M` : `$${(priceRange / 1000).toFixed(0)}k`}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                  <span>$50,000</span>
                  <span>$5,000,000</span>
                </div>
              </div>

              {/* BODY TYPE */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">BODY TYPE</label>
                <select
                  value={bodyType}
                  onChange={(e) => {
                    setBodyType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All Types">All Types</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible / Spider</option>
                </select>
              </div>

              {/* FUEL TYPE */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">FUEL TYPE</label>
                <select
                  value={fuelType}
                  onChange={(e) => {
                    setFuelType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All Fuel Types">All Fuel Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid / PHEV</option>
                  <option value="Electric">Electric</option>
                  <option value="FlexFuel">FlexFuel (E85)</option>
                </select>
              </div>

              {/* SORT BY */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">SORT BY</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="newest">Newest Year First</option>
                  <option value="price-desc">Price: Highest First</option>
                  <option value="price-asc">Price: Lowest First</option>
                  <option value="hp-desc">Horsepower: Highest First</option>
                </select>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-brand-600/30 transition-all cursor-pointer"
              >
                SHOW {filteredCars.length} VEHICLES
              </button>

              <button
                type="button"
                onClick={() => {
                  handleClearAll();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
