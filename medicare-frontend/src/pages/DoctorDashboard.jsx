import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetch(); }, [filter]);

  async function fetch() {
    try {
      const res = await API.get(`/doctor/appointments?status=${filter}`);
      setAppointments(res.data);
    } catch (err) { console.error(err); }
  }

  async function decide(id, action) {
    try {
      await API.patch(`/doctor/appointments/${id}`, { action });
      setMsg({ type: 'success', text: `Appointment ${action}ed` });
      fetch();
    } catch (err) {
      setMsg({ type: 'danger', text: 'Operation failed' });
    }
  }

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="mb-3">
        <label className="form-label me-2">Filter</label>
        <select className="form-select d-inline-block w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {appointments.length === 0 ? <p>No appointments found.</p> : (
        <div className="list-group">
          {appointments.map(a => (
            <div key={a.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{a.patient?.name}</strong> — {new Date(a.dateTime).toLocaleString()}
                  <div className="small text-muted">History: {a.patient?.medicalHistory || '—'}</div>
                </div>
                <div>
                  {a.status === 'PENDING' ? (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={() => decide(a.id, 'accept')}>Accept</button>
                      <button className="btn btn-sm btn-danger" onClick={() => decide(a.id, 'reject')}>Reject</button>
                    </>
                  ) : (
                    <span className={`badge ${a.status === 'ACCEPTED' ? 'bg-success' : 'bg-danger'}`}>{a.status}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
