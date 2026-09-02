import React, { useState } from 'react';
import { dealershipServices } from '../../data/services';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Phone,
  Wrench,
  Truck,
  Flag
} from 'lucide-react';

export function Services() {
  const { showToast } = useApp();
  const [selectedService, setSelectedService] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Lord Julian Beaumont',
    email: 'j.beaumont@prestigegroup.ch',
    phone: '+41 22 765 4321',
    carModel: 'Ferrari SF90 Stradale',
    preferredDate: '2026-08-30',
    notes: 'Please arrange enclosed trailer pickup from my Geneva residence.',
  });

  const handleOpenBooking = (service) => {
    setSelectedService(service);
    setBookingSubmitted(false);
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setBookingSubmitted(true);
      showToast(`Service appointment booked for ${selectedService?.title}!`, 'success');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50/40 py-10 sm:py-12 text-slate-900">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black font-display text-slate-950 tracking-tight uppercase">
            Comprehensive Hypercar Services
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            Beyond vehicle acquisitions, SPEEDX MOTORS maintains a world-class network of master technicians, track coaches, enclosed logistics fleets, and private wealth specialists.
          </p>
        </div>

        {/* Services Full Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dealershipServices.map((srv) => (
            <div
              key={srv.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-luxury hover:shadow-luxury-hover hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{srv.category}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-950 font-display">{srv.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{srv.fullDesc}</p>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Highlights</span>
                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Est. Timeline:</span>
                  <strong className="text-slate-900">{srv.timeline}</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Pricing:</span>
                  <strong className="text-brand-600 font-bold">{srv.priceRange}</strong>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleOpenBooking(srv)}
                  className="w-full shadow-brand-600/20"
                >
                  Book Service Consultation
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Track / Concierge Hotline Banner */}
        <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">24/7 Global VIP Support</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">Need Immediate Track-Side or Transport Assistance?</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              Our master technical dispatch team is on standby 24 hours a day for our VIP client roster across North America, Europe, and the Middle East.
            </p>
          </div>
          <a href="tel:+1800773339">
            <Button variant="white" size="lg" icon={Phone}>
              Call Direct: +1 (800) SPEEDX-0
            </Button>
          </a>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title={bookingSubmitted ? "Appointment Requested" : `Book ${selectedService?.title}`}
        subtitle="SPEEDX Technical Services & Concierge Dispatch"
      >
        {bookingSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 font-display">Service Scheduled</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Our Service Operations Director has received your request for <strong>{formData.carModel}</strong>. A dedicated technician and logistics bay have been reserved for <strong>{formData.preferredDate}</strong>.
              </p>
            </div>
            <Button variant="primary" onClick={() => setBookingModalOpen(false)} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Client Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Phone Number"
                required
                type="tel"
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                placeholder="10-digit number (e.g. 9876543210)"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Vehicle Make & Model"
                required
                value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                placeholder="e.g. Porsche 911 GT3 RS"
              />
              <Input
                label="Preferred Service Date"
                required
                type="date"
                value={formData.preferredDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              />
            </div>
            <Textarea
              label="Service Specifications or Pickup Location"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm Service Booking
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
