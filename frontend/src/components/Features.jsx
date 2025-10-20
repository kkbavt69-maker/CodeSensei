import React from 'react';
import styles from './Features.module.css'; // Import the styles

// Feature Card Component
const FeatureCard = ({ imgName, title, description }) => (
  <div className={styles.featureCard}>
    <img 
      src={`/src/assets/${imgName}`} 
      alt={`${title} icon`} 
      className={styles.cardImage} 
    />
    <h3 className={styles.cardTitle}>{title}</h3>
    <p className={styles.cardDescription}>
      {description}
    </p>
  </div>
);

const Features = () => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleGradient}>
            Powerful Features, Simplified
          </span>
        </h2>
        <div className={styles.featuresGrid}>
          <FeatureCard 
            imgName="feature-review.png"
            title="AI Code Review"
            description="Get instant, line-by-line feedback on your code's quality, style, and best practices."
          />
          <FeatureCard 
            imgName="feature-bug.png"
            title="Smart Bug Detector"
            description="Automatically find and fix bugs, vulnerabilities, and potential errors before they become problems."
          />
          <FeatureCard 
            imgName="feature-optimize.png"
            title="Code Optimization"
            description="Receive suggestions to improve your code's performance and reduce its complexity (Big O)."
          />
          <FeatureCard 
            imgName="feature-learn.png"
            title="Learn & Understand"
            description="Get detailed explanations for complex code blocks and concepts, complete with comments."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;