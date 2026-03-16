import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Doctor } from '../types';
import { Clock, Award, Star, Calendar, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-40 pb-32 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-primary-100 text-primary-700 text-sm font-bold mb-6 shadow-sm"
          >
            <UserCheck size={16} />
            <span>Top 1% Global Specialists</span>
          </motion.div>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-8">Meet the Visionaries</h1>
          <p className="text-slate-600 text-xl leading-relaxed">
            Our team brings together the brightest minds in dentistry, combining decades of experience with a passion for innovation.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {doctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass-card rounded-[3.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 border-slate-100"
              >
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                    <Link to="/book" className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-center flex items-center justify-center gap-3 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary-50">
                      Reserve Appointment
                      <ArrowRight size={20} />
                    </Link>
                  </div>

                  <div className="absolute top-6 right-6">
                    <div className="glass-card bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-2xl flex items-center gap-2 text-white">
                      <Star size={16} className="text-amber-400" fill="currentColor" />
                      <span className="font-bold">4.9</span>
                    </div>
                  </div>
                </div>

                <div className="p-10">
                  <div className="mb-8">
                    <p className="text-primary-600 font-bold text-sm uppercase tracking-[0.2em] mb-2">{doctor.specialization}</p>
                    <h3 className="text-3xl font-display font-bold text-slate-900">{doctor.name}</h3>
                  </div>

                  <div className="space-y-5 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-slate-600 group/item">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-primary-50 group-hover/item:text-primary-600 transition-colors">
                        <Clock size={20} />
                      </div>
                      <span className="font-medium">Hours: <span className="text-slate-900 font-bold">{doctor.timings}</span></span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 group/item">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-primary-50 group-hover/item:text-primary-600 transition-colors">
                        <Award size={20} />
                      </div>
                      <span className="font-medium">Senior Board Certified</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 group/item">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-primary-50 group-hover/item:text-primary-600 transition-colors">
                        <Sparkles size={20} />
                      </div>
                      <span className="font-medium">AI Diagnostic Specialist</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Dynamic Stats Row */}
        <div className="mt-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { label: "Patient Hearts Won", value: "10k+", color: "bg-blue-50 text-blue-600" },
            { label: "Successful Procedures", value: "25k+", color: "bg-primary-50 text-primary-600" },
            { label: "Digital Innovations", value: "18", color: "bg-indigo-50 text-indigo-600" },
            { label: "Clinical Awards", value: "24", color: "bg-emerald-50 text-emerald-600" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-10 rounded-[2.5rem] border-slate-100 text-center"
            >
              <p className={`text-5xl font-display font-bold mb-3 ${stat.color.split(' ')[1]}`}>{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
