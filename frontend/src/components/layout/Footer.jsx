import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '../ui/Button';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-brand-600 flex items-center justify-center text-white font-display font-black text-lg shadow-lg shadow-brand-600/30">
                SX
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-2xl tracking-wider text-white">SPEEDX</span>
                <span className="font-display font-black text-2xl tracking-wider text-brand-500">MOTORS</span>
              </div>
            </Link>
            <p className="text-xs font-bold tracking-[0.25em] text-brand-400 uppercase">
              DRIVE THE EXTRAORDINARY.
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-light">
              The premier dealership for curated sports cars, track-honed hypercars, and exotic engineering. Providing verified vehicle provenance and white-glove worldwide delivery.
            </p>
          </div>

          {/* Col 2: Explore */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/inventory" className="hover:text-white transition-colors">Inventory</Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-white transition-colors">Brands</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Customer</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/customer/orders" className="hover:text-white transition-colors">My Orders</Link>
              </li>
              <li>
                <Link to="/customer/test-drives" className="hover:text-white transition-colors">My Test Drives</Link>
              </li>
              <li>
                <Link to="/customer/wishlist" className="hover:text-white transition-colors">Wishlist</Link>
              </li>
              <li>
                <Link to="/customer/profile" className="hover:text-white transition-colors">Profile</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & VIP Concierge */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Contact</h4>
            <div className="space-y-2.5 text-xs">
              <a href="tel:+1800773339" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>VIP Concierge: <strong>+1 (800) SPEEDX</strong></span>
              </a>
              <a href="mailto:concierge@speedxmotors.com" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>concierge@speedxmotors.com</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Globe className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Worldwide Enclosed Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SPEEDX MOTORS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
