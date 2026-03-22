import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock as Clock3, 
  User as UserIcon, 
  Mail, 
  Phone, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Appointment {
  id: number;
  doctor_name: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  payment_screenshot?: string;
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    image: ''
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userRes, ApptsRes] = await Promise.all([
          fetch('/api/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/appointments/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (userRes.ok && ApptsRes.ok) {
          const userData = await userRes.json();
          const apptsData = await ApptsRes.json();
          
          setUser(userData);
          setAppointments(apptsData);
          setEditForm({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            age: userData.age || '',
            gender: userData.gender || '',
            image: userData.image || ''
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditModalOpen(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setAppointments(appointments.filter(a => a.id !== id));
        alert('Appointment cancelled successfully.');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  if (!user) return null;

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
    <div className="pt-40 pb-32 bg-slate-50/50 min-h-screen overflow-hidden relative">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary-100/30 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-display font-bold text-slate-900 mb-2 tracking-tight">
              Patient <span className="text-transparent bg-clip-text premium-gradient">Dashboard</span>
            </h1>
            <p className="text-slate-500 text-lg">Welcome back, <span className="font-bold text-primary-600">{user.name}</span>! Here's your health overview.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link
              to="/book"
              className="px-8 py-4 premium-button premium-gradient text-white rounded-3xl font-bold flex items-center gap-3 shadow-xl shadow-primary-500/20 group"
            >
              <Calendar size={22} className="group-hover:scale-110 transition-transform" />
              Book New Appointment
            </Link>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 rounded-[3.5rem] shadow-2xl overflow-hidden border-white"
            >
              <div className="flex flex-col items-center text-center mb-10 relative">
                <div className="relative group">
                  <div className="absolute inset-0 premium-gradient blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                  <img
                    src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl relative z-10 mb-6 object-cover"
                  />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900">{user.name}</h3>
                <p className="text-slate-400 font-medium mb-2">Member since {format(new Date(), 'MMMM yyyy')}</p>
                <div className="bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-primary-400 tracking-wider">Patient ID:</span>
                  <span className="text-xs font-bold text-primary-600">#00{user.id}</span>
                </div>
              </div>

              <div className="space-y-6 pt-10 border-t border-slate-100/50">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 glass-card bg-white/80 rounded-2xl flex items-center justify-center text-primary-500 shadow-sm transition-transform group-hover:scale-110">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Email Address</p>
                    <p className="text-sm font-bold text-slate-700">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 glass-card bg-white/80 rounded-2xl flex items-center justify-center text-primary-500 shadow-sm transition-transform group-hover:scale-110">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Phone Number</p>
                    <p className="text-sm font-bold text-slate-700">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 glass-card bg-white/30 rounded-2xl">
                    <div className="text-primary-400 font-black text-[10px] uppercase tracking-tighter">Age</div>
                    <div className="text-sm font-bold text-slate-700">{user.age || '—'}</div>
                  </div>
                  <div className="flex items-center gap-3 p-3 glass-card bg-white/30 rounded-2xl">
                    <div className="text-primary-400 font-black text-[10px] uppercase tracking-tighter">Sex</div>
                    <div className="text-sm font-bold text-slate-700 capitalize">{user.gender || '—'}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-12">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full py-4 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-2xl font-bold transition-all border border-primary-100/50"
                >
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
                  className="w-full py-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </motion.div>

            {/* Premium AI Health Tip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="premium-gradient p-10 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-primary-500/20 group"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                  <CheckCircle size={28} className="text-white" />
                </div>
                <h4 className="text-xl font-display font-bold mb-4">AI Dental Tip</h4>
                <p className="text-primary-50 leading-relaxed text-lg opacity-90">
                  Consistency is key. Remember to brush for 2 minutes and floss daily. Your brighter smile starts with these small habits!
                </p>
              </div>
              {/* Decorative circles */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-10 rounded-[3.5rem] border-white shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
                    <Clock3 size={24} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900">
                    Upcoming Appointments
                  </h3>
                </div>
                <span className="bg-primary-50 text-primary-600 text-sm font-bold px-6 py-2 rounded-full border border-primary-100">
                  {upcoming.length} Scheduled
                </span>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4 text-slate-400">
                  <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                  <p className="font-medium">Fetching your appointments...</p>
                </div>
              ) : upcoming.length === 0 ? (
                <div className="py-20 text-center glass-card bg-slate-50/50 rounded-[2.5rem] border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-sm">
                    <Calendar size={40} />
                  </div>
                  <h5 className="text-xl font-bold text-slate-900 mb-2">No Appointments Yet</h5>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">Ready to start your dental journey? Book your first visit today.</p>
                  <Link to="/book" className="inline-flex py-4 px-10 premium-gradient text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform">
                    Book Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {upcoming.map((apt, index) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all group relative overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex flex-col items-center justify-center text-primary-600 group-hover:bg-primary-50 transition-colors">
                            <span className="text-xs font-bold uppercase text-slate-400 group-hover:text-primary-400">{format(new Date(apt.appointment_date), 'MMM')}</span>
                            <span className="text-2xl font-black">{format(new Date(apt.appointment_date), 'dd')}</span>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{apt.service}</h4>
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                              <UserIcon size={14} className="text-primary-400" />
                              with {apt.doctor_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-50">
                          <div className="flex flex-col lg:items-end">
                            <p className="text-slate-900 font-bold">{format(new Date(apt.appointment_date), 'EEEE')}</p>
                            <p className="text-primary-600 font-black text-lg">{apt.appointment_time}</p>
                          </div>

                          <div className="flex items-center gap-3 ml-auto">
                            {apt.payment_screenshot && (
                              <button
                                onClick={() => setViewingScreenshot(apt.payment_screenshot)}
                                className="w-12 h-12 flex items-center justify-center text-primary-500 bg-primary-50 hover:bg-primary-100 rounded-2xl transition-all"
                                title="View Payment Proof"
                              >
                                <Eye size={22} />
                              </button>
                            )}
                            <button
                              onClick={() => handleCancel(apt.id)}
                              className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                              title="Cancel Appointment"
                            >
                              <Trash2 size={22} />
                            </button>
                            <div className="w-12 h-12 flex items-center justify-center text-slate-300 group-hover:text-primary-500 group-hover:bg-primary-50 rounded-2xl transition-all">
                              <ChevronRight size={22} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive background highlight */}
                      <div className="absolute top-0 right-0 w-1 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Appointment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-10 rounded-[3.5rem] border-white shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-500">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900">
                  Health History
                </h3>
              </div>

              {loading ? (
                <div className="py-10 text-center animate-pulse text-slate-400 font-medium">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="py-10 text-center glass-card bg-slate-50/20 rounded-[2rem] border-slate-100 text-slate-400 text-sm italic">
                  No records to display yet.
                </div>
              ) : (
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                      <tr className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
                        <th className="px-6 pb-2">Treatment Service</th>
                        <th className="px-6 pb-2">Specialist</th>
                        <th className="px-6 pb-2">Date</th>
                        <th className="px-6 pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((apt) => (
                        <tr key={apt.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-6 font-bold text-slate-700 bg-white/50 rounded-l-[1.5rem] group-hover:bg-white">{apt.service}</td>
                          <td className="px-6 py-6 text-slate-500 font-medium bg-white/50 group-hover:bg-white">{apt.doctor_name}</td>
                          <td className="px-6 py-6 text-slate-500 bg-white/50 group-hover:bg-white">{format(new Date(apt.appointment_date), 'MMM d, yyyy')}</td>
                          <td className="px-6 py-6 text-right bg-white/50 rounded-r-[1.5rem] group-hover:bg-white">
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card w-full max-w-lg rounded-[3rem] p-10 shadow-2xl border-white relative"
          >
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 p-2"
            >
              <AlertCircle size={24} className="rotate-45" />
            </button>

            <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">Edit <span className="text-primary-600">Profile</span></h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-primary-500/10 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Age</label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-primary-500/10 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-primary-500/10 outline-none appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-primary-500/10 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Profile Picture URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-primary-500/10 outline-none"
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="flex-[2] py-4 premium-gradient text-white rounded-2xl font-bold shadow-xl shadow-primary-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  {updatingProfile ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Screenshot Viewer Modal */}
      <AnimatePresence>
        {viewingScreenshot && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full h-[80vh] flex items-center justify-center"
            >
              <button
                onClick={() => setViewingScreenshot(null)}
                className="absolute -top-12 right-0 text-white hover:text-primary-400 p-2 transition-colors flex items-center gap-2 font-bold"
              >
                <X size={24} /> Close Preview
              </button>
              <img
                src={viewingScreenshot}
                className="w-full h-full object-contain rounded-3xl shadow-2xl border-4 border-white/10"
                alt="Payment Screenshot"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
