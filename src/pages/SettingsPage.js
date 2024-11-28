import React, { useState } from 'react';
import { 
  Clock, 
  User,
  Receipt,
  ChevronRight,
  UserRoundPenIcon,
  LogOut,
  ArrowLeft,
  Share2,
  Copy,
  Send
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import useUserProfile from '../hooks/useUserProfile';
import Header from '../components/Header';
import { useAuth } from '../hooks/AuthContext';
import PageLoader from '../components/ui/PageLoader';

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authData, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const { userProfile, loading, error } = useUserProfile();
  const { credits, profileImage } = userProfile || location.state || authData?.user || {};

  const referralLink = 'https://yourapp.com/refer/USER123';

  const [transactions] = useState([
    { id: 1, type: 'Credit Purchase', amount: 100, credits: 200, date: '2024-02-01' },
    { id: 2, type: 'Credit Purchase', amount: 45, credits: 100, date: '2024-01-15' },
    { id: 3, type: 'Credit Purchase', amount: 25, credits: 50, date: '2024-01-01' }
  ]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Implement email invitation logic here
    setEmail('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClick = () => {
    navigate('/invoices');
  };

  if (loading) return <PageLoader />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 pb-52">
        <div className="bg-red-500 pt-20 pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
            <div className="p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Profile</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {profileImage ? 
                      <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full" /> : 
                      <User className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {authData?.user?.firstName || authData?.firstName || 'Guest User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {authData?.user?.email || authData?.email || 'guest@example.com'}
                    </div>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => setIsModalOpen(true)} 
                className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:border-red-200"
              >
                <div className="flex items-center gap-3">
                  <UserRoundPenIcon className="w-5 h-5 text-gray-400" />
                  <div className="text-sm text-gray-600">Edit Profile</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <button
                onClick={handleClick}
                className="w-full flex items-center justify-between text-sm text-gray-600 border rounded-lg p-3 hover:border-red-200"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  View Invoices
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-800">Refer Friends</h2>
              </div>
              
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
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-4">
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
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-800">Recent Transactions</h2>
                <button className="text-sm text-gray-600 hover:text-red-500">View All</button>
              </div>
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.credits} Credits
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(transaction.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <button 
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userData={userProfile || {}}
        />
      </div>
    </div>
  );
};

export default SettingsPage;