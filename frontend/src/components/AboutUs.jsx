import React from 'react';
import styles from './AboutUs.module.css'; // Import the styles

const AboutUs = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        {/* Text Content */}
        <div className={styles.textContent}>
          <h2 className={styles.title}>
            <span className={styles.titleGradient}>
              About Us
            </span>
          </h2>
          <p className={styles.text}>
            CodeSensei was born from a passion for clean code and a drive to innovate. 
            Built for our college hackathon, our mission is to provide students and 
            developers with accessible AI tools to improve their programming skills.
          </p>
          <p className={styles.text}>
            We believe that understanding code is just as important as writing it. 
            Our platform helps bridge that gap, making software development more 
            intuitive and educational for everyone.
          </p>
        </div>
        
        {/* Image */}
        <div className={styles.imageContent}>
          <img 
            src="/src/assets/team-photo.jpg" 
            alt="Team" 
            className={styles.teamImage}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;