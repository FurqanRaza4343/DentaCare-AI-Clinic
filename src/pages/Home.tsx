import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Clock, Award, CheckCircle, ArrowRight, Star, Users, Calendar, Phone } from 'lucide-react';
import { EMERGENCY_CONTACT } from '../constants';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <Shield size={16} />
                <span>Trusted by 10,000+ Patients</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-blue-900 leading-tight mb-6">
                Your Smile, Powered by <span className="text-blue-600">AI Innovation</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Experience the future of dentistry. DentaCare AI combines expert clinical skills with advanced technology to provide painless, precise, and personalized dental care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/book"
                  className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
                >
                  Book Appointment
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="px-8 py-4 bg-white text-blue-900 border-2 border-blue-100 rounded-full font-bold text-lg hover:border-blue-600 transition-all flex items-center justify-center"
                >
                  View Services
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-600 font-medium">4.9/5 Average Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200"
                  alt="Modern Dental Clinic"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-blue-50 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">15+</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Expert Doctors</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-blue-50 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">99%</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Success Rate</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Why Choose Us</h2>
            <h3 className="text-4xl font-bold text-blue-900 mb-6">World-Class Dental Care for Your Family</h3>
            <p className="text-gray-600">We combine clinical excellence with a patient-first approach to ensure you receive the best possible treatment in a comfortable environment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="text-blue-600" size={32} />,
                title: "Expert Specialists",
                desc: "Our team consists of highly qualified and experienced dental surgeons and specialists."
              },
              {
                icon: <Clock className="text-blue-600" size={32} />,
                title: "24/7 Emergency Support",
                desc: "Dental emergencies don't wait. We're available round the clock at " + EMERGENCY_CONTACT
              },
              {
                icon: <Shield className="text-blue-600" size={32} />,
                title: "Advanced AI Tech",
                desc: "We use AI-driven diagnostics and treatment planning for 100% precision and safety."
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-blue-50 border border-blue-100 transition-all"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold text-blue-900 mb-4">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Promo */}
      <section className="py-24 bg-blue-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800/20 skew-x-12 transform translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Have Questions? Ask Our AI Assistant</h2>
              <p className="text-blue-100 text-lg mb-8">
                Get instant answers to your dental health questions, learn about procedures, and get pre-consultation advice from our advanced AI chatbot.
              </p>
              <ul className="space-y-4 mb-10">
                {['Instant responses 24/7', 'Personalized dental advice', 'Procedure explanations', 'Booking assistance'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg"
              >
                Chat with AI Now
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold">DentaCare AI Assistant</h4>
                  <p className="text-xs text-blue-300">Online & Ready to Help</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none text-sm">
                  Hello! How can I help you with your smile today?
                </div>
                <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-sm ml-12">
                  What is the cost of teeth whitening?
                </div>
                <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none text-sm">
                  Our professional teeth whitening starts from PKR 6,000. Would you like to see our special packages?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-[3rem] p-12 lg:p-20 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
              <div className="absolute bottom-10 right-10 w-64 h-64 border-8 border-white rounded-full" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 relative z-10">Ready for a Brighter Smile?</h2>
            <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto relative z-10">
              Join thousands of happy patients and experience the best dental care in the city. Book your appointment online today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link
                to="/book"
                className="px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
              >
                Book Appointment
              </Link>
              <a
                href={`tel:${EMERGENCY_CONTACT}`}
                className="px-10 py-5 bg-blue-700 text-white border border-blue-400 rounded-full font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
              >
                <Phone size={20} />
                Call Us: {EMERGENCY_CONTACT}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
