import React from 'react';
import styles from './Footer.module.css'; // Import the styles

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandInfo}>
          <span className={styles.brandName}>CodeSensei</span>
          <p className={styles.copyright}>
            &copy; 2025 CodeSensei. All rights reserved. <br />
            A Hackathon Project.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.link}>Privacy Policy</a>
          <a href="#" className={styles.link}>Terms of Service</a>
          <a href="#" className={styles.link}>GitHub</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;