import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

// This is a reusable component just for this page
const DashboardCard = ({ title, imgName, linkTo }) => (
  <Link to={linkTo} className={styles.card}>
    <img 
      src={`/src/assets/${imgName}`} 
      alt={title} 
      className={styles.cardImage} 
    />
    <h3 className={styles.cardTitle}>{title}</h3>
  </Link>
);

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Welcome to your Dashboard</h1>
      <p className={styles.subtitle}>What would you like to do today?</p>
      
      <div className={styles.grid}>
        <DashboardCard 
          title="Code Review"
          imgName="feature-review.png"
          linkTo="/code-review" // We will create this page later
        />
        <DashboardCard 
          title="Bug Tester"
          imgName="feature-bug.png"
          linkTo="/bug-tester" // We will create this page later
        />
        <DashboardCard 
          title="Learn"
          imgName="feature-learn.png"
          linkTo="/learn" // We will create this page later
        />
        <DashboardCard 
          title="Code Optimization"
          imgName="feature-optimize.png"
          linkTo="/codeOptimizer" // We will create this page later
        />
      </div>
    </div>
  );
};

export default Dashboard;