import React, { useState } from 'react';
import {
  Sprout,
  ArrowRight,
  Receipt,
  BarChart2,
  Tags,
  Smartphone,
  TrendingUp,
  Target,
  Zap,
  Sparkles,
  Play,
  Star,
  Lock,
  Crosshair,
  Headphones,
  MessageSquare,
  Mail,
  X,
  Send,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';

type Props = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: Props) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setIsContactOpen(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 2000);
  };
  return (
    <div className="min-h-screen bg-[#0A1628] text-white flex flex-col font-sans selection:bg-blue-500/40 selection:text-white overflow-x-hidden">

      {/* ─── Navbar ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onGetStarted}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-tight">
                Spend<span className="text-blue-400">Wise</span>
              </span>
              <span className="text-[10px] text-blue-300/60 -mt-0.5 font-medium">Finance Tracker</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-blue-200/70">
            <a href="#home" className="text-white hover:text-blue-300 transition">Home</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
            <a href="#insights" className="hover:text-white transition">Insights</a>
          </nav>

          {/* CTA */}
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 rounded-full text-[13px] font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-600/30 transition-all duration-300 cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section
        id="home"
        className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 px-6 sm:px-10 max-w-7xl mx-auto w-full"
      >
        {/* Background glow orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none translate-x-1/4 translate-y-1/4" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-4 items-center relative z-10">
          {/* ── Left Column ── */}
          <div className="space-y-7 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[13px] font-semibold text-blue-300">
              <Star className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>Smarter Money • Brighter Future</span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.8rem] sm:text-[3.5rem] lg:text-[4rem] font-black text-white tracking-tight leading-[1.08]">
              Make every rupee{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300">
                work smarter.
              </span>
            </h1>

            {/* Description */}
            <p className="text-[15px] sm:text-base text-blue-200/60 leading-relaxed max-w-md">
              Track your spending, plan your budgets, and grow your savings — all in one place. Simple, secure, and built for your financial freedom.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onGetStarted}
                className="px-7 py-3.5 rounded-full text-[13px] font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-xl shadow-blue-600/30 transition-all duration-300 flex items-center gap-2 cursor-pointer group active:scale-95"
              >
                <span>Build my budget</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <a
                href="#how-it-works"
                className="px-6 py-3.5 rounded-full text-[13px] font-semibold text-blue-100/80 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
                <span>See how it works</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-white/5 flex flex-wrap items-start gap-8">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-white block leading-tight">Privacy by design</span>
                  <span className="text-[11px] text-blue-200/40 font-medium">Your data, your control</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-white block leading-tight">Live insights</span>
                  <span className="text-[11px] text-blue-200/40 font-medium">See where it goes</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center shrink-0">
                  <Crosshair className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <span className="text-[13px] font-bold text-white block leading-tight">Simple goals</span>
                  <span className="text-[11px] text-blue-200/40 font-medium">Build the future you want</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column — Hero Image ── */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[580px]">
              <img
                src="/hero-scene.jpg"
                alt="SpendWise App — Plan, Save, Grow"
                className="w-full h-auto rounded-2xl object-cover"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                }}
              />
              {/* Subtle blue glow behind image */}
              <div className="absolute inset-0 -z-10 bg-blue-600/10 rounded-2xl blur-3xl scale-95" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-24 px-6 sm:px-10 bg-[#081222] border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em] block mb-3">Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Master Your Money
          </h2>
          <p className="text-sm text-blue-200/50 mt-3 max-w-xl mx-auto">
            Powerful financial tools designed for speed, security, and effortless expense management.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Receipt,    title: 'Track Expenses',       desc: 'Record and categorize all transactions with instant balance updates and clear status indicators.', color: 'blue' },
            { icon: Target,     title: 'Smart Budgeting',      desc: 'Set realistic monthly limits and receive proactive warnings before exceeding category allowances.', color: 'violet' },
            { icon: BarChart2,  title: 'Visual Reports',       desc: 'Understand cash flow with dynamic monthly charts, category proportions, and net savings trends.', color: 'cyan' },
            { icon: TrendingUp, title: 'Transaction History',  desc: 'Search, filter, and sort transactions seamlessly with one-click deletion and inline updates.', color: 'teal' },
            { icon: Tags,       title: 'Category Management', desc: 'Tailor income and expense categories to match your lifestyle with custom colors and icons.', color: 'rose' },
            { icon: Smartphone, title: 'Multi-Device Access',  desc: 'Designed with responsive aesthetics that look crisp on desktop, tablet, and mobile browsers.', color: 'amber' },
          ].map((f, i) => {
            const Icon = f.icon;
            const colorMap: Record<string, string> = {
              blue:   'bg-blue-500/10   text-blue-400   border-blue-500/20   hover:border-blue-500/40',
              violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:border-violet-500/40',
              cyan:   'bg-cyan-500/10   text-cyan-400   border-cyan-500/20   hover:border-cyan-500/40',
              teal:   'bg-teal-500/10   text-teal-400   border-teal-500/20   hover:border-teal-500/40',
              rose:   'bg-rose-500/10   text-rose-400   border-rose-500/20   hover:border-rose-500/40',
              amber:  'bg-amber-500/10  text-amber-400  border-amber-500/20  hover:border-amber-500/40',
            };
            const [iconBg, iconText, iconBorder, hoverBorder] = (colorMap[f.color] || colorMap.blue).split(/\s+/);
            return (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-[#0D1A30] border border-white/5 ${hoverBorder} hover:bg-[#101f3a] transition-all duration-300 text-left group`}
              >
                <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconText} ${iconBorder} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-blue-200/45 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 px-6 sm:px-10 bg-[#0A1628] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em] block mb-3">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-sm text-blue-200/50 mt-3">
              Start managing your money today without unnecessary friction or complicated setups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[2.75rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 z-0" />

            {[
              { step: '1', title: 'Add Transactions', desc: 'Log income or daily expenses with category tagging, dates, and amounts in a few clicks.', gradient: 'from-blue-500 to-blue-400' },
              { step: '2', title: 'Analyze & Track',  desc: 'Watch spending trends dynamically visualize in charts, breakdown tables, and budget trackers.', gradient: 'from-cyan-500 to-teal-400' },
              { step: '3', title: 'Reach Your Goals',  desc: 'Build lasting wealth and maintain financial peace of mind with continuous visibility.', gradient: 'from-violet-500 to-blue-400' },
            ].map((s, i) => (
              <div key={i} className="p-7 rounded-2xl bg-[#0D1A30] border border-white/5 space-y-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center font-black text-sm shadow-lg`}>
                  {s.step}
                </div>
                <h3 className="text-[15px] font-bold text-white">{s.title}</h3>
                <p className="text-[13px] text-blue-200/45 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Insights / Benefits Section ─── */}
      <section id="insights" className="px-6 sm:px-10 py-16 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-br from-blue-900/60 via-[#0D1A30] to-[#0A1628] border border-blue-500/15 p-8 sm:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="relative z-10 space-y-3 text-center md:text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-sm text-blue-200/50">
              Join SpendWise today and experience effortless personal wealth management — designed for India's smart savers.
            </p>
          </div>

          <button
            onClick={onGetStarted}
            className="relative z-10 px-8 py-4 rounded-full text-[13px] font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-blue-600/25 transition-all duration-300 flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Decorative glow */}
          <div className="absolute right-0 top-0 bottom-0 opacity-[0.06] pointer-events-none flex items-center pr-10">
            <Sprout className="w-72 h-72 text-blue-400" />
          </div>
        </div>
      </section>



      {/* ─── Footer ─── */}
      <footer className="mt-auto bg-[#060E1B] text-blue-200/40 py-10 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-[12px]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm">SpendWise</span>
              <span className="text-[10px] text-blue-300/30">Smart Financial Tracking.</span>
            </div>
          </div>

          {/* Support & Contact Us (Replaced Navigation Bar as requested) */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-blue-200/60 text-[12px]">
            <button
              onClick={() => setIsContactOpen(true)}
              className="hover:text-cyan-300 transition flex items-center gap-1.5 cursor-pointer group"
            >
              <Headphones className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Support Helpdesk</span>
            </button>
            <span className="text-white/10 hidden sm:inline">•</span>
            <button
              onClick={() => setIsContactOpen(true)}
              className="hover:text-cyan-300 transition flex items-center gap-1.5 cursor-pointer group"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Contact Us</span>
            </button>
            <span className="text-white/10 hidden sm:inline">•</span>
            <a
              href="mailto:support@spendwise.in"
              className="hover:text-cyan-300 transition flex items-center gap-1.5 group"
            >
              <Mail className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
              <span>support@spendwise.in</span>
            </a>
          </div>

          <div className="text-blue-300/25 text-[11px]">
            © {new Date().getFullYear()} SpendWise. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ─── Contact & Support Modal ─── */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="rounded-3xl border w-full max-w-lg shadow-2xl overflow-hidden bg-[#0D1A30] border-blue-500/20 text-white animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0A1628]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">SpendWise Support & Contact</h3>
                  <p className="text-[11px] text-blue-200/50">We are here to help you manage your finances seamlessly</p>
                </div>
              </div>
              <button
                onClick={() => setIsContactOpen(false)}
                className="p-1.5 rounded-xl text-blue-200/50 hover:text-white hover:bg-white/5 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Info Cards */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#081222] border border-white/5 flex items-start gap-3">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Email Support</span>
                    <a href="mailto:support@spendwise.in" className="text-blue-200 font-bold hover:underline text-[12px]">
                      support@spendwise.in
                    </a>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Response within 2-4 hrs</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#081222] border border-white/5 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Support Hours</span>
                    <span className="text-white font-bold text-[12px] block">Mon – Sat</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">9:00 AM – 7:00 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Contact Message Form */}
              {contactSent ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-base">Message Sent Successfully!</h4>
                  <p className="text-xs text-blue-200/60 max-w-xs mx-auto">
                    Thank you for reaching out. Our support team will reply to your email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Sahana Marigoudra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#081222] text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#081222] text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">How can we help? *</label>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your issue or feedback..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#081222] text-white focus:outline-none focus:border-blue-500 text-xs resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsContactOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
