import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AUTH_ENDPOINTS } from '../../utils/constants';
import './styles/LoginForm.css';

const LoginForm = ({ onSubmit, formData, onInputChange, errorMessage: parentErrorMessage }) => {
  const navigate = useNavigate();
  const [touched, setTouched] = useState({
    username: false,
    password: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localErrorMessage, setLocalErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const errors = {
      username: { isValid: true, message: '' },
      password: { isValid: true, message: '' }
    };
    
    if (!formData.username) {
      errors.username = { isValid: false, message: 'Email is required' };
    } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
      errors.username = { isValid: false, message: 'Please enter a valid email' };
    }
    
    if (!formData.password) {
      errors.password = { isValid: false, message: 'Password is required' };
    } else if (formData.password.length < 6) {
      errors.password = { isValid: false, message: 'Password must be at least 6 characters' };
    }
    
    return errors;
  };
  
  const validation = validateForm();
  const buttonEnabled = validation.username.isValid && validation.password.isValid;
  
  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleRememberMe = () => {
    setRememberMe(prev => !prev);
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };
  
  const handleSignUpClick = () => {
    navigate('/signup');
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setLocalErrorMessage('');
      
      // Generate a random state parameter for security
      const state = Math.random().toString(36).substring(2);
      // Store the state in sessionStorage for verification
      sessionStorage.setItem('googleOAuthState', state);
      
      // Redirect to Google login with state parameter using proper URL format
      const googleLoginUrl = `${AUTH_ENDPOINTS.GOOGLE_LOGIN}?state=${encodeURIComponent(state)}`;
      window.location.href = googleLoginUrl;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setLocalErrorMessage('Failed to initialize Google sign-in. Please try again.');
      setIsGoogleLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!buttonEnabled || isSubmitting) return;
    
    setIsSubmitting(true);
    setLocalErrorMessage('');
    
    try {
      await onSubmit(e, { rememberMe });
    } catch (error) {
      setLocalErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayErrorMessage = parentErrorMessage || localErrorMessage;

  return (
    <div className="login-form-container">
      <div className="login-header">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Please enter your work email to sign in</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="field-label" htmlFor="username">
            Work Email
          </label>
          <div className="relative">
            <Mail className="field-icon" />
            <input
              id="username"
              type="email"
              placeholder="name@company.com"
              value={formData.username}
              onChange={onInputChange}
              onBlur={handleBlur}
              className={`field-input ${touched.username && !validation.username.isValid ? 'error' : ''}`}
            />
          </div>
          {touched.username && !validation.username.isValid && (
            <p className="error-message">{validation.username.message}</p>
          )}
        </div>

        <div className="form-field">
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="field-icon" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={onInputChange}
              onBlur={handleBlur}
              className={`field-input ${touched.password && !validation.password.isValid ? 'error' : ''}`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-toggle"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {touched.password && !validation.password.isValid && (
            <p className="error-message">{validation.password.message}</p>
          )}
        </div>

        <div className="form-options">
          <div className="remember-me">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMe}
            />
            <label htmlFor="remember-me">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password"
          >
            Forgot password?
          </button>
        </div>

        {displayErrorMessage && (
          <div className="error-message">
            {displayErrorMessage}
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={!buttonEnabled || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="loading-spinner h-5 w-5" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="google-button"
        >
          {isGoogleLoading ? (
            <Loader2 className="loading-spinner h-5 w-5" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
        </button>

        <div className="signup-link">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={handleSignUpClick}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
