import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Send,
  Building,
  ShieldCheck
} from 'lucide-react';

export function Contact() {
  const { showToast, submitEnquiry } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Beverly Hills Showroom',
    interest: 'Vehicle Acquisition',
    message: ''
  });

  const locations = [
    {
      city: "Beverly Hills",
      address: "9450 Wilshire Blvd, Beverly Hills, CA 90212",
      phone: "+1 (310) 555-7733",
      email: "beverlyhills@speedxmotors.com",
      hours: "Mon - Sat: 9:00 AM - 7:00 PM (By Appt)"
    },
    {
      city: "Monaco & Geneva",
      address: "24 Boulevard des Moulins, 98000 Monaco",
      phone: "+377 93 50 12 34",
      email: "monaco@speedxmotors.com",
      hours: "Mon - Fri: 10:00 AM - 6:30 PM"
    },
    {
      city: "Dubai",
      address: "Al Wasl Road, Umm Suqeim, Dubai, UAE",
      phone: "+971 4 800 7733",
      email: "dubai@speedxmotors.com",
      hours: "Sun - Thu: 10:00 AM - 8:00 PM"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    submitEnquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      carName: `${formData.interest} (${formData.location})`,
      message: formData.message,
      isVip: true
    });
    setSubmitted(true);
    showToast("Your VIP consultation request has been received!", "success");
  };

  return (
    <div className="min-h-screen bg-slate-50/40 py-10 sm:py-12 text-slate-900">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black font-display text-slate-950 tracking-tight uppercase">
            Connect with Our Concierge
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            Whether inquiring about a specific allocation, arranging enclosed transport, or scheduling a private viewing suite, our senior directors are at your service.
          </p>
        </div>

        {/* Form and Direct Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-luxury space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-bold text-slate-950 font-display">Private Inquiry Form</h2>
              <p className="text-xs text-slate-500">All transmissions are encrypted and handled with absolute confidentiality.</p>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 font-display">Message Dispatched</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. A SPEEDX Senior Concierge will respond to your inquiry within <strong>2 business hours</strong>.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lord Julian Beaumont"
                  />
                  <Input
                    label="Direct Phone / WhatsApp"
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

                <Input
                  label="Private Email Address"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@luxuryportfolio.com"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Preferred Gallery"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    options={[
                      'Beverly Hills Showroom',
                      'Monaco & Geneva Office',
                      'Dubai Showroom Suite',
                      'Tokyo Private Lounge'
                    ]}
                  />
                  <Select
                    label="Inquiry Purpose"
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    options={[
                      'Vehicle Acquisition',
                      'Consignment / Trade-in',
                      'Enclosed Logistics & Transport',
                      'Track Support & Tuning',
                      'Private Wealth Escrow'
                    ]}
                  />
                </div>

                <Textarea
                  label="Detailed Inquiries or Vehicle Preferences"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe vehicle requirements, delivery timeline, or private viewing schedule..."
                />

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    100% Confidential
                  </span>
                  <Button type="submit" variant="primary" size="md" icon={Send} iconPosition="right">
                    Submit VIP Inquiry
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Showroom Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Direct VIP Dispatch</span>
              <h3 className="text-2xl font-bold font-display">24-Hour Global Hotline</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                For urgent off-market acquisitions, track telemetry bookings, or airport transfers.
              </p>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <a href="tel:+1800773339" className="text-base font-bold text-brand-400 hover:text-brand-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +1 (800) SPEEDX-0
                </a>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-500" />
                  concierge@speedxmotors.com
                </p>
              </div>
            </div>

            {/* Showroom Cards */}
            <div className="space-y-4">
              {locations.map((loc, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-brand-600" />
                    <h4 className="text-sm font-bold text-slate-900">{loc.city} Gallery</h4>
                  </div>
                  <p className="text-xs text-slate-600">{loc.address}</p>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                    <span>{loc.phone}</span>
                    <span>{loc.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
