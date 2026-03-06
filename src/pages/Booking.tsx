import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES, PACKAGES, EMERGENCY_CONTACT } from '../constants';
import { Doctor } from '../types';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, Loader2, AlertCircle, ArrowRight, Wallet, CreditCard, Camera, ArrowLeft, Mail } from 'lucide-react';
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
  const [walletType, setWalletType] = useState<'easypaisa' | 'jazzcash' | null>(null);
  const [bankType, setBankType] = useState<string>('');

  useEffect(() => {
    // Scroll to top whenever step changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, meRes] = await Promise.all([
          fetch('/api/doctors'),
          fetch('/api/me', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        
        const docsData = await docsRes.json();
        const meData = await meRes.json();
        
        setDoctors(docsData);
        setFormData(prev => ({ ...prev, confirmation_email: meData.email || '' }));
        setLoading(false);
      } catch (err) {
        console.error(err);
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

    const finalData = {
      ...formData,
      service: selectedServices.join(', '),
      payment_details: formData.payment_method === 'online' 
        ? (onlineMethod === 'wallet' 
          ? `${walletType}: ${formData.payment_details}` 
          : `${bankType}: ${formData.payment_details}`)
        : 'Onsite Payment'
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Email Sent Successfully!</h2>
          <p className="text-gray-600 mb-6">
            An email with your appointment and payment details has been sent to <span className="font-bold text-blue-600">{formData.confirmation_email}</span>.
          </p>
          <div className="bg-blue-50 p-4 rounded-2xl mb-8 border border-blue-100">
            <p className="text-sm text-blue-900 font-medium">
              ⚠️ Important: You must show this email at the clinic (onsite) during your visit.
            </p>
          </div>
          <p className="text-xs text-gray-400 mb-8 italic">Redirecting to dashboard...</p>
          <div className="animate-pulse flex justify-center">
            <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Book an Appointment</h1>
          <div className="flex justify-center items-center gap-4 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-8 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <p className="text-gray-600">
            {step === 1 && 'Step 1: Appointment Details'}
            {step === 2 && 'Step 2: Payment Method'}
            {step === 3 && 'Step 3: Email Confirmation'}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-blue-100"
        >
          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <CheckCircle size={18} className="text-blue-600" />
                      1. Select Service or Package
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[...SERVICES, ...PACKAGES].map((item) => (
                        <label
                          key={item.id}
                          className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedServices.includes(item.name)
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-100 hover:border-blue-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={selectedServices.includes(item.name)}
                            onChange={() => toggleService(item.name)}
                          />
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-blue-900 text-sm">{item.name}</span>
                            <span className="text-xs font-bold text-blue-600">{item.price}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {selectedServices.length > 0 && (
                      <div className="mt-6 p-4 bg-blue-900 text-white rounded-2xl flex justify-between items-center shadow-lg">
                        <span className="font-medium">Total Price:</span>
                        <span className="text-xl font-bold">PKR {totalPrice.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Doctor Selection */}
                  <div>
                    <label className="block text-sm font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <User size={18} className="text-blue-600" />
                      2. Select Your Dentist
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {doctors.map((doctor) => (
                        <label
                          key={doctor.id}
                          className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            formData.doctor_id === doctor.id.toString()
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-100 hover:border-blue-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="doctor"
                            className="sr-only"
                            required
                            onChange={() => setFormData({ ...formData, doctor_id: doctor.id.toString() })}
                          />
                          <div className="text-center">
                            <p className="font-bold text-blue-900 text-sm">{doctor.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{doctor.specialization}</p>
                            <p className="text-[10px] text-blue-600 font-bold mt-2">{doctor.timings}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <label className="block text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <CalendarIcon size={18} className="text-blue-600" />
                        3. Select Date
                      </label>
                      <input
                        type="date"
                        required
                        min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                        value={formData.appointment_date}
                        onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-blue-600" />
                        4. Select Time Slot
                      </label>
                      <select
                        required
                        value={formData.appointment_time}
                        onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
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
                      else alert('Please select services and a doctor');
                    }}
                    className="w-full bg-blue-600 text-white py-5 rounded-3xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
                  >
                    Continue to Payment
                    <ArrowRight size={24} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div>
                    <label className="block text-sm font-bold text-blue-900 mb-6 flex items-center gap-2">
                      <Wallet size={18} className="text-blue-600" />
                      5. Choose Payment Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${formData.payment_method === 'onsite' ? 'border-blue-600 bg-blue-50' : 'border-gray-100'}`}>
                        <input type="radio" name="pay" className="sr-only" onChange={() => setFormData({...formData, payment_method: 'onsite'})} checked={formData.payment_method === 'onsite'} />
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                            <User size={24} />
                          </div>
                          <span className="font-bold text-blue-900">Pay Onsite</span>
                          <p className="text-[10px] text-gray-500 text-center">Pay at the clinic reception on arrival</p>
                        </div>
                      </label>
                      <label className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${formData.payment_method === 'online' ? 'border-blue-600 bg-blue-50' : 'border-gray-100'}`}>
                        <input type="radio" name="pay" className="sr-only" onChange={() => setFormData({...formData, payment_method: 'online'})} checked={formData.payment_method === 'online'} />
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                            <Wallet size={24} />
                          </div>
                          <span className="font-bold text-blue-900">Pay Online</span>
                          <p className="text-[10px] text-gray-500 text-center">Pay via Easypaisa, JazzCash or Bank</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Email Notification Message */}
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                    <Mail className="text-blue-600 mt-1 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-bold text-blue-900 mb-1">Email Confirmation</p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        {formData.payment_method === 'onsite' 
                          ? "You will receive an email with your appointment details and total price. Please show this email at the clinic."
                          : "You will receive an email with online payment instructions and clinic account details. Please show this email at the clinic."
                        }
                      </p>
                    </div>
                  </div>

                  {formData.payment_method === 'online' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                      <div className="flex gap-4">
                        <button 
                          type="button"
                          onClick={() => setOnlineMethod('wallet')}
                          className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${onlineMethod === 'wallet' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                          Easypaisa / JazzCash
                        </button>
                        <button 
                          type="button"
                          onClick={() => setOnlineMethod('bank')}
                          className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${onlineMethod === 'bank' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                          Bank Transfer
                        </button>
                      </div>

                      {onlineMethod === 'wallet' && (
                        <div className="space-y-6">
                          <div className="flex gap-4">
                            <button type="button" onClick={() => setWalletType('easypaisa')} className={`flex-1 py-2 rounded-xl text-xs font-bold ${walletType === 'easypaisa' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Easypaisa</button>
                            <button type="button" onClick={() => setWalletType('jazzcash')} className={`flex-1 py-2 rounded-xl text-xs font-bold ${walletType === 'jazzcash' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>JazzCash</button>
                          </div>
                          <div className="p-4 bg-blue-900 text-white rounded-2xl text-center">
                            <p className="text-xs opacity-80 mb-1">Send Payment to:</p>
                            <p className="text-xl font-bold tracking-widest">{EMERGENCY_CONTACT}</p>
                            <p className="text-[10px] opacity-60 mt-1">Account Name: DentaCare AI Clinic</p>
                          </div>
                          <input 
                            type="text" 
                            placeholder="Your Account Number"
                            required
                            value={formData.payment_details}
                            onChange={(e) => setFormData({...formData, payment_details: e.target.value})}
                            className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      )}

                      {onlineMethod === 'bank' && (
                        <div className="space-y-6">
                          <select 
                            required
                            value={bankType}
                            onChange={(e) => setBankType(e.target.value)}
                            className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="">Select Bank</option>
                            <option value="Meezan Bank">Meezan Bank</option>
                            <option value="UBL Bank">UBL Bank</option>
                            <option value="Bank Alfalah">Bank Alfalah</option>
                            <option value="Islamic Bank">Islamic Bank</option>
                          </select>
                          <div className="p-4 bg-blue-900 text-white rounded-2xl text-center">
                            <p className="text-xs opacity-80 mb-1">Clinic Bank Details:</p>
                            <p className="text-lg font-bold">IBAN: PK00 MEZN 0000 1234 5678</p>
                            <p className="text-[10px] opacity-60 mt-1">Beneficiary: DentaCare AI Clinic</p>
                          </div>
                          <input 
                            type="text" 
                            placeholder="Your Bank Card / Account Number"
                            required
                            value={formData.payment_details}
                            onChange={(e) => setFormData({...formData, payment_details: e.target.value})}
                            className="w-full bg-white border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      )}

                      {(onlineMethod === 'wallet' || onlineMethod === 'bank') && (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Upload Payment Screenshot</label>
                          <label className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all overflow-hidden relative">
                            {formData.payment_screenshot ? (
                              <img src={formData.payment_screenshot} className="w-full h-full object-cover" />
                            ) : (
                              <>
                                <Camera className="text-gray-300 mb-2" size={32} />
                                <span className="text-xs text-gray-400">Click to upload screenshot</span>
                              </>
                            )}
                            <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                          </label>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-5 border-2 border-blue-50 text-blue-600 rounded-3xl font-bold hover:border-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} />
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={formData.payment_method === 'online' && (!onlineMethod || !formData.payment_details || !formData.payment_screenshot)}
                      onClick={() => setStep(3)}
                      className="flex-[2] bg-blue-600 text-white py-5 rounded-3xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      Continue to Confirmation
                      <ArrowRight size={24} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">Email Confirmation</h3>
                    <p className="text-gray-600">We will send your appointment details to your email address.</p>
                  </div>

                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-blue-900 mb-4">
                        Should we send the email to this address or another one?
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formData.confirmation_email}
                        onChange={(e) => setFormData({...formData, confirmation_email: e.target.value})}
                        className="w-full bg-white border-2 border-blue-100 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium text-blue-900"
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-3">
                      <AlertCircle className="text-yellow-600 shrink-0" size={18} />
                      <p className="text-[11px] text-yellow-800 leading-relaxed">
                        Please ensure this email is accessible on your phone. You will need to show the confirmation email at the clinic reception.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-5 border-2 border-blue-50 text-blue-600 rounded-3xl font-bold hover:border-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !formData.confirmation_email}
                      className="flex-[2] bg-blue-600 text-white py-5 rounded-3xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                          Confirm & Book
                          <ArrowRight size={24} />
                        </>
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
