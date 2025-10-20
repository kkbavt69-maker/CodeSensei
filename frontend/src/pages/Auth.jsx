import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth } from '../firebase'; // Import auth from your firebase.js file
import styles from './Auth.module.css'; // Import the CSS module

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Signed up successfully:", userCredential.user);
        // You can redirect the user or update the UI here
      } else {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in successfully:", userCredential.user);
        // You can redirect the user or update the UI here
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '')); // Display a cleaner error message
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <h2 className={styles.title}>
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className={styles.subtitle}>
            {isSignUp ? 'Get started with CodeSensei today!' : 'Sign in to continue'}
          </p>
          
          <form onSubmit={handleAuth}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">
                Email Address
              </label>
              <input
                className={styles.input}
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroupLast}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                className={styles.input}
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.submitButton}
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>

          <p className={styles.toggleText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(''); // Clear errors on toggle
              }}
              className={styles.toggleButton}
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;