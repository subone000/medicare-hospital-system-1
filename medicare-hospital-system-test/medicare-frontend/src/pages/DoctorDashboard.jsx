import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './DoctorDashboard.css';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => { 
    fetch(); 
    calculateStats();
  }, [filter]);

  useEffect(() => {
    calculateStats();
  }, [appointments]);

  async function fetch() {
    setIsLoading(true);
    try {
      const res = await API.get(`/doctor/appointments?status=${filter}`);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to load appointments' });
    } finally {
      setIsLoading(false);
    }
  }

  function calculateStats() {
    const pending = appointments.filter(a => a.status === 'PENDING').length;
    const accepted = appointments.filter(a => a.status === 'ACCEPTED').length;
    const rejected = appointments.filter(a => a.status === 'REJECTED').length;
    
    setStats({
      pending,
      accepted,
      rejected,
      total: appointments.length
    });
  }

  async function decide(id, action) {
    try {
      await API.patch(`/doctor/appointments/${id}`, { action });
      setMsg({ type: 'success', text: `Appointment ${action === 'accept' ? 'accepted' : 'rejected'} successfully` });
      fetch();
      setTimeout(() => setMsg(null), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Operation failed. Please try again.' });
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return '⏳';
      case 'ACCEPTED': return '✅';
      case 'REJECTED': return '❌';
      default: return '📅';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'status-pending';
      case 'ACCEPTED': return 'status-accepted';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-default';
    }
  };

  return (
    <div className="doctor-dashboard">
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
                Doctor <span className="accent-text">Dashboard</span>
              </h1>
              <p className="welcome-subtitle">Manage patient appointments and provide care</p>
            </div>
            <div className="header-stats">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.pending}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-number">{stats.accepted}</div>
                  <div className="stat-label">Accepted</div>
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

        {/* Filter Card */}
        <div className="dashboard-card filter-card">
          <div className="card-header">
            <h3 className="card-title">Appointment Filter</h3>
            <span className="card-icon">🔍</span>
          </div>
          <div className="card-content">
            <div className="filter-controls">
              <div className="filter-group">
                <label className="filter-label">Show Appointments</label>
                <select
                  className="filter-select"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                >
                  <option value="">All Appointments</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="filter-badges">
                <button 
                  className={`filter-badge ${filter === '' ? 'active' : ''}`}
                  onClick={() => setFilter('')}
                >
                  All ({stats.total})
                </button>
                <button 
                  className={`filter-badge ${filter === 'PENDING' ? 'active' : ''}`}
                  onClick={() => setFilter('PENDING')}
                >
                  Pending ({stats.pending})
                </button>
                <button 
                  className={`filter-badge ${filter === 'ACCEPTED' ? 'active' : ''}`}
                  onClick={() => setFilter('ACCEPTED')}
                >
                  Accepted ({stats.accepted})
                </button>
                <button 
                  className={`filter-badge ${filter === 'REJECTED' ? 'active' : ''}`}
                  onClick={() => setFilter('REJECTED')}
                >
                  Rejected ({stats.rejected})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="dashboard-card appointments-card">
          <div className="card-header">
            <h3 className="card-title">
              {filter ? `${filter.charAt(0) + filter.slice(1).toLowerCase()} Appointments` : 'All Appointments'}
              <span className="appointments-count">({appointments.length})</span>
            </h3>
            <span className="card-icon">📋</span>
          </div>
          <div className="card-content">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🩺</div>
                <h4>No appointments found</h4>
                <p>There are no {filter.toLowerCase() || ''} appointments matching your current filter.</p>
                {filter && (
                  <button 
                    className="clear-filter-button"
                    onClick={() => setFilter('')}
                  >
                    Show All Appointments
                  </button>
                )}
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-header">
                      <div className="patient-info">
                        <div className="patient-name">
                          {appointment.patient?.name || 'Unknown Patient'}
                        </div>
                        <div className="appointment-time">
                          {new Date(appointment.dateTime).toLocaleString()}
                        </div>
                      </div>
                      <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
                        <span className="status-icon">{getStatusIcon(appointment.status)}</span>
                        {appointment.status}
                      </div>
                    </div>
                    
                    <div className="appointment-details">
                      {appointment.patient?.medicalHistory && (
                        <div className="medical-history">
                          <label>Medical History:</label>
                          <p>{appointment.patient.medicalHistory}</p>
                        </div>
                      )}
                      
                      {appointment.patient?.age && appointment.patient?.gender && (
                        <div className="patient-demographics">
                          <span className="demographic-item">
                            <strong>Age:</strong> {appointment.patient.age}
                          </span>
                          <span className="demographic-item">
                            <strong>Gender:</strong> {appointment.patient.gender}
                          </span>
                        </div>
                      )}
                    </div>

                    {appointment.status === 'PENDING' && (
                      <div className="appointment-actions">
                        <button
                          className="action-button accept-button"
                          onClick={() => decide(appointment.id, 'accept')}
                        >
                          <span className="button-icon">✓</span>
                          Accept Appointment
                        </button>
                        <button
                          className="action-button reject-button"
                          onClick={() => decide(appointment.id, 'reject')}
                        >
                          <span className="button-icon">✕</span>
                          Reject Appointment
                        </button>
                      </div>
                    )}

                    {appointment.status !== 'PENDING' && (
                      <div className="appointment-meta">
                        <div className="meta-item">
                          <span className="meta-label">Decision:</span>
                          <span className={`meta-value ${appointment.status === 'ACCEPTED' ? 'accepted' : 'rejected'}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Awaiting Review</div>
            <div className="stat-icon">⏳</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.accepted}</div>
            <div className="stat-label">Confirmed</div>
            <div className="stat-icon">✅</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Declined</div>
            <div className="stat-icon">❌</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total</div>
            <div className="stat-icon">📊</div>
          </div>
        </div>
      </div>
    </div>
  );
}