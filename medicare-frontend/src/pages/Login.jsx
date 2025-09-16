import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/authService';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const data = await loginRequest(email, password, role);
      login(data.token, data.role);
      if (data.role === 'ADMIN') navigate('/admin');
      else if (data.role === 'DOCTOR') navigate('/doctor');
      else navigate('/patient');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>Login</h2>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select className="form-select" value={role} onChange={e => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="DOCTOR">Doctor</option>
              <option value="PATIENT">Patient</option>
            </select>
          </div>
          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}
