import React, { useState } from 'react';
import { ArrowLeft, Users, CreditCard, Copy, Send, Twitter, Facebook, Linkedin, User, ChevronRight } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';

const ReferralPage = () => {
  const [email, setEmail] = useState('');
  const referralLink = 'https://yourapp.com/refer/USER123';
  const navigate = useNavigate();

  // Sample referred users data
  const [referredUsers] = useState([
    { id: 1, name: 'Sarah Wilson', email: 'sarah.w@example.com', joinedDate: '2024-02-15', status: 'active' },
    { id: 2, name: 'Michael Chen', email: 'michael.c@example.com', joinedDate: '2024-02-10', status: 'active' },
    { id: 3, name: 'Emma Davis', email: 'emma.d@example.com', joinedDate: '2024-02-01', status: 'active' }
  ]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-500 pt-6 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          <h1 className="text-2xl font-bold text-white">Referral Program</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {/* Stats Section */}
          <div className="p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-500">Credits Earned</div>
                </div>
                <div className="text-xl font-bold text-gray-900">500</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-500">Successful Referrals</div>
                </div>
                <div className="text-xl font-bold text-gray-900">12</div>
              </div>
            </div>
          </div>

          {/* Referral Link Section */}
          <div className="p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Share Your Referral Link</h2>
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

          {/* Invite Friends Section */}
          <div className="p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Invite Friends</h2>
            <form onSubmit={handleEmailSubmit} className="flex gap-2 mb-6">
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">Or share via</span>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-6">
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

          {/* Successful Referrals List */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Successful Referrals</h2>
              <button className="text-sm text-gray-600 hover:text-red-500 flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {referredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(user.joinedDate)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs py-1 px-2 bg-green-50 text-green-700 rounded">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReferralPage;