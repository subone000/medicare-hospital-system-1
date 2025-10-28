import React, { useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ doctorUserId: '', dateTime: '' });
  const [msg, setMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState({
    profile: true,
    doctors: true,
    appointments: true
  });

  useEffect(() => {
    if (!user?.token) return;
    fetchProfile();
    fetchAppointments();
    fetchDoctors();
  }, [user]);

  async function fetchProfile() {
    try {
      const res = await API.get('/patient/me');
      setProfile(res.data);
      setIsLoading(prev => ({ ...prev, profile: false }));
    } catch (err) {
      console.error(err);
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  }

  async function fetchDoctors() {
    try {
      const res = await API.get('/patient/doctors');
      setDoctors(res.data);
      setIsLoading(prev => ({ ...prev, doctors: false }));
    } catch (err) {
      console.error('Failed to load doctors', err);
      setDoctors([]);
      setIsLoading(prev => ({ ...prev, doctors: false }));
    }
  }

  async function fetchAppointments() {
    try {
      const res = await API.get('/patient/appointments');
      setAppointments(res.data);
      setIsLoading(prev => ({ ...prev, appointments: false }));
    } catch (err) {
      console.error(err);
      setIsLoading(prev => ({ ...prev, appointments: false }));
    }
  }

  async function updateProfile(e) {
    e.preventDefault();
    try {
      const res = await API.put('/patient/me', profile);
      setProfile(res.data);
      setMsg({ type: 'success', text: 'Profile updated successfully' });
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update profile' });
    }
  }

  async function createAppointment(e) {
    e.preventDefault();
    if (!form.doctorUserId || !form.dateTime) {
      setMsg({ type: 'error', text: 'Please select a doctor and date/time' });
      return;
    }
    try {
      await API.post('/patient/appointments', {
        doctorUserId: form.doctorUserId,
        dateTime: new Date(form.dateTime).toISOString()
      });
      setMsg({ type: 'success', text: 'Appointment requested successfully' });
      setForm({ doctorUserId: '', dateTime: '' });
      fetchAppointments();
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create appointment' });
    }
  }

  async function deleteAppointment(id) {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await API.delete(`/patient/appointments/${id}`);
      setMsg({ type: 'success', text: 'Appointment deleted successfully' });
      fetchAppointments();
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete appointment' });
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { class: 'status-pending', label: 'Pending' },
      'ACCEPTED': { class: 'status-accepted', label: 'Accepted' },
      'COMPLETED': { class: 'status-completed', label: 'Completed' },
      'CANCELLED': { class: 'status-cancelled', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'status-pending', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="patient-dashboard">
      {/* Animated Background */}
      <div className="dashboard-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="welcome-title">
                Welcome back, <span className="patient-name">{profile?.name || 'Patient'}</span>
              </h1>
              <p className="welcome-subtitle">Manage your health journey with ease</p>
            </div>
            <div className="header-stats">
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <div className="stat-number">{appointments.length}</div>
                  <div className="stat-label">Appointments</div>
                </div>
              </div>
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

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-icon">📊</span>
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="tab-icon">👤</span>
            Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <span className="tab-icon">🕐</span>
            Appointments
          </button>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-grid">
              {/* Profile Card */}
              <div className="dashboard-card profile-card">
                <div className="card-header">
                  <h3 className="card-title">Your Profile</h3>
                  <span className="card-icon">👤</span>
                </div>
                <div className="card-content">
                  {isLoading.profile ? (
                    <div className="loading-skeleton">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line"></div>
                    </div>
                  ) : profile ? (
                    <div className="profile-info">
                      <div className="info-item">
                        <label>Name</label>
                        <span>{profile.name || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <label>Age</label>
                        <span>{profile.age || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <label>Gender</label>
                        <span>{profile.gender || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <label>Medical History</label>
                        <span className="medical-history">{profile.medicalHistory || 'No medical history recorded'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="error-state">Failed to load profile</div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-card actions-card">
                <div className="card-header">
                  <h3 className="card-title">Quick Actions</h3>
                  <span className="card-icon">⚡</span>
                </div>
                <div className="card-content">
                  <button 
                    className="action-button primary"
                    onClick={() => setActiveTab('appointments')}
                  >
                    <span className="action-icon">📅</span>
                    Book Appointment
                  </button>
                  <button 
                    className="action-button secondary"
                    onClick={() => setActiveTab('profile')}
                  >
                    <span className="action-icon">✏️</span>
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="dashboard-card appointments-preview">
                <div className="card-header">
                  <h3 className="card-title">Recent Appointments</h3>
                  <span className="card-icon">🕐</span>
                </div>
                <div className="card-content">
                  {isLoading.appointments ? (
                    <div className="loading-skeleton">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line"></div>
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">📅</span>
                      <p>No appointments scheduled</p>
                      <button 
                        className="empty-action"
                        onClick={() => setActiveTab('appointments')}
                      >
                        Book Your First Appointment
                      </button>
                    </div>
                  ) : (
                    <div className="appointments-list">
                      {appointments.slice(0, 3).map(appointment => (
                        <div key={appointment.id} className="appointment-item">
                          <div className="appointment-info">
                            <div className="appointment-doctor">
                              {appointment.doctor?.name}
                            </div>
                            <div className="appointment-date">
                              {new Date(appointment.dateTime).toLocaleDateString()}
                            </div>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="dashboard-card profile-edit-card">
              <div className="card-header">
                <h3 className="card-title">Edit Profile</h3>
                <span className="card-icon">✏️</span>
              </div>
              <div className="card-content">
                {isLoading.profile ? (
                  <div className="loading-skeleton">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                  </div>
                ) : profile ? (
                  <form onSubmit={updateProfile} className="profile-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          className="form-input"
                          value={profile.name || ''}
                          onChange={e => setProfile({ ...profile, name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Age</label>
                        <input
                          type="number"
                          className="form-input"
                          value={profile.age || ''}
                          onChange={e => setProfile({ ...profile, age: e.target.value })}
                          placeholder="Enter your age"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-select"
                          value={profile.gender || ''}
                          onChange={e => setProfile({ ...profile, gender: e.target.value })}
                        >
                          <option value="">Select gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Medical History</label>
                      <textarea
                        className="form-textarea"
                        value={profile.medicalHistory || ''}
                        onChange={e => setProfile({ ...profile, medicalHistory: e.target.value })}
                        placeholder="Describe your medical history, conditions, or allergies"
                        rows={4}
                      />
                    </div>
                    <button type="submit" className="save-profile-button">
                      <span className="button-icon">💾</span>
                      Save Profile
                    </button>
                  </form>
                ) : (
                  <div className="error-state">Failed to load profile</div>
                )}
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="appointments-section">
              <div className="appointments-grid">
                {/* Book Appointment Card */}
                <div className="dashboard-card book-appointment-card">
                  <div className="card-header">
                    <h3 className="card-title">Book New Appointment</h3>
                    <span className="card-icon">📅</span>
                  </div>
                  <div className="card-content">
                    <form onSubmit={createAppointment} className="appointment-form">
                      <div className="form-group">
                        <label className="form-label">Select Doctor</label>
                        <select
                          className="form-select"
                          value={form.doctorUserId}
                          onChange={e => setForm({ ...form, doctorUserId: e.target.value })}
                        >
                          <option value="">Choose a doctor</option>
                          {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.userId}>
                              Dr. {doctor.name} — {doctor.specialization}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          value={form.dateTime}
                          onChange={e => setForm({ ...form, dateTime: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="book-appointment-button">
                        <span className="button-icon">✅</span>
                        Request Appointment
                      </button>
                    </form>
                  </div>
                </div>

                {/* Appointments List */}
                <div className="dashboard-card appointments-list-card">
                  <div className="card-header">
                    <h3 className="card-title">Your Appointments</h3>
                    <span className="card-icon">📋</span>
                  </div>
                  <div className="card-content">
                    {isLoading.appointments ? (
                      <div className="loading-skeleton">
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                      </div>
                    ) : appointments.length === 0 ? (
                      <div className="empty-state">
                        <span className="empty-icon">📅</span>
                        <p>No appointments scheduled yet</p>
                        <p className="empty-subtitle">Book your first appointment to get started</p>
                      </div>
                    ) : (
                      <div className="appointments-table">
                        {appointments.map(appointment => (
                          <div key={appointment.id} className="appointment-row">
                            <div className="appointment-details">
                              <div className="appointment-main">
                                <div className="doctor-name">
                                  Dr. {appointment.doctor?.name}
                                </div>
                                <div className="appointment-specialization">
                                  {appointment.doctor?.specialization}
                                </div>
                              </div>
                              <div className="appointment-meta">
                                <div className="appointment-date">
                                  {new Date(appointment.dateTime).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="appointment-actions">
                              {getStatusBadge(appointment.status)}
                              <button
                                className="delete-appointment-button"
                                onClick={() => deleteAppointment(appointment.id)}
                                title="Delete appointment"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}