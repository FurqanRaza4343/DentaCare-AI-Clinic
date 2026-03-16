import React from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import { CheckCircle, ArrowRight, Sparkles, ShieldCheck, Stethoscope, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <div className="pt-40 pb-32 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-primary-100 text-primary-700 text-sm font-bold mb-6 shadow-sm"
          >
            <Stethoscope size={16} />
            <span>Clinical Excellence</span>
          </motion.div>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-8">Our Dental Masterpieces</h1>
          <p className="text-slate-600 text-xl leading-relaxed">
            We merge anatomical precision with aesthetic artistry. Discover a suite of dental services engineered for the modern patient.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass-card rounded-[3rem] p-10 hover:bg-white hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600 mb-8 group-hover:bg-primary-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                <ShieldCheck size={36} />
              </div>

              <h3 className="text-3xl font-display font-bold text-slate-900 mb-5">{service.name}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg min-h-[100px]">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-[0.1em] mb-1">Standard Investment</p>
                  <p className="text-2xl font-display font-bold text-primary-600">{service.price}</p>
                </div>
                <Link
                  to="/book"
                  className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:premium-gradient group-hover:text-white group-hover:rotate-12 group-hover:shadow-lg transition-all duration-500"
                >
                  <ArrowRight size={24} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Care Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 premium-gradient rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/3" />

          <div className="grid lg:grid-cols-12 gap-16 items-center relative z-10">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <span className="font-bold uppercase tracking-widest text-sm text-primary-50">Customized Solutions</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold mb-8 leading-[1.1]">Need a Bespoke <br />Treatment Plan?</h2>
              <p className="text-primary-50 text-xl mb-12 opacity-90 max-w-xl leading-relaxed">
                Every smile is a unique signature. Our specialists work with you to design a personalized path to perfect oral health.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link to="/book" className="px-10 py-5 bg-white text-primary-600 rounded-[2rem] font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                  Instant Consultation
                </Link>
                <Link to="/doctors" className="px-10 py-5 bg-primary-700/30 text-white border border-white/20 backdrop-blur-md rounded-[2rem] font-bold text-lg hover:bg-primary-700/50 transition-all">
                  Meet the Masters
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <div className="p-4 glass-card bg-white/10 rounded-[3rem] border-white/10 rotate-3 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"
                  alt="Elite Dental Care"
                  className="rounded-[2.5rem] shadow-lg grayscale focus-within:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
