import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Select } from './Select';
import { Button } from './Button';

export function FilterPanel({
  filters,
  onFilterChange,
  onReset,
  availableBrands = [],
  totalResults = 0,
  className
}) {
  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 p-6 shadow-luxury space-y-6 ${className || ''}`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-brand-600" />
          <h3 className="text-base font-bold text-slate-950 font-display">Refine Inventory</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      <div className="space-y-4">
        {/* Brand Filter */}
        <Select
          label="Make / Brand"
          value={filters.brand}
          onChange={(e) => onFilterChange('brand', e.target.value)}
          options={[
            { label: 'All Prestigious Brands', value: '' },
            ...availableBrands.map(b => ({ label: b, value: b }))
          ]}
        />

        {/* Max Price Filter */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-700">
            <span>Max Price</span>
            <span className="text-brand-600 font-bold">
              {filters.maxPrice ? `$${Number(filters.maxPrice).toLocaleString()}` : 'Any Budget'}
            </span>
          </div>
          <input
            type="range"
            min="100000"
            max="5000000"
            step="50000"
            value={filters.maxPrice || 5000000}
            onChange={(e) => onFilterChange('maxPrice', e.target.value === '5000000' ? '' : e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>$100k</span>
            <span>$2.5M</span>
            <span>$5M+</span>
          </div>
        </div>

        {/* Min Horsepower Filter */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-700">
            <span>Min Power</span>
            <span className="text-brand-600 font-bold">
              {filters.minHp ? `${filters.minHp} HP+` : 'Any HP'}
            </span>
          </div>
          <input
            type="range"
            min="400"
            max="1600"
            step="50"
            value={filters.minHp || 400}
            onChange={(e) => onFilterChange('minHp', e.target.value === '400' ? '' : e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>400 HP</span>
            <span>1,000 HP</span>
            <span>1,600 HP</span>
          </div>
        </div>

        {/* Year Filter */}
        <Select
          label="Model Year"
          value={filters.year}
          onChange={(e) => onFilterChange('year', e.target.value)}
          options={[
            { label: 'All Model Years', value: '' },
            { label: '2024 Newest', value: '2024' },
            { label: '2023', value: '2023' },
            { label: '2022 & Older', value: '2022' }
          ]}
        />

        {/* Transmission Filter */}
        <Select
          label="Transmission"
          value={filters.transmission}
          onChange={(e) => onFilterChange('transmission', e.target.value)}
          options={[
            { label: 'All Transmissions', value: '' },
            { label: 'Dual-Clutch / F1', value: 'Dual-Clutch' },
            { label: 'Automatic', value: 'Automatic' },
            { label: 'Sequential / Light Speed', value: 'Light Speed' },
            { label: 'Direct Drive / EV', value: 'Direct' }
          ]}
        />

        {/* Fuel / Powertrain Filter */}
        <Select
          label="Powertrain"
          value={filters.fuelType}
          onChange={(e) => onFilterChange('fuelType', e.target.value)}
          options={[
            { label: 'All Powertrains', value: '' },
            { label: 'Petrol (Naturally Aspirated & Turbo)', value: 'Petrol' },
            { label: 'Plug-in Hybrid (HPEV / V8 / V12)', value: 'Hybrid' },
            { label: 'All-Electric High-Voltage', value: 'Electric' },
            { label: 'FlexFuel E85', value: 'FlexFuel' }
          ]}
        />

        {/* Availability Filter */}
        <Select
          label="Showroom Availability"
          value={filters.availability}
          onChange={(e) => onFilterChange('availability', e.target.value)}
          options={[
            { label: 'All Vehicles', value: '' },
            { label: 'Available Immediate Delivery', value: 'Available' },
            { label: 'Reserved / In Escrow', value: 'Reserved' },
            { label: 'Sold / Historical', value: 'Sold' }
          ]}
        />
      </div>

      <div className="pt-2 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Showing <strong className="text-slate-900">{totalResults}</strong> tailored results
        </p>
      </div>
    </div>
  );
}
