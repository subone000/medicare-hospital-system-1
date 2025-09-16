import React, { useState } from 'react';
import { registerPatientRequest } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function RegisterPatient() {
  const [form, setForm] = useState({ email:'', password:'', name:'', age:'', gender:'', medicalHistory:'' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const update = (k,v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await registerPatientRequest({
        email: form.email,
        password: form.password,
        name: form.name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        medicalHistory: form.medicalHistory
      });
      setMsg({ type: 'success', text: 'Registered — please log in' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2>Patient Registration</h2>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <form onSubmit={submit}>
          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" value={form.email} onChange={e => update('email', e.target.value)} type="email" required />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label">Password</label>
              <input className="form-control" value={form.password} onChange={e => update('password', e.target.value)} type="password" minLength={6} required />
            </div>
          </div>

          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control" value={form.name} onChange={e => update('name', e.target.value)} required />
            </div>
            <div className="mb-3 col-md-3">
              <label className="form-label">Age</label>
              <input className="form-control" value={form.age} onChange={e => update('age', e.target.value)} type="number" />
            </div>
            <div className="mb-3 col-md-3">
              <label className="form-label">Gender</label>
              <select className="form-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Medical History</label>
            <textarea className="form-control" value={form.medicalHistory} onChange={e => update('medicalHistory', e.target.value)} rows={3} />
          </div>

          <button className="btn btn-success">Register</button>
        </form>
      </div>
    </div>
  );
}
