import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-number-input';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { FaGoogle, FaUser, FaBuilding, FaLock } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Separator } from '../ui/Separator';
import { AUTH_ENDPOINTS } from '../../utils/constants';
import OTPPopup from '../cards/OtpPopup';
import { toast } from 'react-toastify';
import 'react-phone-number-input/style.css';
import './styles/CreateAccountForm.css';

const BLOCKED_DOMAINS = [
  //'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'zoho.com'
];

const REGIONS = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
].sort((a, b) => a.name.localeCompare(b.name));

const workRoles = [
  { value: '', label: 'Select your work role' },
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'audit_team_member', label: 'Audit Team Member' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'compliance_analyst', label: 'Compliance Analyst' },
  { value: 'compliance_director', label: 'Compliance Director' },
  { value: 'quality_control_inspector', label: 'Quality Control Inspector' },
  { value: 'quality_manager', label: 'Quality Manager' },
  { value: 'vice_president_compliance', label: 'Vice President Compliance' },
  { value: 'compliance_manager', label: 'Compliance Manager' },
  { value: 'director', label: 'Director' },
  { value: 'management', label: 'Management' },
  { value: 'quality_engineer', label: 'Quality Engineer' },
  { value: 'risk_manager', label: 'Risk Manager' },
  { value: 'student', label: 'Student' },
  { value: 'department_owner', label: 'Department Owner' },
  { value: 'risk_team_member', label: 'Risk Team Member' },
  { value: 'security_operations', label: 'Security Operations' },
  { value: 'other', label: 'Other' },
];

const calculateStepProgress = (currentStep) => {
  return Math.min((currentStep / 4) * 100, 100);
};

const CreateAccountForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    company: '',
    industry: '',
    password: '',
    confirmPassword: '',
    workRole: '',
    otherWorkRole: '',
    country: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [verificationStep, setVerificationStep] = useState('initial');

  useEffect(() => {
    const state = location.state;
    if (state?.email && state?.googleAuth) {
      setEmail(state.email);
      setIsEmailValid(true);
      setVerificationStep('verified');
      toast.success('Email verified through Google authentication', {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  }, [location]);

  const validateWorkEmail = (email) => {
    if (!email) return 'Work email is required';
    if (!email.includes('@')) return 'Please enter a valid email address';
    
    const domain = email.split('@')[1].toLowerCase();
    if (BLOCKED_DOMAINS.includes(domain)) {
      return 'Please use your work email address. Personal email domains are not accepted.';
    }
    
    return '';
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const error = validateWorkEmail(newEmail);
    setEmailError(error);
    setIsEmailValid(!error);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && phoneNumber.length >= 10;
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Let's get started";
      case 2:
        return "Personal Information";
      case 3:
        return "Professional Details";
      case 4:
        return "Security Setup";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Begin with your work email";
      case 2:
        return "Tell us about yourself";
      case 3:
        return "Share your professional background";
      case 4:
        return "Create a secure password";
      default:
        return "";
    }
  };

  const handleNextStep = async (event) => {
    event.preventDefault();
    let error = '';

    switch (step) {
      case 1:
        if (!isEmailValid) {
          error = 'Please enter a valid work email';
        } else if (verificationStep === 'initial') {
          await handleEmailVerification();
          return;
        } else if (verificationStep !== 'verified') {
          error = 'Please verify your email before continuing';
          return;
        }
        break;
      case 2:
        if (!formData.firstName || !formData.lastName) {
          error = 'First name and last name are required';
        } else if (!validatePhoneNumber(formData.phone)) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 3:
        if (!formData.company || !formData.workRole) {
          error = 'Company and work role are required';
        }
        break;
      case 4:
        if (!formData.password || !formData.confirmPassword) {
          error = 'Both password fields are required';
        } else if (formData.password !== formData.confirmPassword) {
          error = 'Passwords must match';
        }
        break;
      default:
        break;
    }

    if (error) {
      setErrorMessage(error);
      toast.error(error, {
        position: "bottom-right",
        autoClose: 5000
      });
      return;
    }

    setErrorMessage('');
    setStep(step + 1);
  };

  const handleEmailVerification = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(AUTH_ENDPOINTS.SEND_CONFIRM_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send verification email');
      }

      setVerificationStep('email_sent');
      toast.success('Verification email sent! Please check your email and enter the code below.', {
        position: "bottom-right",
        autoClose: 5000
      });
      setShowOtpPopup(true);
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 5000
      });
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otpValue) => {
    try {
      setIsLoading(true);
      const response = await fetch(AUTH_ENDPOINTS.CONFIRM_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          otp: otpValue
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid verification code');
      }

      setVerificationStep('verified');
      setShowOtpPopup(false);
      toast.success('Email verified successfully!', {
        position: "bottom-right",
        autoClose: 3000
      });
      setStep(2);
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 5000
      });
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (verificationStep !== 'verified') {
        throw new Error('Email verification required');
      }

      const signupResponse = await fetch('https://app.spiralreports.com/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email,
          workRole: formData.workRole === 'other' ? formData.otherWorkRole : formData.workRole,
          emailVerified: true
        }),
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        throw new Error(errorData.message || 'Failed to create account');
      }

      toast.success('Account created successfully! You can now log in.', {
        position: "bottom-right",
        autoClose: 3000
      });
      navigate('/login');

    } catch (error) {
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 5000
      });
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const progress = calculateStepProgress(step);

  return (
    <div className="signup-form-container">
      <div className="progress-container">
        <div className="progress-info">
          <span>Step {step} of 4</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="signup-header">
        <h1 className="signup-title">{getStepTitle()}</h1>
        <p className="signup-subtitle">{getStepDescription()}</p>
      </div>

      {errorMessage && (
        <div className="message error-message">{errorMessage}</div>
      )}

      {successMessage && (
        <div className="message success-message">{successMessage}</div>
      )}

      <form onSubmit={step === 4 ? handleSignup : handleNextStep}>
        {step === 1 && (
          <div className="form-field">
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={handleEmailChange}
                className={`field-input ${emailError ? 'error' : ''}`}
                disabled={verificationStep === 'verified'}
              />
              <FaUser className="field-icon" />
            </div>
            {emailError && (
              <p className="error-message">{emailError}</p>
            )}
            {verificationStep === 'verified' && (
              <p className="success-message">✓ Email verified</p>
            )}

            {!location.state?.googleAuth && (
              <>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => window.location.href = AUTH_ENDPOINTS.GOOGLE_LOGIN}
                  className="google-button"
                >
                  <FaGoogle className="text-lg" />
                  Continue with Google
                </Button>

                <div className="divider-container">
                  <div className="divider-line" />
                  <span className="divider-text">or</span>
                  <div className="divider-line" />
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="form-field">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="field-input"
              />
              <Input
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="field-input"
              />
            </div>
            <Input
              id="middleName"
              placeholder="Middle Name (Optional)"
              value={formData.middleName}
              onChange={handleInputChange}
              className="field-input"
            />
            
            <div className="phone-input-container">
              <label className="field-label">Business Phone Number</label>
              <PhoneInput
                value={formData.phone}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    phone: value,
                    country: value ? value.split(' ')[0].replace('+', '') : prev.country
                  }));
                }}
                placeholder="Enter phone number"
                className="phone-input"
              />
              <p className="text-xs text-gray-500">
                Please provide a business phone number where we can reach you.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-field">
            <div className="relative">
              <Input
                id="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleInputChange}
                className="field-input"
              />
              <FaBuilding className="field-icon" />
            </div>
            <Input
              id="industry"
              placeholder="Industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="field-input"
            />
            <select
              id="workRole"
              value={formData.workRole}
              onChange={handleInputChange}
              className="field-input"
            >
              {workRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {formData.workRole === 'other' && (
              <Input 
                id="otherWorkRole" 
                placeholder="Please specify your work role" 
                value={formData.otherWorkRole} 
                onChange={handleInputChange}
                className="field-input"
              />
            )}
          </div>
        )}

        {step === 4 && (
          <div className="form-field">
            <PasswordCheckerWithConfirm 
              password={formData.password}
              setPassword={(password) => setFormData(prev => ({ ...prev, password }))}
              confirmPassword={formData.confirmPassword}
              setConfirmPassword={(confirmPassword) => setFormData(prev => ({ ...prev, confirmPassword }))}
              required={true}
            />
          </div>
        )}

        <div className="button-container">
          {step > 1 && (
            <button
              type="button"
              className="nav-button back-button"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          )}
          <button 
            type="submit"
            className="nav-button next-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="loading-spinner h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Processing...
              </span>
            ) : (
              step === 1 && verificationStep === 'initial' ? 'Verify Email' :
              step === 4 ? 'Create Account' : 'Continue'
            )}
          </button>
        </div>

        <div className="signin-link">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </div>
      </form>

      {showOtpPopup && (
        <OTPPopup
          isOpen={showOtpPopup}
          onClose={() => setShowOtpPopup(false)}
          onSubmit={handleOtpSubmit}
        />
      )}
    </div>
  );
};

const PasswordCheckerWithConfirm = ({ password, setPassword, confirmPassword, setConfirmPassword, required }) => {
  const [validationResults, setValidationResults] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(false);

  const checkPasswordStrength = (password) => {
    setValidationResults({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
    setPasswordMatch(confirmPassword === newPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmValue = e.target.value;
    setConfirmPassword(confirmValue);
    setPasswordMatch(confirmValue === password);
  };

  return (
    <div className="password-container">
      <div className="relative">
        <Input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="field-input"
          placeholder="Create password"
          required={required}
        />
        <FaLock className="field-icon" />
      </div>

      <div className="password-requirements">
        {Object.entries(validationResults).map(([key, valid]) => (
          <div key={key} className={`requirement-item ${valid ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`requirement-indicator ${valid ? 'requirement-valid' : 'requirement-invalid'}`}>
              {valid ? '✓' : '·'}
            </div>
            <span className="text-sm">
              {key === 'length' && 'At least 8 characters'}
              {key === 'uppercase' && 'Uppercase letter'}
              {key === 'lowercase' && 'Lowercase letter'}
              {key === 'digit' && 'Number'}
              {key === 'specialChar' && 'Special character'}
            </span>
          </div>
        ))}
      </div>

      <div className="form-field">
        <div className="relative">
          <Input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`field-input ${required && !confirmPassword ? 'error' : ''}`}
            placeholder="Confirm password *"
            required={required}
          />
          <FaLock className="field-icon" />
        </div>
        {confirmPassword && (
          <p className={passwordMatch ? 'success-message' : 'error-message'}>
            {passwordMatch ? '✓ Passwords match' : '× Passwords do not match'}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateAccountForm;
