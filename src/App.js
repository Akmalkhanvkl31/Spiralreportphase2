import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';  // Import useNavigate here
import { AuthProvider, useAuth } from './hooks/AuthContext'; // Import your AuthProvider and useAuth
import AuthPage from './pages/AuthPage';
import HomePage from './pages/Home';
import Assessment from './pages/SearchPage';
import ToastNotifications from './components/ToastNotifications';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import ProtectedRoute from './components/ProtectedRoute';
import AddCredit from './components/cards/AddCreditsModal';
import Settings from './pages/SettingsPage';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentQuiz from './pages/AssessmentQuiz';
import PaymentCancelledScreen from './components/PaymentCancelledScreen';
import PaymentFailedScreen from './components/PaymentFailedScreen';
import PaymentSuccessScreen from './components/PaymentSuccessScreen';
import Dashboard from './pages/Dashboard';
import PasswordChangeScreen from './components/PasswordChangeScreen';
import AllInvoicePage from './pages/AllInvoicePage';
import SOC1Report from './pages/ReportPage'
import { UserProvider } from './context/UserContext';
import { isTokenExpired } from './utils/jwtUtils';  // Token check utility
import { handleRefreshToken } from './utils/auth';  // Function to call API and refresh token
import DraftAssessmentsPage from './pages/DraftAssessment';
import ReferralPage from './pages/ReferralPage';
import OAuthReturn from './types/OAuthReturn';
import GoogleCallback from './components/GoogleCallback';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          {/* OAuth Callback Routes */}
          <Route path="/oauth/return" element={<GoogleCallback />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          {/* Protected Routes */}
          <Route path="/assessment" element={<ProtectedRoute component={Assessment} />} />
          <Route path="/add-credits" element={<ProtectedRoute component={AddCredit} />} />
          <Route path='/settings' element={<ProtectedRoute component={Settings} />} />
          <Route path='/assessmentsPage' element={<ProtectedRoute component={AssessmentsPage} />} />
          <Route path='/assessmentsquiz' element={<ProtectedRoute component={AssessmentQuiz} />} />
          <Route path='/purchaseCancel' element={<PaymentCancelledScreen />} />
          <Route path='/purchaseFailed' element={<PaymentFailedScreen />} />
          <Route path='/purchaseSuccess' element={<PaymentSuccessScreen />} />
          <Route path='/dashboard' element={<ProtectedRoute component={Dashboard} />} />
          <Route path='/reset-password' element={<PasswordChangeScreen />} />
          <Route path='/invoices' element={<ProtectedRoute component={AllInvoicePage} />} />
          <Route path="/report/:assessmentId" element={<SOC1Report />} />
          <Route path="/report" element={<SOC1Report />} />
          <Route path='/drafts' element={<DraftAssessmentsPage/>}/>
          <Route path='/referral' element={<ReferralPage/>}/>
        </Routes>
        <ToastNotifications />
        <ToastContainer />
      </UserProvider>
    </AuthProvider>
  );
}

// Component to handle redirection based on auth state
function AuthRedirect() {
  const { authData, setAuthData, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = authData?.access_token || authData?.accessToken;
        const refreshToken = authData?.refreshToken;
        const userId = authData?.userId;

        if (!token) {
          setAuthData(null);
          navigate("/login");
          return;
        }

        if (isTokenExpired(token) && refreshToken && userId) {
          try {
            const newTokens = await handleRefreshToken(userId, refreshToken);
            setAuthData({
              access_token: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
              userId,
            });
          } catch (error) {
            setAuthData(null);
            navigate("/login");
          }
        }
      } catch (error) {
        setAuthData(null);
        navigate("/login");
      }
    };

    if (!isLoading) {
      checkAuthToken();
    }
    setLoading(false);
  }, [authData, isLoading, setAuthData, navigate]);

  if (loading) return <div>Loading...</div>;
  if (authData) return <Navigate to="/dashboard" replace />;
  return <HomePage />;
}

export default App;
