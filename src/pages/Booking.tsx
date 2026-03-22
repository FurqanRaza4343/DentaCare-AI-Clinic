import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES, PACKAGES, EMERGENCY_CONTACT } from '../constants';
import { Doctor } from '../types';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, Loader2, AlertCircle, ArrowRight, Wallet, CreditCard, Camera, ArrowLeft, Mail, Sparkles, ShieldCheck, Trash2 } from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function Booking() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    doctor_id: '',
    service: '',
    appointment_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    appointment_time: '10:00 AM',
    payment_method: 'onsite',
    payment_details: '',
    payment_screenshot: '',
    confirmation_email: '',
  });

  const [onlineMethod, setOnlineMethod] = useState<'wallet' | 'bank' | null>(null);
  const [walletType, setWalletType] = useState<string>('');
  const [bankType, setBankType] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Use the same doctors list as the Doctors page
        const mockDoctors: Doctor[] = [
          {
            id: 1,
            name: "Dr Ahmed Khan",
            specialization: "Orthodontist",
            timings: "10AM - 3PM",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800"
          },
          {
            id: 2,
            name: "Dr Sarah Malik",
            specialization: "Dental Surgeon",
            timings: "3PM - 8PM",
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800"
          },
          {
            id: 3,
            name: "Dr Ali Raza",
            specialization: "Implant Specialist",
            timings: "6PM - 10PM",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
          }
        ];

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        setDoctors(mockDoctors);
        setFormData(prev => ({ ...prev, confirmation_email: storedUser.email || '' }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const totalPrice = [...SERVICES, ...PACKAGES]
    .filter(item => selectedServices.includes(item.name))
    .reduce((sum, item) => sum + parsePrice(item.price), 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, payment_screenshot: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const selectedDoctor = doctors.find(d => d.id.toString() === formData.doctor_id);

      const newAppointment = {
        id: Date.now(),
        user_id: storedUser.id,
        doctor_id: parseInt(formData.doctor_id),
        doctor_name: selectedDoctor?.name || 'Unknown',
        service: selectedServices.join(', '),
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        payment_details: formData.payment_method === 'online'
          ? (onlineMethod === 'wallet'
            ? `${walletType}: ${formData.payment_details}`
            : `${bankType}: ${formData.payment_details}`)
          : 'Onsite Payment'
      };

      const appointments = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
      appointments.push(newAppointment);
      localStorage.setItem('mock_appointments', JSON.stringify(appointments));

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-40 pb-32 bg-slate-50/50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full glass-card rounded-[4rem] p-16 text-center shadow-2xl border-white"
        >
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
            <CheckCircle size={56} />
          </div>
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Reservation Secured!</h2>
          <p className="text-slate-600 text-lg mb-10">
            A confirmation vault email has been dispatched to <span className="font-bold text-primary-600 underline">{formData.confirmation_email}</span> with your arrival details.
          </p>
          <div className="bg-primary-50 p-6 rounded-3xl mb-10 border border-primary-100 flex items-center gap-4 text-left">
            <ShieldCheck className="text-primary-600 shrink-0" size={24} />
            <p className="text-sm text-primary-900 font-bold leading-relaxed">
              Important: Present this digital token at the reception upon arrival.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Redirecting to Patient Portal</p>
            <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 4 }}
                className="w-full h-full bg-primary-600"
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 bg-slate-50/50 min-h-screen overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-primary-100 text-primary-700 text-sm font-bold mb-6 shadow-sm"
          >
            <Sparkles size={16} />
            <span>Premium Booking Experience</span>
          </motion.div>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-8">Schedule Your Arrival</h1>

          <div className="flex justify-center items-center gap-6 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-sm ${step >= s ? 'premium-gradient text-white scale-110' : 'bg-white text-slate-400 border border-slate-100'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-primary-500' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
            {step === 1 && 'Configuration Phase'}
            {step === 2 && 'Security & Billing'}
            {step === 3 && 'Final Verification'}
          </p>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[3.5rem] shadow-2xl overflow-hidden border-white"
        >
          <form onSubmit={handleSubmit} className="p-10 lg:p-16">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="space-y-12"
                >
                  {/* Service Selection */}
                  <div className="space-y-8">
                    <label className="text-2xl font-display font-bold text-slate-900 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <CheckCircle size={24} />
                      </div>
                      1. Select Curated Services
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[...SERVICES, ...PACKAGES].map((item) => (
                        <label
                          key={item.id}
                          className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 group ${selectedServices.includes(item.name)
                            ? 'border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-500/10'
                            : 'border-slate-100 bg-slate-50/30 hover:bg-white hover:border-slate-200'
                            }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={selectedServices.includes(item.name)}
                            onChange={() => toggleService(item.name)}
                          />
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-900 text-lg mb-1">{item.name}</p>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Premium Care</p>
                            </div>
                            <span className="text-lg font-display font-bold text-primary-600">{item.price}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {selectedServices.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 premium-gradient text-white rounded-[2.5rem] flex justify-between items-center shadow-xl shadow-primary-500/20"
                      >
                        <div>
                          <p className="text-primary-50 text-xs font-bold uppercase tracking-widest mb-1">Estimated Investment</p>
                          <p className="text-3xl font-display font-bold">PKR {totalPrice.toLocaleString()}</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                          <Wallet size={28} />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <label className="text-2xl font-display font-bold text-slate-900 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <User size={24} />
                      </div>
                      2. Choose Your Resident Expert
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {doctors.map((doctor) => (
                        <label
                          key={doctor.id}
                          className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${formData.doctor_id === doctor.id.toString()
                            ? 'border-primary-500 bg-primary-50 shadow-lg'
                            : 'border-slate-100 bg-slate-50/30 hover:bg-white hover:border-slate-200'
                            }`}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            name="doctor"
                            checked={formData.doctor_id === doctor.id.toString()}
                            onChange={() => setFormData({ ...formData, doctor_id: doctor.id.toString() })}
                          />
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto mb-4 overflow-hidden shadow-inner">
                              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="font-bold text-slate-900 text-lg">{doctor.name}</p>
                            <p className="text-[10px] text-primary-600 font-bold uppercase tracking-[0.2em] mt-2">{doctor.specialization}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-5">
                      <label className="font-display font-bold text-slate-900 flex items-center gap-3">
                        <CalendarIcon size={20} className="text-primary-500" />
                        3. Strategic Date
                      </label>
                      <input
                        type="date"
                        required
                        min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                        value={formData.appointment_date}
                        onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                        className="w-full bg-slate-50 border-slate-100 rounded-[1.5rem] py-5 px-8 text-slate-900 font-bold focus:ring-4 focus:ring-primary-500/10 outline-none border transition-all"
                      />
                    </div>
                    <div className="space-y-5">
                      <label className="font-display font-bold text-slate-900 flex items-center gap-3">
                        <Clock size={20} className="text-primary-500" />
                        4. Preferred Slot
                      </label>
                      <select
                        required
                        value={formData.appointment_time}
                        onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                        className="w-full bg-slate-50 border-slate-100 rounded-[1.5rem] py-5 px-8 text-slate-900 font-bold focus:ring-4 focus:ring-primary-500/10 outline-none border appearance-none transition-all"
                      >
                        {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'].map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedServices.length > 0 && formData.doctor_id) setStep(2);
                      else alert('Please prioritize your services and select a doctor.');
                    }}
                    className="premium-button premium-gradient text-white w-full py-5 text-xl mt-10 shadow-2xl shadow-primary-500/30 group"
                  >
                    Proceed to Billing Flow
                    <ArrowRight size={24} className="inline ml-3 group-hover:translate-x-2 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-12"
                >
                  <div className="space-y-8">
                    <label className="text-2xl font-display font-bold text-slate-900 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                        <CreditCard size={24} />
                      </div>
                      Billing Preference
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[
                        { id: 'onsite', label: 'Onsite Arrival', sub: 'Pay at Reception', icon: ShieldCheck },
                        { id: 'online', label: 'Digital Transfer', sub: 'Instant Verification', icon: Wallet }
                      ].map((method) => (
                        <label
                          key={method.id}
                          className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 ${formData.payment_method === method.id
                            ? 'border-primary-500 bg-primary-50/50 shadow-lg'
                            : 'border-slate-100 bg-slate-50/30 hover:bg-white hover:border-slate-200'
                            }`}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            name="payment_method"
                            value={method.id}
                            checked={formData.payment_method === method.id}
                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                          />
                          <method.icon className={`mb-4 ${formData.payment_method === method.id ? 'text-primary-600' : 'text-slate-400'}`} size={32} />
                          <p className="font-bold text-slate-900 text-xl mb-1">{method.label}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{method.sub}</p>
                        </label>
                      ))}
                    </div>

                    <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-start gap-6 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary-400 shrink-0 backdrop-blur-md">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="text-xl font-display font-bold mb-2">Digital Token Transmission</p>
                        <p className="text-slate-400 font-medium leading-relaxed">
                          {formData.payment_method === 'onsite'
                            ? "We'll dispatch a secure confirmation token. Present the digital email receipt at our executive reception."
                            : "Instructions for your digital wire transfer will be dispatched instantly. Your priority status will be activated upon data receipt."
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {formData.payment_method === 'online' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8 p-10 glass-card bg-slate-50/50 rounded-[3rem] border-slate-200"
                    >
                      <div className="flex gap-5">
                        <button
                          type="button"
                          onClick={() => setOnlineMethod('wallet')}
                          className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all shadow-sm ${onlineMethod === 'wallet' ? 'premium-gradient text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                        >
                          Wallet Transfer
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineMethod('bank')}
                          className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all shadow-sm ${onlineMethod === 'bank' ? 'premium-gradient text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                        >
                          Direct Bank IBAN
                        </button>
                      </div>

                      {onlineMethod === 'wallet' && (
                        <div className="space-y-8">
                          <div className="flex gap-4">
                            <button type="button" onClick={() => setWalletType('easypaisa')} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${walletType === 'easypaisa' ? 'bg-[#00ba5a] text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}>Easypaisa</button>
                            <button type="button" onClick={() => setWalletType('jazzcash')} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${walletType === 'jazzcash' ? 'bg-[#ff0000] text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}>JazzCash</button>
                          </div>
                          <div className="p-8 premium-gradient text-white rounded-[2rem] text-center shadow-xl">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 opacity-90">Corporate Wallet Account</p>
                            <p className="text-3xl font-display font-bold tracking-widest leading-none mb-3">{EMERGENCY_CONTACT}</p>
                            <p className="text-sm font-bold opacity-80">Reference: DentaCare Elite Portfolio</p>
                          </div>
                          <input
                            type="text"
                            placeholder="Transaction Source ID / Wallet Number"
                            required
                            value={formData.payment_details}
                            onChange={(e) => setFormData({ ...formData, payment_details: e.target.value })}
                            className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] py-5 px-8 text-slate-900 font-bold focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                          />
                        </div>
                      )}

                      {onlineMethod === 'bank' && (
                        <div className="space-y-8">
                          <select
                            required
                            value={bankType}
                            onChange={(e) => setBankType(e.target.value)}
                            className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] py-5 px-8 text-slate-900 font-bold focus:ring-4 focus:ring-primary-500/10 outline-none transition-all appearance-none"
                          >
                            <option value="">Select Financial Institution</option>
                            <option value="Meezan Bank">Meezan Bank (Islamic)</option>
                            <option value="UBL Global">UBL Global</option>
                            <option value="Bank Alfalah">Bank Alfalah Prestige</option>
                            <option value="Standard Chartered">Standard Chartered</option>
                          </select>
                          <div className="p-8 bg-slate-900 text-white rounded-[2rem] text-center shadow-2xl">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-70">Secured IBAN Protocol</p>
                            <p className="text-xl font-display font-bold mb-2">PK00 MEZN 0000 1234 5678</p>
                            <p className="text-xs font-bold text-primary-400">BENEFICIARY: DENTACARE AI CLINICAL INFRA</p>
                          </div>
                          <input
                            type="text"
                            placeholder="Account Proof Number / IBAN"
                            required
                            value={formData.payment_details}
                            onChange={(e) => setFormData({ ...formData, payment_details: e.target.value })}
                            className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] py-5 px-8 text-slate-900 font-bold focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                          />
                        </div>
                      )}

                      {(onlineMethod === 'wallet' || onlineMethod === 'bank') && (
                        <div className="space-y-5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Digitized Payment Proof</label>
                          <div className="relative group w-full h-64 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-900/5 flex flex-col items-center justify-center transition-all overflow-hidden shadow-inner">
                            {formData.payment_screenshot ? (
                              <>
                                <img
                                  src={formData.payment_screenshot}
                                  className="w-full h-full object-contain bg-slate-900/10"
                                  alt="Payment Proof"
                                />
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, payment_screenshot: '' })}
                                  className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </>
                            ) : (
                              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all group-hover:border-primary-400">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className="flex flex-col items-center"
                                >
                                  <Camera className="text-primary-300 mb-3" size={48} />
                                  <span className="text-sm text-slate-500 font-bold">Deploy Screenshot</span>
                                </motion.div>
                                <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                              </label>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="flex gap-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-5 bg-white border border-slate-100 text-slate-400 rounded-[1.5rem] font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                      <ArrowLeft size={20} />
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={formData.payment_method === 'online' && (!onlineMethod || !formData.payment_details || !formData.payment_screenshot)}
                      onClick={() => setStep(3)}
                      className="flex-[2] premium-button premium-gradient text-white py-5 text-lg shadow-xl shadow-primary-500/20 disabled:opacity-40"
                    >
                      Verify Data & Confirm
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="space-y-12"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                      <Mail size={40} />
                    </div>
                    <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">Transmission Point</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Your digital arrival token will be securely dispatched to the following coordinate.</p>
                  </div>

                  <div className="glass-card bg-slate-50/50 p-10 rounded-[3rem] border-slate-100 space-y-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 pl-2">
                        Destination Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={formData.confirmation_email}
                          onChange={(e) => setFormData({ ...formData, confirmation_email: e.target.value })}
                          className="w-full bg-white border-2 border-primary-100 rounded-[1.5rem] py-5 px-8 text-lg focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-slate-900 transition-all"
                          placeholder="yourname@elite.com"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-500">
                          <CheckCircle size={24} />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                      <AlertCircle className="text-amber-600 shrink-0" size={24} />
                      <p className="text-sm text-amber-900 font-bold leading-relaxed">
                        Protocol: Ensure this device remains synchronized. You will need to present the digital credentials for biometric verification at arrival.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-5 bg-white border border-slate-100 text-slate-400 rounded-[1.5rem] font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                      <ArrowLeft size={20} />
                      Revision
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !formData.confirmation_email}
                      className="flex-[2] premium-button premium-gradient text-white py-5 text-xl shadow-2xl shadow-primary-500/30 group"
                    >
                      {submitting ? <Loader2 className="animate-spin mx-auto" size={28} /> : (
                        <div className="flex items-center justify-center gap-4">
                          Finalize & Secure Visit
                          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
