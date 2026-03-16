import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, User as UserIcon, LogOut, Calendar } from 'lucide-react';
import { EMERGENCY_CONTACT } from '../constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Sync user state from localStorage on route change
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Doctors', path: '/doctors' },
  ];

  return (
    <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              D
            </div>
            <span className={`font-bold text-xl ${isScrolled ? 'text-gray-900' : 'text-blue-900'}`}>
              DentaCare<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${location.pathname === link.path
                  ? 'text-blue-600'
                  : isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-blue-900 hover:text-blue-600'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-4 ml-4">
              <a href={`tel:${EMERGENCY_CONTACT}`} className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                <Phone size={16} />
                {EMERGENCY_CONTACT}
              </a>

              {user ? (
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm">
                    <UserIcon size={18} className="text-blue-600" />
                    <span className="text-sm font-bold">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
                  </Link>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <Link to="/dashboard" className="text-gray-700">
                <UserIcon size={20} />
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <a href={`tel:${EMERGENCY_CONTACT}`} className="flex items-center gap-3 px-3 py-2 text-blue-600 font-bold">
                <Phone size={20} />
                {EMERGENCY_CONTACT}
              </a>
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-medium"
                >
                  Login / Signup
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-medium"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
