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

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="container py-4">
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
            <ProtectedRoute allowedRoles={['PATIENT']}><PatientDashboard /></ProtectedRoute>
          } />

          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}
