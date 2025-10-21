import React, { useState } from 'react';
import styles from './Learn.module.css';

const Learn = () => {
  const [language, setLanguage] = useState('python');
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setExplanation('');

    try {
      const response = await fetch('http://localhost:8080/api/learn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, topic }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setExplanation(data.explanation);

    } catch (error) {
      console.error('Error fetching explanation:', error);
      setExplanation('Failed to get explanation. Is the backend server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/src/assets/feature-learn.png" alt="Learn Icon" className={styles.headerIcon} />
        <h1 className={styles.title}>Learn a Concept</h1>
        <p className={styles.subtitle}>
          Select a language, enter a topic you want to understand, and get a clear explanation with examples.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="language-select" className={styles.label}>
                Language
              </label>
              <select 
                id="language-select" 
                className={styles.select}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="c++">C++</option>
                <option value="c">C</option>
                <option value="csharp">C#</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="topic-input" className={styles.label}>
                Topic
              </label>
              <input 
                id="topic-input"
                type="text"
                className={styles.input}
                placeholder="e.g., 'for loops' or 'classes'"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Explaining...' : 'Explain This Topic'}
        </button>
      </form>

      {isLoading && (
        <div className={styles.explanationOutput}>
          <h2 className={styles.outputTitle}>Explaining...</h2>
          <p className={styles.preformattedText}>Please wait while the AI generates an explanation.</p>
        </div>
      )}

      {explanation && !isLoading && (
        <div className={styles.explanationOutput}>
          <h2 className={styles.outputTitle}>Explanation</h2>
          <pre className={styles.preformattedText}>{explanation}</pre>
        </div>
      )}
    </div>
  );
};

export default Learn;