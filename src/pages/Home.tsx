import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Clock, Award, CheckCircle, ArrowRight, Star, Users, Calendar, Phone, Sparkles, Activity, HeartPulse } from 'lucide-react';
import { EMERGENCY_CONTACT } from '../constants';

export default function Home() {
  return (
    <div className="overflow-hidden bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-40">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-primary-100 text-primary-700 text-sm font-bold mb-8 shadow-sm">
                <Sparkles size={16} className="text-primary-500" />
                <span>Next-Gen Dental Care in Pakistan</span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-display font-bold text-slate-900 leading-[1.1] mb-8">
                Your Smile, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Perfectly Reimagined</span>
              </h1>

              <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                Experience the fusion of elite dental expertise and advanced AI diagnostics. We don't just treat teeth; we curate confidence with every procedure.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to="/book"
                  className="premium-button premium-gradient text-white flex items-center justify-center gap-3 text-lg group"
                >
                  Schedule Your Visit
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="premium-button bg-white text-slate-900 border border-slate-200 flex items-center justify-center text-lg hover:bg-slate-50"
                >
                  Explore Services
                </Link>
              </div>

              <div className="mt-14 flex items-center gap-8 border-t border-slate-200 pt-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white overflow-hidden shadow-sm">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                        alt="Patient"
                        className="w-full h-full object-cover bg-slate-100"
                      />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-2xl border-4 border-white bg-primary-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    10k+
                  </div>
                </div>
                <div>
                  <div className="flex text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-600 font-semibold">Join 10,000+ happy smiles</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10 p-4 glass-card rounded-[2.5rem] shadow-2xl">
                <div className="rounded-[2rem] overflow-hidden aspect-[4/5] relative">
                  <img
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200"
                    alt="Elite Dental Experience"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-12 glass-card p-6 rounded-3xl z-20 shadow-2xl border-white/40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
                    <Activity size={28} />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-bold text-slate-900">99.8%</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Precision Rate</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-12 -right-8 glass-card p-5 rounded-2xl z-20 shadow-xl border-white/40"
              >
                <div className="flex items-center gap-3">
                  <HeartPulse className="text-red-500" size={24} />
                  <span className="font-bold text-slate-800">Pain-Free Tech</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-primary-600 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Excellence in Care</span>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Specialized Services for <br /> Every Dental Need
              </h2>
            </div>
            <Link to="/services" className="text-primary-600 font-bold flex items-center gap-2 group hover:text-primary-700 transition-colors">
              View All Services <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Award className="text-primary-600" size={32} />,
                title: "Orthodontics",
                desc: "Modern braces and clear aligners to give you the perfect alignment you've always wanted."
              },
              {
                icon: <Activity className="text-primary-600" size={32} />,
                title: "Oral Surgery",
                desc: "Gentle and precise surgical procedures using advanced AI-mapped diagnostics."
              },
              {
                icon: <Shield className="text-primary-600" size={32} />,
                title: "Preventive Care",
                desc: "Long-term health strategies to keep your teeth strong and your smile naturally bright."
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -12 }}
                className="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                  {service.icon}
                </div>
                <h4 className="text-2xl font-display font-bold text-slate-900 mb-4">{service.title}</h4>
                <p className="text-slate-600 leading-relaxed text-lg mb-6">{service.desc}</p>
                <div className="w-12 h-1 bg-primary-200 group-hover:w-24 group-hover:bg-primary-500 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Bot Integration / Trust Section */}
      <section className="py-32 overflow-hidden bg-slate-900 relative">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500 via-transparent to-transparent -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-8 leading-tight">
                Intelligent Care with our <br />
                <span className="text-primary-400">AI Health Partner</span>
              </h2>
              <p className="text-slate-300 text-xl mb-12 leading-relaxed">
                Connect with our AI assistant 24/7. Get instant clinical insights, cost estimates, and procedure walkthroughs before you even step into the clinic.
              </p>

              <div className="space-y-6 mb-12">
                {['Instant AI Diagnostics Support', 'Transparent Fee Estimations', 'Personalized Pre-procedure Advice'].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 border border-primary-500/30">
                      <CheckCircle size={18} />
                    </div>
                    <span className="text-slate-200 text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                className="premium-button bg-primary-600 text-white hover:bg-primary-500 shadow-xl shadow-primary-900/40 px-10"
              >
                Chat with AI Assistant
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-1 glass-card bg-white/5 rounded-[3rem] border-white/10"
            >
              <div className="bg-slate-800/50 backdrop-blur-3xl rounded-[2.8rem] p-10 font-sans">
                <div className="flex items-center gap-5 mb-10 pb-8 border-b border-white/5">
                  <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center shadow-lg shadow-primary-700/50">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-display font-bold text-white leading-none">DentaCare AI</h4>
                    <p className="text-primary-400 text-sm mt-2 font-bold uppercase tracking-wider">Systems Active</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1 bg-white/5 p-6 rounded-3xl rounded-tl-none border border-white/5 text-slate-200 text-lg font-medium">
                      Hello! I'm your AI health advisor. How can I assist you with your smile today?
                    </div>
                  </div>
                  <div className="flex gap-4 justify-end">
                    <div className="flex-1 bg-primary-600 p-6 rounded-3xl rounded-tr-none text-white text-lg font-medium max-w-[80%]">
                      Is the dental implant treatment painful?
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-white/10 p-6 rounded-3xl rounded-tl-none border border-white/10 text-slate-100 text-lg font-medium">
                      Not at all! With our AI-guided surgical mapping and sedation density control, 98% of patients report zero discomfort.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[3.5rem] premium-gradient p-12 lg:p-24 text-center">
            {/* Shapes */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary-900/20 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl lg:text-7xl font-display font-bold text-white mb-8 leading-tight">
                Ready for the Best Smile <br /> of Your Life?
              </h2>
              <p className="text-primary-50 text-xl lg:text-2xl mb-14 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Join our premium patient circle and experience dental care that's as unique as you are.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/book"
                  className="px-12 py-5 bg-white text-primary-600 rounded-[2rem] font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  Book Your Arrival
                </Link>
                <a
                  href={`tel:${EMERGENCY_CONTACT}`}
                  className="px-10 py-5 bg-primary-700/30 text-white border border-white/20 backdrop-blur-md rounded-[2rem] font-bold text-xl hover:bg-primary-700/50 transition-all duration-300 flex items-center gap-4 w-full sm:w-auto justify-center"
                >
                  <Phone size={24} />
                  Emergency: {EMERGENCY_CONTACT}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
