import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Appointment, User } from '../types';
import { Calendar, Clock, User as UserIcon, Phone, Mail, ChevronRight, CheckCircle, Clock3, AlertCircle, Trash2, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const user: User = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchAppointments = () => {
    setLoading(true);
    fetch('/api/appointments', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setAppointments(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: number) => {
    console.log('Cancelling appointment:', id);
    if (!window.confirm('Do you really want to delete this appointment?')) return;

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await res.json();
      console.log('Delete response:', data);

      if (res.ok) {
        fetchAppointments();
      } else {
        alert(data.error || 'Failed to cancel appointment');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error cancelling appointment');
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = appointments.filter(a => {
    const aptDate = new Date(a.appointment_date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate >= today;
  });
  
  const history = appointments.filter(a => {
    const aptDate = new Date(a.appointment_date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate < today;
  });

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Patient Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.name}</p>
          </div>
          <Link
            to="/book"
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Calendar size={18} />
            Book New Appointment
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <UserIcon size={48} />
                </div>
                <h3 className="text-xl font-bold text-blue-900">{user.name}</h3>
                <p className="text-sm text-gray-500">Member since {format(new Date(), 'MMMM yyyy')}</p>
              </div>
              
              <div className="space-y-6 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-blue-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium text-blue-900">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <button className="w-full py-3 border-2 border-blue-50 text-blue-600 rounded-2xl font-bold hover:border-blue-600 transition-all">
                  Edit Profile
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.href = '/';
                    }
                  }}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            {/* AI Health Tip */}
            <div className="bg-blue-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle size={20} className="text-blue-300" />
                </div>
                <h4 className="font-bold mb-2">AI Health Tip</h4>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Based on your history, remember to brush twice a day and floss regularly. Your next cleaning is due in 3 months!
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
            </div>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <Clock3 size={20} className="text-blue-600" />
                  Upcoming Appointments
                </h3>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                  {upcoming.length} Scheduled
                </span>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : upcoming.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Calendar size={32} />
                  </div>
                  <p className="text-gray-500 mb-6">No upcoming appointments found.</p>
                  <Link to="/book" className="text-blue-600 font-bold hover:underline">Book one now</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((apt) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 rounded-3xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900">{apt.service}</h4>
                          <p className="text-sm text-gray-500">with {apt.doctor_name}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end">
                        <p className="font-bold text-blue-900">{format(new Date(apt.appointment_date), 'EEE, MMM do')}</p>
                        <p className="text-sm text-blue-600 font-medium">{apt.appointment_time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCancel(apt.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Cancel Appointment"
                        >
                          <Trash2 size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* History */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-900 mb-8 flex items-center gap-2">
                <AlertCircle size={20} className="text-gray-400" />
                Appointment History
              </h3>

              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : history.length === 0 ? (
                <p className="text-center py-12 text-gray-400 text-sm">No past appointments.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase font-bold tracking-wider border-b border-gray-50">
                        <th className="pb-4">Service</th>
                        <th className="pb-4">Doctor</th>
                        <th className="pb-4">Date</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {history.map((apt) => (
                        <tr key={apt.id} className="text-sm">
                          <td className="py-4 font-medium text-blue-900">{apt.service}</td>
                          <td className="py-4 text-gray-600">{apt.doctor_name}</td>
                          <td className="py-4 text-gray-600">{format(new Date(apt.appointment_date), 'MMM d, yyyy')}</td>
                          <td className="py-4">
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
