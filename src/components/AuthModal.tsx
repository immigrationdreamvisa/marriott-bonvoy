import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { MarriottLogo } from './MarriottLogo';
import { X, Eye, EyeOff } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useBooking();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setMessage('Please enter both your first and last name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }
    signUp(firstName, lastName, email, password);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 text-stone-900 border border-stone-200 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-800 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Title */}
        <div className="flex flex-col items-center justify-center mb-6">
          <MarriottLogo size="md" variant="dark" />
          <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mt-2">
            Join Marriott Bonvoy & Unlock Member Rates
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-lg">
            {message}
          </div>
        )}

        {/* Register / Join Form */}
        <form onSubmit={handleSignUp} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#8a1538]"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#8a1538]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@marriott.com"
              className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#8a1538]"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 pr-10 focus:outline-none focus:border-[#8a1538]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-600 space-y-1">
            <span className="font-bold text-stone-900 block">Member Privileges:</span>
            <p>✓ Exclusive Member Rates on all hotels</p>
            <p>✓ Earn points towards free award stays</p>
            <p>✓ Free standard in-room Wi-Fi</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#8a1538] hover:bg-[#6e0f2b] text-white font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
          >
            Join Marriott Bonvoy Free
          </button>
        </form>

      </div>
    </div>
  );
};
