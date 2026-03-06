import React from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <div className="pt-32 pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6">Our Dental Services</h1>
          <p className="text-gray-600 text-lg">
            We offer a comprehensive range of dental treatments using state-of-the-art technology to ensure the best outcomes for our patients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">{service.name}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Starting From</p>
                  <p className="text-xl font-bold text-blue-600">{service.price}</p>
                </div>
                <Link
                  to="/book"
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all"
                >
                  <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Care Section */}
        <div className="mt-24 bg-blue-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Don't see what you're looking for?</h2>
              <p className="text-blue-100 text-lg mb-8">
                We provide customized dental solutions for every patient. Contact us for a personalized consultation and treatment plan.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/book" className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-all">
                  Book Consultation
                </Link>
                <Link to="/doctors" className="px-8 py-4 bg-blue-800 text-white border border-blue-700 rounded-full font-bold hover:bg-blue-700 transition-all">
                  Meet Our Doctors
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://picsum.photos/seed/dental-care/600/400" 
                alt="Dental Care" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
