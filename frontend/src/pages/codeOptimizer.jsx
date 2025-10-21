import React, { useState } from 'react';
import styles from './codeOptimizer.module.css';

const languages = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'PHP', 'Swift', 'Go', 'Ruby', 'Rust'
];

const CodeOptimizer = () => {
  const [language, setLanguage] = useState('JavaScript');
  const [inputCode, setInputCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async (e) => {
    e?.preventDefault();
    
    if (!inputCode.trim()) {
      setError('Please paste your code first');
      return;
    }

    setIsLoading(true);
    setOptimizedCode('');
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: inputCode, 
          language: language.toLowerCase() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      setOptimizedCode(data.analysis || 'No optimization suggestions generated.');

    } catch (err) {
      console.error('Error fetching optimization:', err);
      setError(err.message || 'Failed to optimize code. Check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/src/assets/feature-optimize.png" alt="Code Optimizer Icon" className={styles.headerIcon} />
        <h1 className={styles.title}>Code Optimizer</h1>
        <p className={styles.subtitle}>
          Paste your code, select the language, and get optimized versions with explanations.
        </p>
      </div>

      <form onSubmit={handleOptimize} className={styles.form}>
        <div className={styles.controls}>
          <div className={styles.formGroup}>
            <label htmlFor="language-select" className={styles.label}>
              Programming Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={styles.select}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !inputCode.trim()}
          >
            {isLoading ? '⚡ Optimizing...' : '🚀 Optimize Code'}
          </button>
        </div>

        <div className={styles.codeSection}>
          <div className={styles.editorContainer}>
            <label htmlFor="input-code" className={styles.label}>
              Original Code
            </label>
            <textarea
              id="input-code"
              className={styles.editor}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste your code here to optimize..."
              spellCheck="false"
              rows={15}
            />
          </div>

          <div className={styles.editorContainer}>
            <label htmlFor="output-code" className={styles.label}>
              Optimized Code & Suggestions
            </label>
            <textarea
              id="output-code"
              className={`${styles.editor} ${styles.outputEditor}`}
              value={error || optimizedCode}
              readOnly
              placeholder={isLoading ? "Generating optimized version..." : "Optimized code and suggestions will appear here..."}
              spellCheck="false"
              rows={15}
            />
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}
      </form>

      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>AI is optimizing your code for better performance...</p>
        </div>
      )}
    </div>
  );
};

export default CodeOptimizer;