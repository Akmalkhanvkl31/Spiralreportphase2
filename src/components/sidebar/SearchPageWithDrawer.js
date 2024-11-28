import React, { useState } from 'react';
import { 
  Search, List, PlusCircle, ChevronRight, 
  LogOut, X, FileText, Settings, 
  CreditCard, User, Home, UserPlus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../hooks/AuthContext';
import ReferralModal from '../modal/ReferralModal';

function SearchPageWithDrawer({ setIsMenuOpen }) {
  const navigate = useNavigate(); 
  const { authData, logout } = useAuth();
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const userProfile = authData?.user ? {
    name: `${authData.user.firstName} ${authData.user.lastName}`,
    email: authData.user.email,
    credits: authData.user.credits || 0,
    image: authData.user.profileImage || '/api/placeholder/80/80',
  } : {
    name: `${authData.firstName || 'Guest'} ${authData.lastName || ''}`,
    email: authData.email || 'guest@example.com',
    credits: authData.credits || 0,
    image: authData.profileImage || '/api/placeholder/80/80',
  };

  const navItems = [
    {icon: Home, label: "Dashboard", badge: null, path:'/dashboard'},
    { icon: Search, label: "Search Assessments", badge: null, path: '/assessment' },
    { icon: List, label: "All Assessments", badge: null, path: '/assessmentsPage' },
    { icon: FileText, label: "Draft Assessments", badge: "3", path: '/drafts' },
    { icon: CreditCard, label: "Credit History", badge: null, path: '/credits' },
    { icon: User, label: "Settings", badge: null, path: '/settings' },
  ];

  const handleNavItemClick = (path, state = {}) => {
    setIsMenuOpen(false);
    navigate(path, { state });
  };

  const handleAddCredits = () => {
    setIsMenuOpen(false);
    navigate('/add-credits');
  };

  const handleReferFriend = () => {
    setIsReferralModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gray-50 relative">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-40"
        onClick={() => setIsMenuOpen(false)} 
      />

      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 flex flex-col ${setIsMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Account</h2>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="relative px-6 py-8 bg-gradient-to-r from-red-500 to-red-600">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img src={userProfile.image} alt="Profile" className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30" />
              <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-lg">
                <Settings size={14} className="text-red-500" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-lg uppercase">{userProfile.name}</h3>
              <p className="text-red-100 text-sm">{userProfile.email}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 border-b border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Credits</p>
                <p className="text-3xl font-bold text-gray-800">{userProfile.credits}</p>
              </div>
              <button 
                onClick={handleAddCredits} 
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
              >
                <PlusCircle size={18} />
                Add Credits
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col pb-24">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <button 
                key={index} 
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
                onClick={() => handleNavItemClick(item.path, item.path === '/settings' ? userProfile : {})}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            ))}
          </nav>
          
          <div className="mt-6 px-4">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl">
                    <UserPlus size={24} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">Refer a Friend</h4>
                    <p className="text-sm text-gray-600">Get 50 free credits for each referral</p>
                  </div>
                </div>
                <button 
                  onClick={handleReferFriend}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-md border border-red-200"
                >
                  Invite Friends
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="my-4 border-t border-gray-100" />
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors group mt-auto"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-500 transition-colors">
                <LogOut size={20} />
              </div>
              <span className="font-medium">Logout</span>
            </div>
            <ChevronRight size={18} className="text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      <ReferralModal 
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </div>
  );
}

export default SearchPageWithDrawer;