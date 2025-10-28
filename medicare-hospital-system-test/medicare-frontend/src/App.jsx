import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import RegisterPatient from './pages/RegisterPatient';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './contexts/AuthContext';
import './styles/App.css';

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="apple-tv-app">
      <Navbar />
      <main className="apple-tv-main">
        <div className="content-container">
          <Routes>
            <Route
              path="/"
              element={
                user?.token
                  ? user.role === 'ADMIN'
                    ? <Navigate to="/admin" />
                    : user.role === 'DOCTOR'
                      ? <Navigate to="/doctor" />
                      : <Navigate to="/patient" />
                  : <Navigate to="/login" />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPatient />} />

            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <PatientDashboard />
              </ProtectedRoute>
            } />

            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </main>
      
      {/* Apple TV-style background effects */}
      <div className="background-effects">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>
    </div>
  );
}