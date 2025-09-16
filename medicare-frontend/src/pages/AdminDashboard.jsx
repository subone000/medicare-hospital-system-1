import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newDoc, setNewDoc] = useState({ email: '', password: '', name: '', specialization: '' });
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const [dRes, pRes, aRes] = await Promise.all([
        API.get('/admin/doctors'),
        API.get('/admin/patients'),
        API.get('/admin/appointments'),
      ]);
      setDoctors(dRes.data);
      setPatients(pRes.data);
      setAppointments(aRes.data);
    } catch (err) { console.error(err); }
  }

  async function createDoctor(e) {
    e.preventDefault();
    try {
      await API.post('/admin/doctors', newDoc);
      setMsg({ type: 'success', text: 'Doctor added' });
      setNewDoc({ email: '', password: '', name: '', specialization: '' });
      fetchAll();
    } catch (err) { setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed' }); }
  }

  async function deleteDoctor(userId) {
    if (!confirm('Delete doctor?')) return;
    await API.delete(`/admin/doctors/${userId}`);
    fetchAll();
  }

  async function deletePatient(userId) {
    if (!confirm('Delete patient?')) return;
    await API.delete(`/admin/patients/${userId}`);
    fetchAll();
  }

  async function deleteAppointment(id) {
    if (!confirm('Delete appointment?')) return;
    await API.delete(`/admin/appointments/${id}`);
    fetchAll();
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="row">
        <div className="col-md-5">
          <div className="card mb-3">
            <div className="card-body">
              <h5>Create Doctor</h5>
              <form onSubmit={createDoctor}>
                <div className="mb-2"><input className="form-control" placeholder="Email" value={newDoc.email} onChange={e => setNewDoc({ ...newDoc, email: e.target.value })} required /></div>
                <div className="mb-2"><input className="form-control" placeholder="Password" value={newDoc.password} onChange={e => setNewDoc({ ...newDoc, password: e.target.value })} required /></div>
                <div className="mb-2"><input className="form-control" placeholder="Name" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} /></div>
                <div className="mb-2"><input className="form-control" placeholder="Specialization" value={newDoc.specialization} onChange={e => setNewDoc({ ...newDoc, specialization: e.target.value })} /></div>
                <button className="btn btn-primary">Add Doctor</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card mb-3">
            <div className="card-body">
              <h5>Doctors</h5>
              <table className="table">
                <thead><tr><th>Name</th><th>Specialization</th><th>Email</th><th></th></tr></thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>{d.specialization}</td>
                      <td>{d.user?.email}</td>
                      <td><button className="btn btn-sm btn-danger" onClick={() => deleteDoctor(d.userId)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5>Patients</h5>
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Age</th><th></th></tr></thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.user?.email}</td>
                      <td>{p.age}</td>
                      <td><button className="btn btn-sm btn-danger" onClick={() => deletePatient(p.userId)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5>Appointments</h5>
              <table className="table">
                <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td>{a.patient?.name}</td>
                      <td>{a.doctor?.name}</td>
                      <td>{new Date(a.dateTime).toLocaleString()}</td>
                      <td>{a.status}</td>
                      <td><button className="btn btn-sm btn-danger" onClick={() => deleteAppointment(a.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
