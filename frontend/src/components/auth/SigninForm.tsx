import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Link from '@docusaurus/Link';

interface FormData {
  email: string;
  password: string;
}

const SigninForm: React.FC = () => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      await signIn(formData.email, formData.password);

      // Redirect to textbook intro page after successful sign in
      window.location.href = '/docs/intro';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container signin-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">
          Welcome Back
        </h2>
        <p className="auth-form-subtitle">
          Please enter your credentials to sign in
        </p>
      </div>

      {error && (
        <div className="auth-alert auth-alert--danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label htmlFor="email" className="auth-form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="auth-form-input"
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="password" className="auth-form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="auth-form-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`auth-form-button ${loading ? 'loading' : ''}`}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="auth-form-divider">
        <p>
          Don't have an account?{' '}
          <Link
            to="/auth/signup"
            className="auth-form-link"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;