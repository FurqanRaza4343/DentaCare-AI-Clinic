import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Doctor } from '../types';
import { Clock, Award, Star, Calendar, ArrowRight } from 'lucide-react';
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
    <div className="pt-32 pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6">Meet Our Expert Doctors</h1>
          <p className="text-gray-600 text-lg">
            Our team of highly qualified dental specialists is dedicated to providing you with the highest standard of care in a friendly and professional environment.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {doctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 group"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={doctor.image || `https://picsum.photos/seed/doctor${doctor.id}/600/800`}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <Link to="/book" className="w-full py-3 bg-white text-blue-900 rounded-full font-bold text-center flex items-center justify-center gap-2">
                      Book Appointment
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900">{doctor.name}</h3>
                      <p className="text-blue-600 font-semibold text-sm">{doctor.specialization}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold">4.9</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <Clock size={18} className="text-blue-600" />
                      <span>Available: <span className="font-bold text-blue-900">{doctor.timings}</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <Award size={18} className="text-blue-600" />
                      <span>10+ Years Experience</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                      <Calendar size={18} className="text-blue-600" />
                      <span>Mon - Sat</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Team Stats */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Happy Patients", value: "10k+" },
            { label: "Successful Implants", value: "2,500+" },
            { label: "Years of Excellence", value: "15+" },
            { label: "Awards Won", value: "24" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-8 rounded-3xl bg-blue-50 border border-blue-100">
              <p className="text-4xl font-bold text-blue-900 mb-2">{stat.value}</p>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
