import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

interface FormData {
  software_level: string;
  hardware_background: string;
}

const ProfileForm: React.FC = () => {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    software_level: user?.background_profile?.software_level || '',
    hardware_background: user?.background_profile?.hardware_background || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update form data when user changes
  useEffect(() => {
    if (user?.background_profile) {
      setFormData({
        software_level: user.background_profile.software_level || '',
        hardware_background: user.background_profile.hardware_background || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserProfile(
        formData.software_level,
        formData.hardware_background
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Please sign in to view your profile</h3>
      </div>
    );
  }

  return (
    <div className="auth-form-container profile-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">
          Update Your Profile
        </h2>
        <p className="auth-form-subtitle">
          Adjust your background information to customize your learning experience
        </p>
      </div>

      {error && (
        <div className="auth-alert auth-alert--danger">
          {error}
        </div>
      )}

      {success && (
        <div className="auth-alert auth-alert--success">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label htmlFor="software_level" className="auth-form-label">
            Your Software Experience Level
          </label>
          <select
            id="software_level"
            name="software_level"
            value={formData.software_level}
            onChange={handleChange}
            disabled={loading}
            className="auth-form-select"
          >
            <option value="">Select your level</option>
            <option value="beginner">Beginner - Just starting out</option>
            <option value="intermediate">Intermediate - Some experience</option>
            <option value="advanced">Advanced - Experienced developer</option>
          </select>
          <small className="auth-form-helper">
            This helps us tailor explanations to your level
          </small>
        </div>

        <div className="auth-form-group">
          <label htmlFor="hardware_background" className="auth-form-label">
            Your Hardware Experience
          </label>
          <select
            id="hardware_background"
            name="hardware_background"
            value={formData.hardware_background}
            onChange={handleChange}
            disabled={loading}
            className="auth-form-select"
          >
            <option value="">Select your background</option>
            <option value="robotics">Robotics</option>
            <option value="embedded systems">Embedded Systems</option>
            <option value="none">No Hardware Experience</option>
            <option value="other">Other</option>
          </select>
          <small className="auth-form-helper">
            This helps us customize examples and content for your background
          </small>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`auth-form-button ${loading ? 'loading' : ''}`}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Updating Profile...
            </>
          ) : (
            'Update Profile'
          )}
        </button>
      </form>

      <div className="profile-info-section">
        <h3 className="profile-info-title">
          Current Profile Information
        </h3>
        <div className="profile-info-card">
          <p className="profile-info-item"><strong className="profile-info-label">Email:</strong> <span className="profile-info-value">{user.email}</span></p>
          <p className="profile-info-item"><strong className="profile-info-label">Software Level:</strong> <span className="profile-info-value">{user.background_profile?.software_level || 'Not set'}</span></p>
          <p className="profile-info-item"><strong className="profile-info-label">Hardware Background:</strong> <span className="profile-info-value">{user.background_profile?.hardware_background || 'Not set'}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;