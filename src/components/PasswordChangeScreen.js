import React, { useState, useCallback, useEffect } from 'react';
import { 
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const PasswordRequirement = React.memo(({ text, isMet }) => (
  <div className="flex items-center gap-2">
    {isMet ? (
      <CheckCircle2 className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-300" />
    )}
   <span className={`text-sm ${isMet ? 'text-gray-900' : 'text-gray-500'}`}>
{text}
    </span>
  </div>
));

const PasswordInput = React.memo(({ label, name, value, showPassword, onToggleVisibility, onChangeValue }) => {
  const handleChange = useCallback((e) => {
    onChangeValue(name, e.target.value);
  }, [name, onChangeValue]);

  const handleToggle = useCallback(() => {
    onToggleVisibility(name);
  }, [name, onToggleVisibility]);

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm"
          required
        />
        <button
          type="button"
          onClick={handleToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
});

const PasswordScreen = () => {
  // Get token from URL if it exists
  const [resetToken, setResetToken] = useState(null);
  const isResetMode = Boolean(resetToken);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
    }
  }, []);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  const requirements = React.useMemo(() => ({
    length: formData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(formData.newPassword),
    lowercase: /[a-z]/.test(formData.newPassword),
    number: /[0-9]/.test(formData.newPassword),
    special: /[^A-Za-z0-9]/.test(formData.newPassword),
    match: formData.newPassword === formData.confirmPassword && formData.newPassword !== ''
  }), [formData.newPassword, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isResetMode) {
        // Reset password API call
        const resetData = {
          password: formData.newPassword,
          token: resetToken
        };
        console.log('Reset password data:', resetData);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Update password API call
        const updateData = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        };
        console.log('Update password data:', updateData);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      console.log('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-500 pt-6 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button 
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isResetMode ? 'Reset Password' : 'Change Password'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-red-50 rounded-lg">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {isResetMode ? 'Set New Password' : 'Update Your Password'}
                </h2>
                <p className="text-sm text-gray-500">Please ensure your new password meets all requirements</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {!isResetMode && (
                  <PasswordInput 
                    label="Current Password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    showPassword={showPasswords.currentPassword}
                    onToggleVisibility={togglePasswordVisibility}
                    onChangeValue={handleInputChange}
                  />
                )}

                <PasswordInput 
                  label="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  showPassword={showPasswords.newPassword}
                  onToggleVisibility={togglePasswordVisibility}
                  onChangeValue={handleInputChange}
                />

                <PasswordInput 
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  showPassword={showPasswords.confirmPassword}
                  onToggleVisibility={togglePasswordVisibility}
                  onChangeValue={handleInputChange}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Password Requirements</h3>
                <PasswordRequirement text="At least 8 characters" isMet={requirements.length} />
                <PasswordRequirement text="One uppercase letter" isMet={requirements.uppercase} />
                <PasswordRequirement text="One lowercase letter" isMet={requirements.lowercase} />
                <PasswordRequirement text="One number" isMet={requirements.number} />
                <PasswordRequirement text="One special character" isMet={requirements.special} />
                <PasswordRequirement text="Passwords match" isMet={requirements.match} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!allRequirementsMet || isLoading}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Processing...' : (isResetMode ? 'Reset Password' : 'Update Password')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordScreen;