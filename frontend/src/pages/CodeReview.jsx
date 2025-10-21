import React, { useState } from 'react';
import styles from './CodeReview.module.css';

const CodeReview = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 1. Add loading state

  const handleSubmit = async (e) => { // 2. Make the function async
    e.preventDefault();
    setIsLoading(true); // 3. Set loading to true
    setReview(''); // Clear previous review

    try {
      // 4. This is the new part: Fetch from your backend
      const response = await fetch('http://localhost:8080/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setReview(data.review); // 5. Set state with the REAL response

    } catch (error) {
      console.error('Error fetching code review:', error);
      setReview('Failed to get review. Is the backend server running?');
    } finally {
      setIsLoading(false); // 6. Set loading to false
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/src/assets/feature-review.png" alt="Code Review Icon" className={styles.headerIcon} />
        <h1 className={styles.title}>AI Code Review</h1>
        <p className={styles.subtitle}>
          Select a language, paste your code, and get instant feedback on quality, style, and correctness.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ... (your <select> and <textarea> are unchanged) ... */}
        <div className={styles.formGroup}>
          <label htmlFor="language-select" className={styles.label}>
            Select Language
          </label>
          <select 
            id="language-select" 
            className={styles.select}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
            <option value="c">C</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="code-input" className={styles.label}>
            Paste Your Code
          </label>
          <textarea 
            id="code-input"
            className={styles.textarea}
            placeholder="Enter your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* 7. Update button to show loading state */}
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Review My Code'}
        </button>
      </form>

      {/* 8. Handle the loading state */}
      {isLoading && (
        <div className={styles.reviewOutput}>
          <h2 className={styles.outputTitle}>Analyzing Code...</h2>
          <p className={styles.preformattedText}>Please wait while the AI reviews your code.</p>
        </div>
      )}

      {/* 9. Show review (if not loading) */}
      {review && !isLoading && (
        <div className={styles.reviewOutput}>
          <h2 className={styles.outputTitle}>Review Results</h2>
          <pre className={styles.preformattedText}>{review}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeReview;