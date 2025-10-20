import React from 'react';
import styles from './Hero.module.css'; // Import the styles

const Hero = () => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <h1 className={styles.heroTitle}>
          Welcome to <br />
          <span className={styles.heroTitleGradient}>
            CodeSensei
          </span>
        </h1>
        <p className={styles.heroSubtitle}>
          Your AI-powered partner for code review, bug detection, and optimization. 
          Write cleaner, faster, and more secure code with intelligent feedback.
        </p>
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton}>
            Get Started
          </button>
          <button className={styles.secondaryButton}>
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;