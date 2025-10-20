import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // 1. Import auth functions
import { auth } from '../firebase'; // 2. Import auth
import styles from './Navbar.module.css';

const Navbar = () => {
  const [user, setUser] = useState(null); // 3. Add state to track user
  const navigate = useNavigate();

  // 4. Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // 5. Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to home after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo and Name */}
        <Link to="/" className={styles.logoLink}>
          <img src="/src/assets/logo.png" alt="CodeSensei Logo" className={styles.logoImage} />
          <span className={styles.logoText}>
            CodeSensei
          </span>
        </Link>

        {/* 6. Conditional Links */}
        <div className={styles.navLinks}>
          <a href="/#about" className={styles.navLink}>About</a>
          
          {user ? (
            // If user is logged in
            <>
              <Link to="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            // If user is logged out
            <>
              <Link to="/auth" className={styles.navLink}>
                Login
              </Link>
              <Link to="/auth" className={styles.signUpButton}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;