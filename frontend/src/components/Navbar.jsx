import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css'; // 1. Import the CSS module

const Navbar = () => {
  return (
    // 2. Use the styles object for classes
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Top Left: Logo and Name */}
        <Link to="/" className={styles.logoLink}>
          <img src="/src/assets/logo.png" alt="CodeSensei Logo" className={styles.logoImage} />
          <span className={styles.logoText}>
            CodeSensei
          </span>
        </Link>

        {/* Top Right: Links and Buttons */}
        <div className={styles.navLinks}>
          <a href="/#about" className={styles.navLink}>About</a>
          
          <Link to="/auth" className={styles.navLink}>
            Login
          </Link>
          
          <Link to="/auth" className={styles.signUpButton}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;