import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginRequest } from '../services/authService';
import { AuthContext } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setIsLoading(true);
    
    try {
      const data = await loginRequest(email, password, role);
      login(data.token, data.role);
      
      // Add success animation before navigation
      setTimeout(() => {
        if (data.role === 'ADMIN') navigate('/admin');
        else if (data.role === 'DOCTOR') navigate('/doctor');
        else navigate('/patient');
      }, 500);
      
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Main Login Card */}
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
                <path d="M19 13V7L17 9L15 7V13C15 14.1 14.1 15 13 15H11C9.9 15 9 14.1 9 13V11H7V13C7 15.21 8.79 17 11 17H13C15.21 17 17 15.21 17 13V11H15V13C15 13.55 14.55 14 14 14C13.45 14 13 13.55 13 13V9H11V13C11 13.55 10.55 14 10 14C9.45 14 9 13.55 9 13V9H7V13C7 14.1 6.1 15 5 15H3V17H5C7.21 17 9 15.21 9 13H11C11 15.21 12.79 17 15 17H17V15H15C13.9 15 13 14.1 13 13Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="logo-text">MediCare Pro</h1>
          </div>
          <p className="login-subtitle">Secure Medical Platform</p>
        </div>

        {/* Error Message */}
        {err && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {err}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <div className="input-container">
              <input
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder=" "
                required
              />
              <label className="form-label">Email Address</label>
              <span className="input-icon">📧</span>
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <input
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder=" "
                required
              />
              <label className="form-label">Password</label>
              <span className="input-icon">🔒</span>
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <select
                className="form-select"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
              >
                <option value=""> </option>
                <option value="ADMIN">Admin</option>
                <option value="DOCTOR">Doctor</option>
                <option value="PATIENT">Patient</option>
              </select>
              <label className="form-label">Select Role</label>
              <span className="input-icon">👤</span>
            </div>
          </div>

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="button-spinner"></div>
                Signing In...
              </>
            ) : (
              <>
                <span className="button-icon">→</span>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="login-footer">
          <p className="footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="footer-link">
              Register as Patient
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="decorative-elements">
        <div className="decorative-circle circle-1"></div>
        <div className="decorative-circle circle-2"></div>
        <div className="decorative-circle circle-3"></div>
      </div>
    </div>
  );
}