import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => { 
    logout(); 
    navigate('/login'); 
    setIsMenuOpen(false);
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavLinkClass = (path) => {
    return `nav-link ${location.pathname === path ? 'nav-link-active' : ''}`;
  };

  return (
    <nav className={`apple-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Brand Logo */}
        <Link className="nav-brand" to="/">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
                <path d="M19 13V7L17 9L15 7V13C15 14.1 14.1 15 13 15H11C9.9 15 9 14.1 9 13V11H7V13C7 15.21 8.79 17 11 17H13C15.21 17 17 15.21 17 13V11H15V13C15 13.55 14.55 14 14 14C13.45 14 13 13.55 13 13V9H11V13C11 13.55 10.55 14 10 14C9.45 14 9 13.55 9 13V9H7V13C7 14.1 6.1 15 5 15H3V17H5C7.21 17 9 15.21 9 13H11C11 15.21 12.79 17 15 17H17V15H15C13.9 15 13 14.1 13 13Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="brand-text">MediCare Pro</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
          <div className="nav-links">
            {user?.token && user.role === 'PATIENT' && (
              <Link className={getNavLinkClass('/patient')} to="/patient">
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
            )}
            {user?.token && user.role === 'DOCTOR' && (
              <Link className={getNavLinkClass('/doctor')} to="/doctor">
                <span className="nav-icon">👨‍⚕️</span>
                Dashboard
              </Link>
            )}
            {user?.token && user.role === 'ADMIN' && (
              <Link className={getNavLinkClass('/admin')} to="/admin">
                <span className="nav-icon">⚙️</span>
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="nav-auth">
            {!user?.token ? (
              <div className="auth-buttons">
                <Link 
                  className="btn-auth btn-auth-outline" 
                  to="/login"
                >
                  <span className="btn-icon">🔐</span>
                  Login
                </Link>
                <Link 
                  className="btn-auth btn-auth-primary" 
                  to="/register"
                >
                  <span className="btn-icon">👤</span>
                  Patient Register
                </Link>
              </div>
            ) : (
              <div className="user-section">
                <div className="user-info">
                  <span className="user-role">{user.role.toLowerCase()}</span>
                </div>
                <button 
                  className="btn-auth btn-auth-logout" 
                  onClick={handleLogout}
                >
                  <span className="btn-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`nav-toggle ${isMenuOpen ? 'nav-toggle-open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="nav-overlay" onClick={toggleMenu}></div>
        )}
      </div>
    </nav>
  );
}