import React, { useState } from 'react';
import styles from './CodeReview.module.css';

const CodeReview = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [review, setReview] = useState(''); // This will hold the API response

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder logic for now
    console.log("Submitting for review:", { language, code });
    setReview(`--- MOCK REVIEW ---\nLanguage: ${language}\nYour code has been submitted. The AI is analyzing it...\n1. Good variable naming.\n2. Consider using a 'for...of' loop for better readability.\n3. Function is doing too many things (violates SRP).\n--- END MOCK REVIEW ---`);
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

        <button type="submit" className={styles.submitButton}>
          Review My Code
        </button>
      </form>

      {/* This is where the API response will be displayed */}
      {review && (
        <div className={styles.reviewOutput}>
          <h2 className={styles.outputTitle}>Review Results</h2>
          <pre className={styles.preformattedText}>{review}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeReview;