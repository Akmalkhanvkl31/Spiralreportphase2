import React, { useState, useEffect } from 'react';
import SearchPageWithDrawer from '../components/sidebar/SearchPageWithDrawer';
import { Menu } from 'lucide-react';
import logo1 from '../assets/SpiralReports Logo White.jpg';
import logo2 from '../assets/logoBlack.png';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../hooks/AuthContext';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const { authData } = useAuth(); // Destructure authData from useAuth
  console.log(authData);
  
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyles = {
    backgroundColor: scrolled ? '#ffffff' : '#EF4444',
    boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    height: scrolled ? '70px' : '80px',
  };

  const containerStyles = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 2rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
  };

  const searchBarStyles = {
    container: {
      position: 'relative',
      flex: '1',
      maxWidth: '500px',
      margin: '0 2rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      paddingLeft: '3rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.938rem',
      backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.045)' : 'rgba(255, 255, 255, 0.15)',
      color: scrolled ? '#1f2937' : '#ffffff',
      transition: 'all 0.2s ease',
      outline: 'none',
      backdropFilter: 'blur(8px)',
    },
    icon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1.25rem',
      height: '1.25rem',
      color: scrolled ? '#6b7280' : 'rgba(255, 255, 255, 0.7)',
      transition: 'color 0.2s ease',
    },
  };

  const creditsButtonStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.3rem',
      backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.045)' : 'rgba(255, 255, 255, 0.15)',
      borderRadius: '8px',
      color: scrolled ? '#1f2937' : '#ffffff',
      transition: 'all 0.2s ease',
      gap: '0.25rem',
    },
    credits: {
      padding: '0.45rem 0.75rem',
      fontSize: '0.938rem',
      fontWeight: '500',
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    divider: {
      width: '1px',
      height: '24px',
      backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)',
      margin: '0 0.2rem',
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.45rem 0.75rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '6px',
      color: scrolled ? '#1f2937' : '#ffffff',
      cursor: 'pointer',
      fontSize: '0.938rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      gap: '0.5rem',
    },
  };

  const handleAddCreditsClick = () => {
    navigate('/add-credits');  // Navigate to the /add-credit page
  };

  const handleLogoClick = () => {
    navigate('/dashboard');  // Navigate to the /dashboard page when logo is clicked
  };

  // Apply hover styles directly on the elements using state
  const getCreditsHoverStyles = () => ({
    backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.065)' : 'rgba(255, 255, 255, 0.2)',
  });

  const getAddButtonHoverStyles = () => ({
    backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.065)' : 'rgba(255, 255, 255, 0.1)',
  });

  // Check if authData is loaded
  if (!authData) {
    return <div>Loading...</div>;  // You can add a loading spinner here if needed
  }

  return (
    <nav style={navStyles}>
      <div style={containerStyles}>
        {/* Logo */}
        <img
          src={scrolled ? logo1 : logo2}
          alt="Logo"
          style={{
            height: scrolled ? '30px' : '55px',  // Adjust height for scrolled and not scrolled states
            width: scrolled ? 'auto' : 'auto',  // Maintain auto width, but you can also adjust width here if needed
            transition: 'height 0.3s ease',  // Smooth transition for the height change
          }}
          onClick={handleLogoClick} // Add onClick event handler for logo
        />

        {/* Search Bar */}
        <div style={searchBarStyles.container}>
          {/* <input
            type="text"
            placeholder="Search assessments"
            style={{
              ...searchBarStyles.input,
              ...getSearchBarHoverStyles(),
            }}
          /> */}
          {/* <svg
            style={searchBarStyles.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg> */}
        </div>

        {/* Combined Credits Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              ...creditsButtonStyles.container,
              ...getCreditsHoverStyles(),
            }}
          >
            <div style={creditsButtonStyles.credits}>
              <svg
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {/* Safely access credits and fallback to 0 if not available */}
              {(authData && (authData.credits || authData.user?.credits)) ? (authData.credits || authData.user?.credits).toLocaleString() : '0'}
              </div>
            <div style={creditsButtonStyles.divider} />
            <button
              onClick={handleAddCreditsClick}
              style={{
                ...creditsButtonStyles.addButton,
                ...getAddButtonHoverStyles(),
              }}
            >
              <svg
                style={{
                  width: '1rem',
                  height: '1rem',
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add
            </button>
          </div>

          {/* Hamburger Menu */}
          <div className="pt-4 pb-4">
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-full bg-white hover:bg-gray-100 transition-all">
                <Menu size={24} className="text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && <SearchPageWithDrawer setIsMenuOpen={setIsMenuOpen} />}
    </nav>
  );
};

export default Header;
