import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
// Import auth AND googleProvider
import { auth, googleProvider } from '../firebase'; 
import styles from './Auth.module.css'; // Import the CSS module

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the hook

  // Email/Password submit handler
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
        navigate('/dashboard'); // Redirect on sign up
      } else {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in successfully:", userCredential.user);
        navigate('/dashboard'); // Redirect on login
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '')); // Display a cleaner error message
    }
  };

  // New function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setError(''); // Clear errors
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In successful:", result.user);
      navigate('/dashboard'); // Redirect on Google sign in
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
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

          {/* Divider */}
          <div className={styles.divider}>
            <span>OR</span>
          </div>

          {/* Updated Google Button with SVG icon */}
          <button
            onClick={handleGoogleSignIn}
            className={styles.googleButton}
          >
            {/* Google SVG Icon */}
            <svg viewBox="0 0 48 48" className={styles.googleIcon}><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.75 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24c0-.76-.06-1.5-.18-2.24H24v4.49h12.9a10.99 10.99 0 0 1-4.75 7.24l7.97 6.19c4.66-4.52 7.35-11.16 7.35-19.68z"/><path fill="#FBBC04" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C3.65 13.22 0 18.25 0 24c0 5.75 3.65 10.78 8.55 13.82l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.97-6.19c-2.13 1.5-4.82 2.45-7.92 2.45-6.27 0-11.59-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
            Sign in with Google
          </button>

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