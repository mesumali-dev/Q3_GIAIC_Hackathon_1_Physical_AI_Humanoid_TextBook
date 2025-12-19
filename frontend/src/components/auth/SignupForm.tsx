import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Link from '@docusaurus/Link';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  software_level: string;
  hardware_background: string;
}

const SignupForm: React.FC = () => {
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<FormData>({ email: '', password: '', confirmPassword: '', software_level: '', hardware_background: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.software_level || !formData.hardware_background) {
      setError('Please select your experience levels');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp(formData.email, formData.password, formData.software_level, formData.hardware_background);

      // Redirect to textbook intro page after successful sign up
      window.location.href = '/docs/intro';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-form-container signup-form-container">
        <div className="auth-form-header">
          <h2 className="auth-form-title">Create Your Account</h2>
          <p className="auth-form-subtitle">Join to access personalized content and features</p>
        </div>

        {error && <div className="auth-alert auth-alert--danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-form-label">Email Address</label>
            <input type="email" name="email" required disabled={loading} value={formData.email} onChange={handleChange} autoComplete="email" className="auth-form-input" />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Password</label>
            <input type="password" name="password" required disabled={loading} value={formData.password} onChange={handleChange} autoComplete="new-password" className="auth-form-input" />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" required disabled={loading} value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" className="auth-form-input" />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Software Experience Level</label>
            <select name="software_level" required disabled={loading} value={formData.software_level} onChange={handleChange} className="auth-form-select">
              <option value="">Select your level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Hardware Experience</label>
            <select name="hardware_background" required disabled={loading} value={formData.hardware_background} onChange={handleChange} className="auth-form-select">
              <option value="">Select your background</option>
              <option value="robotics">Robotics</option>
              <option value="embedded systems">Embedded Systems</option>
              <option value="none">No Hardware Experience</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className={`auth-form-button ${loading ? 'loading' : ''}`}>{loading ? 'Creating Account...' : 'Sign Up'}</button>
        </form>

        <div className="auth-form-divider">
          Already have an account? <Link to="/auth/signin" className="auth-form-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
