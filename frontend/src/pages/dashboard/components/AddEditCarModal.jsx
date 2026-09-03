import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Plus, Edit2, Sparkles, Image as ImageIcon, UploadCloud, Link as LinkIcon, Check, X } from 'lucide-react';

export function AddEditCarModal({ isOpen, onClose, carToEdit, onSaveCar }) {
  const isEditing = !!carToEdit;
  const fileInputRef = useRef(null);

  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

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
      setUploadedFileName('');
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
      setUploadedFileName('');
    }
  }, [carToEdit, isOpen]);

  // Local File Upload Reader
  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert("Image size exceeds 8MB. Please select a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Str = uploadEvent.target?.result;
      if (base64Str) {
        setFormData(prev => ({ ...prev, imageUrl: base64Str }));
        setUploadedFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

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

        {/* Image Source Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 block">Vehicle Photo *</label>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setImageInputMode('upload')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  imageInputMode === 'upload' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5 text-amber-500" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  imageInputMode === 'url' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>Image URL</span>
              </button>
            </div>
          </div>

          {imageInputMode === 'upload' ? (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-amber-500 bg-amber-50/50 scale-[1.01]' 
                    : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {formData.imageUrl ? (
                    <div className="relative group shrink-0">
                      <img
                        src={formData.imageUrl}
                        alt="Vehicle Preview"
                        className="w-20 h-14 object-cover rounded-xl border border-slate-200 shadow-sm"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                  )}

                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">
                      {uploadedFileName ? (
                        <span className="text-amber-600 truncate block max-w-xs">{uploadedFileName}</span>
                      ) : (
                        "Click to choose local photo or drag & drop"
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supports PNG, JPG, JPEG, WEBP (up to 8MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
          )}
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
