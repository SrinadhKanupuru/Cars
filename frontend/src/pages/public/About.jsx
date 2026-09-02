import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { 
  ShieldCheck, 
  Award, 
  Globe, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Gauge
} from 'lucide-react';

export function About() {
  const leadership = [
    {
      name: "Sebastian Vance",
      role: "Founder & Dealership Principal",
      bio: "Former FIA GT racer and hypercar collector with over 25 years curating blue-chip exotics for private family offices.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Camille Laurent",
      role: "Head of International Acquisitions",
      bio: "Direct relationships with Maranello, Sant'Agata, and Stuttgart factory ateliers for off-market rare allocations.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Gianluca Moretti",
      role: "Master Technical Director",
      bio: "Factory-certified master technician overseeing telemetry diagnosis, aerodynamic setup, and track certification.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/40 py-10 sm:py-12 text-slate-900">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black font-display text-slate-950 tracking-tight">
            The SPEEDX Heritage
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            Founded on the relentless pursuit of speed and precision, SPEEDX MOTORS connects the world's most discerning collectors with the absolute pinnacle of automotive engineering.
          </p>
        </div>

        {/* Story Grid with Imagery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 h-96 sm:h-[450px]">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
              alt="SpeedX Dealership Experience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Our Sanctuary</span>
              <p className="text-lg font-bold font-display">Beverly Hills & Monaco Flagship Galleries</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">The Mission</span>
              <h2 className="text-3xl font-extrabold text-slate-950 font-display">
                Redefining the Luxury Hypercar Experience
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              We established SPEEDX MOTORS not merely to retail high-performance vehicles, but to create an elevated sanctuary where provenance, engineering telemetry, and bespoke client hospitality intersect seamlessly.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every supercar and hypercar residing in our portfolio is meticulously selected, rigorously track-tested, and verified through factory diagnostic channels to ensure total transparency for private collectors and family offices.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-brand-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Zero Compromise</h4>
                <p className="text-xs text-slate-500 mt-1">100% verified titles and accident-free provenance guarantees.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <Globe className="w-6 h-6 text-brand-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900">Global Reach</h4>
                <p className="text-xs text-slate-500 mt-1">Logistics hubs in Los Angeles, Monaco, Dubai, and Tokyo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Leadership */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">The Curators</span>
            <h2 className="text-3xl font-extrabold text-slate-950 font-display">Showroom Leadership</h2>
            <p className="text-xs sm:text-sm text-slate-600">Meet the visionaries guiding our global acquisitions and client concierge.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-luxury p-6 space-y-4 text-center">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-brand-600 shadow-md"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-950 font-display">{leader.name}</h3>
                  <p className="text-xs font-bold text-brand-600 uppercase tracking-wide mt-0.5">{leader.role}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Showrooms Overview */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Private Viewings</span>
            <h2 className="text-3xl font-bold font-display">Experience Our Gallery in Person</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              We welcome clients by appointment to our private viewing suites in Beverly Hills, Geneva, and Dubai for bespoke consultations.
            </p>
          </div>
          <Link to="/contact">
            <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
              Book Private Showing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
