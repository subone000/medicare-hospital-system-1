import React, { useContext, useEffect, useState } from 'react';
import API from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

export default function PatientDashboard() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ doctorUserId: '', dateTime: '' });
  const [msg, setMsg] = useState(null);

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
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchDoctors() {
  try {
    const res = await API.get('/patient/doctors');   // ✅ secured endpoint
    setDoctors(res.data);
  } catch (err) {
    console.error('Failed to load doctors', err);
    setDoctors([]);
  }
}

  async function fetchAppointments() {
    try {
      const res = await API.get('/patient/appointments');
      setAppointments(res.data);
    } catch (err) { console.error(err); }
  }

  async function updateProfile(e) {
    e.preventDefault();
    try {
      const res = await API.put('/patient/me', profile);
      setProfile(res.data);
      setMsg({ type: 'success', text: 'Profile saved' });
    } catch (err) { setMsg({ type: 'danger', text: 'Save failed' }); }
  }

  async function createAppointment(e) {
    e.preventDefault();
    if (!form.doctorUserId || !form.dateTime) { setMsg({ type: 'danger', text: 'Pick doctor & date' }); return; }
    try {
      await API.post('/patient/appointments', { doctorUserId: form.doctorUserId, dateTime: new Date(form.dateTime).toISOString() });
      setMsg({ type: 'success', text: 'Appointment requested' });
      setForm({ doctorUserId: '', dateTime: '' });
      fetchAppointments();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Request failed' });
    }
  }

  async function deleteAppointment(id) {
    if (!confirm('Delete this appointment?')) return;
    try {
      await API.delete(`/patient/appointments/${id}`);
      fetchAppointments();
    } catch (err) { setMsg({ type: 'danger', text: 'Delete failed' }); }
  }

  return (
    <div>
      <h2>Patient Dashboard</h2>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="row">
        <div className="col-md-5">
          <div className="card mb-3">
            <div className="card-body">
              <h5>Profile</h5>
              {!profile ? <p>Loading...</p> : (
                <form onSubmit={updateProfile}>
                  <div className="mb-2"><label className="form-label">Name</label>
                    <input className="form-control" value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="mb-2"><label className="form-label">Age</label>
                    <input type="number" className="form-control" value={profile.age || ''} onChange={e => setProfile({ ...profile, age: e.target.value })} />
                  </div>
                  <div className="mb-2"><label className="form-label">Gender</label>
                    <input className="form-control" value={profile.gender || ''} onChange={e => setProfile({ ...profile, gender: e.target.value })} />
                  </div>
                  <div className="mb-2"><label className="form-label">Medical History</label>
                    <textarea className="form-control" value={profile.medicalHistory || ''} onChange={e => setProfile({ ...profile, medicalHistory: e.target.value })} rows={3} />
                  </div>
                  <button className="btn btn-primary">Save</button>
                </form>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5>Request Appointment</h5>
              <form onSubmit={createAppointment}>
                <div className="mb-2">
                  <label className="form-label">Doctor</label>
                  <select className="form-select" value={form.doctorUserId} onChange={e => setForm({ ...form, doctorUserId: e.target.value })}>
                    <option value="">Select doctor</option>
                    {doctors.map(d => <option key={d.id} value={d.userId}>{d.name} — {d.specialization}</option>)}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Date & Time</label>
                  <input type="datetime-local" className="form-control" value={form.dateTime} onChange={e => setForm({ ...form, dateTime: e.target.value })} />
                </div>

                <button className="btn btn-success">Request</button>
                <small className="d-block mt-2 text-muted">If doctor list is empty, add a public GET /doctors endpoint to your backend (optional snippet below).</small>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h5>Your Appointments</h5>
              {appointments.length === 0 ? <p>No appointments yet.</p> : (
                <table className="table">
                  <thead><tr><th>Doctor</th><th>Date</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a.id}>
                        <td>{a.doctor?.name} ({a.doctor?.specialization})</td>
                        <td>{new Date(a.dateTime).toLocaleString()}</td>
                        <td>{a.status}</td>
                        <td><button className="btn btn-sm btn-danger" onClick={() => deleteAppointment(a.id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
