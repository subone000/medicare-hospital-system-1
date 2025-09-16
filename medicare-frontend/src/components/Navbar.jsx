import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">MediCare Pro</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            {user?.token && user.role === 'PATIENT' && <li className="nav-item"><Link className="nav-link" to="/patient">Dashboard</Link></li>}
            {user?.token && user.role === 'DOCTOR' && <li className="nav-item"><Link className="nav-link" to="/doctor">Dashboard</Link></li>}
            {user?.token && user.role === 'ADMIN' && <li className="nav-item"><Link className="nav-link" to="/admin">Dashboard</Link></li>}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!user?.token ? (
              <>
                <li className="nav-item me-2"><Link className="btn btn-outline-light" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="btn btn-light" to="/register">Patient Register</Link></li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-light" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
