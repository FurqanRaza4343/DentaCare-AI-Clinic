import React from 'react';
import { motion } from 'motion/react';
import { PACKAGES } from '../constants';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const getIcon = (id: string) => {
    switch (id) {
      case 'basic': return <Star className="text-blue-600" size={24} />;
      case 'smile': return <Zap className="text-blue-600" size={24} />;
      case 'premium': return <Crown className="text-blue-600" size={24} />;
      default: return <Star className="text-blue-600" size={24} />;
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6">Affordable Dental Packages</h1>
          <p className="text-gray-600 text-lg">
            Choose from our carefully curated dental care packages designed to provide maximum value and comprehensive care for your smile.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-[2.5rem] border-2 transition-all flex flex-col ${
                pkg.id === 'smile' 
                  ? 'bg-blue-50 border-blue-600 shadow-xl scale-105 z-10' 
                  : 'bg-white border-gray-100 shadow-sm hover:shadow-lg'
              }`}
            >
              {pkg.id === 'smile' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {getIcon(pkg.id)}
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-900">{pkg.price}</span>
                  {pkg.discount && (
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      Save {pkg.discount}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {pkg.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-600">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                      <Check size={12} />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/book"
                className={`w-full py-4 rounded-2xl font-bold text-center transition-all ${
                  pkg.id === 'smile'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                    : 'bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-600'
                }`}
              >
                Choose Package
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Are there any hidden charges?", a: "No, our package prices are all-inclusive of the services mentioned. Any additional treatments will be discussed beforehand." },
              { q: "Can I customize a package?", a: "Yes, we can create a custom treatment plan based on your specific needs during your initial consultation." },
              { q: "Do you offer installment plans?", a: "For major treatments like implants and orthodontics, we offer flexible monthly payment options." }
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="font-bold text-blue-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
