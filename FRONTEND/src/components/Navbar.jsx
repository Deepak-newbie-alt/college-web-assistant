import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-brand">
          <button aria-label="Toggle navigation" aria-expanded={isOpen} className="hamburger" onClick={toggleMenu}>☰</button>
        </div>

        <div className={`nav-left ${isOpen ? 'open' : ''}`}>
          <Link to="/notices" className="nav-link" onClick={closeMenu}>Notices</Link>

          {user && (user.role === 'admin' || user.role === 'teacher') && (
            <>
              <Link to="/create-notice" className="nav-link" onClick={closeMenu}>Create Notice</Link>
              <Link to="/leave-requests" className="nav-link" onClick={closeMenu}>Leave Requests</Link>
            </>
          )}
          {user && user.role === 'admin' && (
            <>
              <Link to="/create-schedule" className="nav-link" onClick={closeMenu}>Create Schedule</Link>
              <Link to="/edit-schedule" className="nav-link" onClick={closeMenu}>Edit Schedule</Link>
            </>
          )}
          <Link to="/schedule" className="nav-link" onClick={closeMenu}>View Schedule</Link>
        
         {user && user.role === 'student' && (
        <>
        <Link to="/apply-leave" className="nav-link" onClick={closeMenu}>Apply Leave</Link>
        <Link to="/my-leaves" className="nav-link" onClick={closeMenu}>My Leaves</Link>
        </>
          )}

        </div>

        <div className={`nav-right ${isOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <span className="nav-welcome">Hello, {user.name}</span>
              <button onClick={handleLogout} className="nav-logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="nav-link" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
