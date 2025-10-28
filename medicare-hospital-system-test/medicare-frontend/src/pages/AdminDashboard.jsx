import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newDoc, setNewDoc] = useState({ email: '', password: '', name: '', specialization: '' });
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });

  useEffect(() => { 
    fetchAll(); 
  }, []);

  useEffect(() => {
    calculateStats();
  }, [doctors, patients, appointments]);

  async function fetchAll() {
    setIsLoading(true);
    try {
      const [dRes, pRes, aRes] = await Promise.all([
        API.get('/admin/doctors'),
        API.get('/admin/patients'),
        API.get('/admin/appointments'),
      ]);
      setDoctors(dRes.data);
      setPatients(pRes.data);
      setAppointments(aRes.data);
    } catch (err) { 
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to load data' });
    } finally {
      setIsLoading(false);
    }
  }

  function calculateStats() {
    setStats({
      totalDoctors: doctors.length,
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter(a => a.status === 'PENDING').length
    });
  }

  async function createDoctor(e) {
    e.preventDefault();
    try {
      await API.post('/admin/doctors', newDoc);
      setMsg({ type: 'success', text: 'Doctor account created successfully' });
      setNewDoc({ email: '', password: '', name: '', specialization: '' });
      fetchAll();
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create doctor account' });
    }
  }

  async function deleteDoctor(userId) {
    if (!window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return;
    try {
      await API.delete(`/admin/doctors/${userId}`);
      setMsg({ type: 'success', text: 'Doctor deleted successfully' });
      fetchAll();
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete doctor' });
    }
  }

  async function deletePatient(userId) {
    if (!window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) return;
    try {
      await API.delete(`/admin/patients/${userId}`);
      setMsg({ type: 'success', text: 'Patient deleted successfully' });
      fetchAll();
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete patient' });
    }
  }

  async function deleteAppointment(id) {
    if (!window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) return;
    try {
      await API.delete(`/admin/appointments/${id}`);
      setMsg({ type: 'success', text: 'Appointment deleted successfully' });
      fetchAll();
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete appointment' });
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { class: 'status-pending', label: 'Pending' },
      'ACCEPTED': { class: 'status-accepted', label: 'Accepted' },
      'REJECTED': { class: 'status-rejected', label: 'Rejected' },
      'COMPLETED': { class: 'status-completed', label: 'Completed' }
    };
    
    const config = statusConfig[status] || { class: 'status-pending', label: status };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="admin-dashboard">
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
                Admin <span className="accent-text">Dashboard</span>
              </h1>
              <p className="welcome-subtitle">Manage your healthcare platform efficiently</p>
            </div>
            <div className="header-stats">
              <div className="stat-card">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalDoctors}</div>
                  <div className="stat-label">Doctors</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalPatients}</div>
                  <div className="stat-label">Patients</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.totalAppointments}</div>
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
            className={`tab-button ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <span className="tab-icon">👨‍⚕️</span>
            Doctors
          </button>
          <button 
            className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <span className="tab-icon">👥</span>
            Patients
          </button>
          <button 
            className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <span className="tab-icon">📅</span>
            Appointments
          </button>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-grid">
              {/* Quick Stats */}
              <div className="dashboard-card stats-card">
                <div className="card-header">
                  <h3 className="card-title">Platform Overview</h3>
                  <span className="card-icon">📈</span>
                </div>
                <div className="card-content">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value">{stats.totalDoctors}</div>
                      <div className="stat-label">Total Doctors</div>
                      <div className="stat-icon">👨‍⚕️</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{stats.totalPatients}</div>
                      <div className="stat-label">Total Patients</div>
                      <div className="stat-icon">👥</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{stats.totalAppointments}</div>
                      <div className="stat-label">Total Appointments</div>
                      <div className="stat-icon">📅</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{stats.pendingAppointments}</div>
                      <div className="stat-label">Pending Reviews</div>
                      <div className="stat-icon">⏳</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-card actions-card">
                <div className="card-header">
                  <h3 className="card-title">Quick Actions</h3>
                  <span className="card-icon">⚡</span>
                </div>
                <div className="card-content">
                  <div className="actions-grid">
                    <button 
                      className="action-button primary"
                      onClick={() => setActiveTab('doctors')}
                    >
                      <span className="action-icon">➕</span>
                      Add New Doctor
                    </button>
                    <button 
                      className="action-button secondary"
                      onClick={() => setActiveTab('patients')}
                    >
                      <span className="action-icon">👁️</span>
                      View Patients
                    </button>
                    <button 
                      className="action-button secondary"
                      onClick={() => setActiveTab('appointments')}
                    >
                      <span className="action-icon">📋</span>
                      Manage Appointments
                    </button>
                    <button 
                      className="action-button tertiary"
                      onClick={fetchAll}
                    >
                      <span className="action-icon">🔄</span>
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="dashboard-card activity-card">
                <div className="card-header">
                  <h3 className="card-title">Recent Activity</h3>
                  <span className="card-icon">🕒</span>
                </div>
                <div className="card-content">
                  {isLoading ? (
                    <div className="loading-skeleton">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line"></div>
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">📅</span>
                      <p>No recent activity</p>
                    </div>
                  ) : (
                    <div className="activity-list">
                      {appointments.slice(0, 5).map(appointment => (
                        <div key={appointment.id} className="activity-item">
                          <div className="activity-icon">📅</div>
                          <div className="activity-details">
                            <div className="activity-title">
                              {appointment.patient?.name} → Dr. {appointment.doctor?.name}
                            </div>
                            <div className="activity-meta">
                              {new Date(appointment.dateTime).toLocaleDateString()} • 
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="tab-content">
              {/* Add Doctor Card */}
              <div className="dashboard-card create-doctor-card">
                <div className="card-header">
                  <h3 className="card-title">Create New Doctor</h3>
                  <span className="card-icon">👨‍⚕️</span>
                </div>
                <div className="card-content">
                  <form onSubmit={createDoctor} className="doctor-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                          className="form-input"
                          type="email"
                          placeholder="doctor@example.com"
                          value={newDoc.email}
                          onChange={e => setNewDoc({ ...newDoc, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                          className="form-input"
                          type="password"
                          placeholder="Secure password"
                          value={newDoc.password}
                          onChange={e => setNewDoc({ ...newDoc, password: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                          className="form-input"
                          placeholder="Dr. John Smith"
                          value={newDoc.name}
                          onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Specialization</label>
                        <input 
                          className="form-input"
                          placeholder="Cardiology, Neurology, etc."
                          value={newDoc.specialization}
                          onChange={e => setNewDoc({ ...newDoc, specialization: e.target.value })}
                        />
                      </div>
                    </div>
                    <button type="submit" className="create-doctor-button">
                      <span className="button-icon">➕</span>
                      Create Doctor Account
                    </button>
                  </form>
                </div>
              </div>

              {/* Doctors List */}
              <div className="dashboard-card doctors-list-card">
                <div className="card-header">
                  <h3 className="card-title">
                    Medical Staff
                    <span className="items-count">({doctors.length})</span>
                  </h3>
                  <span className="card-icon">📋</span>
                </div>
                <div className="card-content">
                  {isLoading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Loading doctors...</p>
                    </div>
                  ) : doctors.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">👨‍⚕️</span>
                      <h4>No doctors registered</h4>
                      <p>Add your first doctor to get started</p>
                    </div>
                  ) : (
                    <div className="doctors-grid">
                      {doctors.map(doctor => (
                        <div key={doctor.id} className="doctor-card">
                          <div className="doctor-avatar">
                            {doctor.name ? doctor.name.charAt(0).toUpperCase() : 'D'}
                          </div>
                          <div className="doctor-info">
                            <div className="doctor-name">{doctor.name || 'Unnamed Doctor'}</div>
                            <div className="doctor-specialization">{doctor.specialization || 'General'}</div>
                            <div className="doctor-email">{doctor.user?.email}</div>
                          </div>
                          <button
                            className="delete-doctor-button"
                            onClick={() => deleteDoctor(doctor.userId)}
                            title="Delete doctor"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="dashboard-card patients-card">
              <div className="card-header">
                <h3 className="card-title">
                  Patient Records
                  <span className="items-count">({patients.length})</span>
                </h3>
                <span className="card-icon">👥</span>
              </div>
              <div className="card-content">
                {isLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading patients...</p>
                  </div>
                ) : patients.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">👥</span>
                    <h4>No patients registered</h4>
                    <p>Patients will appear here once they register</p>
                  </div>
                ) : (
                  <div className="patients-table">
                    {patients.map(patient => (
                      <div key={patient.id} className="patient-row">
                        <div className="patient-info">
                          <div className="patient-avatar">
                            {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div className="patient-details">
                            <div className="patient-name">{patient.name || 'Unnamed Patient'}</div>
                            <div className="patient-email">{patient.user?.email}</div>
                            <div className="patient-meta">
                              {patient.age && <span>Age: {patient.age}</span>}
                              {patient.gender && <span>Gender: {patient.gender}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="patient-actions">
                          <button
                            className="delete-patient-button"
                            onClick={() => deletePatient(patient.userId)}
                            title="Delete patient"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="dashboard-card appointments-card">
              <div className="card-header">
                <h3 className="card-title">
                  All Appointments
                  <span className="items-count">({appointments.length})</span>
                </h3>
                <span className="card-icon">📅</span>
              </div>
              <div className="card-content">
                {isLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading appointments...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📅</span>
                    <h4>No appointments scheduled</h4>
                    <p>Appointments will appear here once created</p>
                  </div>
                ) : (
                  <div className="appointments-table">
                    {appointments.map(appointment => (
                      <div key={appointment.id} className="appointment-row">
                        <div className="appointment-info">
                          <div className="appointment-parties">
                            <div className="appointment-patient">
                              <strong>Patient:</strong> {appointment.patient?.name || 'Unknown'}
                            </div>
                            <div className="appointment-doctor">
                              <strong>Doctor:</strong> Dr. {appointment.doctor?.name || 'Unknown'}
                            </div>
                          </div>
                          <div className="appointment-details">
                            <div className="appointment-date">
                              {new Date(appointment.dateTime).toLocaleString()}
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                        </div>
                        <div className="appointment-actions">
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
          )}
        </div>
      </div>
    </div>
  );
}