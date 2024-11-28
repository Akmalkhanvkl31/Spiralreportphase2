import React, { useState } from 'react';
import { 
  X, Copy, Send, Twitter, 
  Facebook, Linkedin, ChevronRight 
} from 'lucide-react';

const ReferralModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const referralLink = 'https://yourapp.com/refer/USER123';
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Refer Friends</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Share your referral link
              </label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 text-sm text-gray-600 border rounded-lg p-3 bg-gray-50"
                />
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Invite via email
              </label>
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter friend's email"
                  className="flex-1 text-sm border rounded-lg p-3"
                  required
                />
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">Or share via</span>
                </div>
              </div>

              <div className="flex justify-center gap-6">
                <button className="p-2 rounded-lg hover:bg-gray-50">
                  <Twitter className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-50">
                  <Facebook className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-50">
                  <Linkedin className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <a 
                href="/referrals" 
                className="flex items-center justify-between w-full text-sm text-gray-600 border rounded-lg p-3 hover:border-red-200 group"
              >
                <span>View your referral status and history</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;