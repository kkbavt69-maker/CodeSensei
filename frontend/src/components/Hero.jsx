// import React from 'react';
// import styles from './Hero.module.css'; // Import the styles

// const Hero = () => {
//   return (
//     <div className={styles.heroSection}>
//       <div className={styles.heroContainer}>
//         <h1 className={styles.heroTitle}>
//           Welcome to <br />
//           <span className={styles.heroTitleGradient}>
//             CodeSensei
//           </span>
//         </h1>
//         <p className={styles.heroSubtitle}>
//           Your AI-powered partner for code review, bug detection, and optimization. 
//           Write cleaner, faster, and more secure code with intelligent feedback.
//         </p>
//         <div className={styles.buttonContainer}>
//           <button className={styles.primaryButton}>
//             Get Started
//           </button>
//           <button className={styles.secondaryButton}>
//             Watch Demo
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import styles from './Hero.module.css';

// Simple Video Modal Component (can stay here or move)
const VideoModal = ({ isOpen, onClose, videoId }) => {
  // ... (Modal JSX remains the same) ...
   if (!isOpen) return null;
   return (
     <div className={styles.modalOverlay} onClick={onClose}>
       <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
         <button className={styles.closeButton} onClick={onClose}>&times;</button>
         <div className={styles.videoWrapper}>
           <iframe
             width="560" height="315"
             src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
             title="YouTube video player" frameBorder="0"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
             allowFullScreen>
           </iframe>
         </div>
       </div>
     </div>
   );
};


const Hero = () => {
  const [user, setUser] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const openModal = () => setIsVideoModalOpen(true);
  const closeModal = () => setIsVideoModalOpen(false);

  return (
    // REMOVED animatedGradient class
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
          {/* Conditional "Get Started" Button */}
          {!user && (
            <Link to="/auth" className={styles.primaryButton}>
              Get Started
            </Link>
          )}
          {/* Watch Demo Button */}
          <button className={styles.secondaryButton} onClick={openModal}>
            Watch Demo
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={closeModal}
        videoId="dQw4w9WgXcQ" // Placeholder video ID
      />
    </div>
  );
};

export default Hero;