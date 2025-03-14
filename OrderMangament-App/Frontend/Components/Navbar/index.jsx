import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Store user data in localStorage after login
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUsername(JSON.parse(storedUser).fname); // Adjust based on user schema
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>Order Management</h1>
      <div style={styles.userSection}>
        {isAuthenticated ? (
          <>
            <span style={styles.userIcon}>👤</span>
            <span style={styles.username}>{username}</span>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} style={styles.button}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1976d2',
    color: 'white',
  },
  title: {
    margin: 0,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userIcon: {
    fontSize: '1.5rem',
  },
  username: {
    fontSize: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    color: '#1976d2',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Navbar;
