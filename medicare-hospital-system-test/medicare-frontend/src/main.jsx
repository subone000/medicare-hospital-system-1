import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './styles/Global.css';    // CSS Variables & Base Styles
import './styles/App.css';       // Main App Layout
import './styles/Navbar.css';    // Navigation Styles
import './styles/Login.css';     // Login Page Styles
import './styles/RegisterPatient.css'; // Registration Styles
import './styles/PatientDashboard.css'; // Patient Dashboard
import './styles/DoctorDashboard.css'; // Doctor Dashboard  
import './styles/AdminDashboard.css'; // Admin Dashboard
// Remove Bootstrap since we're using custom Apple TV design
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);