import React, { useState, useRef, useEffect } from 'react';
import { User, Building2, Mail, Phone, Calendar, Briefcase, Camera, X } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';  // Import the useAuth hook
import useUpdateProfile from '../hooks/useUpdateProfile';  // The custom hook for profile update

// FormField Component
const FormField = ({ label, name, value, onChange, error, icon: Icon, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon className="w-4 h-4" />
      </div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-9 py-2.5 text-sm ${props.disabled ? 'bg-gray-50' : 'bg-white'} ${error ? 'border-red-300' : 'border-gray-200'} focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  </div>
);

// Profile Image Component
const ProfileImage = ({ image, onChange }) => {
  const fileRef = useRef();

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <div className="w-28 h-28">
          {image ? (
            <img src={image} alt="Profile" className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg" />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center ring-4 ring-white shadow-lg">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          )}
          <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => onChange(reader.result);
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
      <p className="text-sm text-gray-500">Upload profile photo</p>
    </div>
  );
};

// Edit Profile Modal
const EditProfileModal = ({ isOpen, onClose, userData }) => {
  const { authData } = useAuth();  // Access authData from context
  const [formData, setFormData] = useState(userData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { updateProfile, isLoading: apiLoading,  } = useUpdateProfile();  // Custom hook for profile update

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Simple validation logic for required fields
    ['firstName', 'lastName', 'workRole', 'company'].forEach((field) => {
      if (!formData[field]?.trim()) newErrors[field] = `${field} is required`;
    });

    // Show errors if any field is invalid
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      if (authData?.accessToken) {
        const response = await updateProfile(formData, authData.accessToken);  // API call
        if (response) {
          console.log('Profile updated successfully:', response);
          onClose();  // Close the modal on success
        }
      } else {
        console.error('No access token available.');
        // Handle case where the access token is missing (e.g., redirect to login)
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ form: 'An error occurred while updating your profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;  // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Profile Image */}
            <ProfileImage image={formData.profileImage} onChange={(img) => setFormData((prev) => ({ ...prev, profileImage: img }))} />

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'firstName', label: 'First Name', icon: User },
                { name: 'middleName', label: 'Middle Name', icon: User },
                { name: 'lastName', label: 'Last Name', icon: User },
              ].map((field) => (
                <FormField
                  key={field.name}
                  {...field}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  error={errors[field.name]}
                  required={field.name !== 'middleName'}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'workRole', label: 'Work Role', icon: Briefcase },
                { name: 'company', label: 'Company', icon: Building2 },
                { name: 'email', label: 'Email', icon: Mail, disabled: true },
                { name: 'phone', label: 'Phone', icon: Phone },
                { name: 'createdAt', label: 'Member Since', icon: Calendar, disabled: true },
              ].map((field) => (
                <div key={field.name} className={field.span ? 'sm:col-span-2' : ''}>
                  <FormField
                    {...field}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    error={errors[field.name]}
                    disabled={field.disabled}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || apiLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300"
            >
              {isLoading || apiLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Display Form Errors */}
        {errors.form && <div className="text-center text-red-500 mt-4">{errors.form}</div>}
      </div>
    </div>
  );
};

export default EditProfileModal;
