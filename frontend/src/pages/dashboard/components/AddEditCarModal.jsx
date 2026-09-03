import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Plus, Edit2, Sparkles, Image as ImageIcon } from 'lucide-react';

export function AddEditCarModal({ isOpen, onClose, carToEdit, onSaveCar }) {
  const isEditing = !!carToEdit;

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 350000,
    daily_rate: 1950,
    engine: '4.0L Twin-Turbocharged V8',
    fuelType: 'Gasoline (V8 / V12)',
    transmission: '7-Speed Dual-Clutch F1',
    horsepower: 710,
    seats: 2,
    mileage: '1,200 km',
    description: 'Factory certified prestige supercar in immaculate collector condition.',
    availability: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80'
  });

  useEffect(() => {
    if (carToEdit) {
      setFormData({
        brand: carToEdit.brand || '',
        model: carToEdit.model || '',
        year: carToEdit.year || 2025,
        price: carToEdit.price || 350000,
        daily_rate: carToEdit.daily_rate || (carToEdit.price ? Math.round(carToEdit.price / 160) : 1950),
        engine: carToEdit.engine || '4.0L Twin-Turbocharged V8',
        fuelType: carToEdit.fuelType || carToEdit.fuel_type || 'Gasoline (V8 / V12)',
        transmission: carToEdit.transmission || 'Dual-Clutch',
        horsepower: carToEdit.horsepower || 700,
        seats: carToEdit.seats || 2,
        mileage: carToEdit.mileage || '1,000 km',
        description: carToEdit.description || 'Showroom certified supercar.',
        availability: carToEdit.availability || carToEdit.status || 'Available',
        imageUrl: carToEdit.images?.[0] || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80'
      });
    } else {
      setFormData({
        brand: 'Ferrari',
        model: '',
        year: new Date().getFullYear(),
        price: 350000,
        daily_rate: 1950,
        engine: '4.0L Twin-Turbocharged V8',
        fuelType: 'Gasoline (V8 / V12)',
        transmission: '7-Speed Dual-Clutch F1',
        horsepower: 710,
        seats: 2,
        mileage: '1,200 km',
        description: 'Factory certified prestige supercar in immaculate collector condition.',
        availability: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80'
      });
    }
  }, [carToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const carData = {
      ...(carToEdit || {}),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: parseInt(formData.year, 10),
      price: parseFloat(formData.price),
      daily_rate: parseFloat(formData.daily_rate),
      engine: formData.engine.trim() || `${formData.horsepower}HP High-Performance V8`,
      fuelType: formData.fuelType,
      fuel_type: formData.fuelType,
      transmission: formData.transmission,
      horsepower: parseInt(formData.horsepower, 10),
      seats: parseInt(formData.seats, 10),
      mileage: formData.mileage,
      description: formData.description,
      availability: formData.availability,
      status: formData.availability.toUpperCase(),
      imageUrl: formData.imageUrl,
      images: [formData.imageUrl, ...(carToEdit?.images?.slice(1) || [])]
    };

    onSaveCar(carData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `EDIT VEHICLE • ${carToEdit?.brand} ${carToEdit?.model}` : "ADD NEW LUXURY VEHICLE"}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Brand / Marque *</label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g. Ferrari, Porsche, Lamborghini"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Model Name *</label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="e.g. 296 GTB Assetto Fiorano"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Model Year *</label>
            <input
              type="number"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Acquisition Price ($) *</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => {
                const p = parseFloat(e.target.value) || 0;
                setFormData({ 
                  ...formData, 
                  price: p,
                  daily_rate: Math.round(p / 160)
                });
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Daily Rental Rate ($) *</label>
            <input
              type="number"
              required
              value={formData.daily_rate}
              onChange={(e) => setFormData({ ...formData, daily_rate: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Engine Specification</label>
            <input
              type="text"
              value={formData.engine}
              onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
              placeholder="e.g. 3.9L Twin-Turbo V8"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Fuel & Powertrain</label>
            <input
              type="text"
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              placeholder="e.g. Gasoline (V8 / V12) or Hybrid"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Horsepower (HP)</label>
            <input
              type="number"
              value={formData.horsepower}
              onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Transmission</label>
            <select
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="7-Speed Dual-Clutch F1">7-Speed Dual-Clutch F1</option>
              <option value="8-Speed PDK Dual-Clutch">8-Speed PDK Dual-Clutch</option>
              <option value="6-Speed Manual Gated">6-Speed Manual Gated</option>
              <option value="Single-Speed Direct EV">Single-Speed Direct EV</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Availability Status</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Primary Image URL *</label>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-10 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
              />
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Description</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isEditing ? 'Update Vehicle' : 'Add Vehicle to Fleet'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddEditCarModal;
