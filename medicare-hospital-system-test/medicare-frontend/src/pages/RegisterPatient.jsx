import React, { useState } from 'react';
import { registerPatientRequest } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPatient.css';

export default function RegisterPatient() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    medicalHistory: ''
  });
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setIsLoading(true);
    
    try {
      await registerPatientRequest({
        email: form.email,
        password: form.password,
        name: form.name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        medicalHistory: form.medicalHistory
      });
      setMsg({ type: 'success', text: 'Registration successful! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Animated Background */}
      <div className="register-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Main Registration Card */}
      <div className="register-card">
        {/* Header Section */}
        <div className="register-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
                <path d="M19 13V7L17 9L15 7V13C15 14.1 14.1 15 13 15H11C9.9 15 9 14.1 9 13V11H7V13C7 15.21 8.79 17 11 17H13C15.21 17 17 15.21 17 13V11H15V13C15 13.55 14.55 14 14 14C13.45 14 13 13.55 13 13V9H11V13C11 13.55 10.55 14 10 14C9.45 14 9 13.55 9 13V9H7V13C7 14.1 6.1 15 5 15H3V17H5C7.21 17 9 15.21 9 13H11C11 15.21 12.79 17 15 17H17V15H15C13.9 15 13 14.1 13 13Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="header-text">
              <h1 className="register-title">Patient Registration</h1>
              <p className="register-subtitle">Join MediCare Pro for comprehensive healthcare</p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {msg && (
          <div className={`message-alert ${msg.type}`}>
            <span className="alert-icon">
              {msg.type === 'success' ? '✅' : '⚠️'}
            </span>
            {msg.text}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={submit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <div className="input-container">
                <input
                  className="form-input"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
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
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  type="password"
                  placeholder=" "
                  minLength={6}
                  required
                />
                <label className="form-label">Password</label>
                <span className="input-icon">🔒</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="input-container">
                <input
                  className="form-input"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder=" "
                  required
                />
                <label className="form-label">Full Name</label>
                <span className="input-icon">👤</span>
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <input
                  className="form-input"
                  value={form.age}
                  onChange={e => update('age', e.target.value)}
                  type="number"
                  placeholder=" "
                />
                <label className="form-label">Age</label>
                <span className="input-icon">🎂</span>
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <select
                  className="form-select"
                  value={form.gender}
                  onChange={e => update('gender', e.target.value)}
                >
                  <option value=""></option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
                <label className="form-label">Gender</label>
                <span className="input-icon">⚧</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-container textarea-container">
              <textarea
                className="form-textarea"
                value={form.medicalHistory}
                onChange={e => update('medicalHistory', e.target.value)}
                placeholder=" "
                rows={4}
              />
              <label className="form-label">Medical History</label>
              <span className="input-icon">📋</span>
            </div>
            <div className="input-help">Any known conditions, allergies, or previous treatments</div>
          </div>

          <button 
            type="submit" 
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="button-spinner"></div>
                Creating Account...
              </>
            ) : (
              <>
                <span className="button-icon">👤</span>
                Create Patient Account
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="register-footer">
          <p className="footer-text">
            Already have an account?{' '}
            <Link to="/login" className="footer-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Progress Steps (Visual Enhancement) */}
      <div className="progress-steps">
        <div className="step active">
          <div className="step-number">1</div>
          <div className="step-label">Personal Info</div>
        </div>
        <div className="step-connector"></div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-label">Medical Details</div>
        </div>
        <div className="step-connector"></div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-label">Complete</div>
        </div>
      </div>
    </div>
  );
}