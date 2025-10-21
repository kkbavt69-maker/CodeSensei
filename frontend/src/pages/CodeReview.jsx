import React, { useState } from 'react';
import styles from './CodeReview.module.css';

const CodeReview = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please paste your code first');
      return;
    }

    setIsLoading(true);
    setReview('');
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          language: language.toLowerCase(), 
          code: code.trim() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.analysis) {
          setReview(data.analysis);
          setError(data.error || 'Service issue detected');
        } else {
          throw new Error(data.error || `Server error: ${response.status}`);
        }
      } else {
        setReview(data.analysis || 'No review received from the AI.');
        
        if (data.status === 'fallback' || data.status === 'static_analysis') {
          setError('Note: Using enhanced static analysis - AI service is temporarily unavailable');
        }
      }

    } catch (error) {
      console.error('Error fetching code review:', error);
      
      const localFallback = `## Local Code Analysis

### Basic Review
- **Language:** ${language}
- **Code Size:** ${code.length} characters
- **Lines:** ${code.split('\n').length}

### Quick Recommendations:
1. Ensure proper indentation
2. Add comments for complex logic
3. Use descriptive variable names
4. Handle potential errors
5. Test with different inputs

### Next Steps:
- Review your code manually
- Consider peer review
- Add unit tests for critical logic

*Note: AI service is currently unavailable. This is a basic analysis.*`;

      setReview(localFallback);
      setError('AI service unavailable. Showing basic analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample code function
  const insertSampleCode = () => {
    const sampleCode = `function calculateSum(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}

// Test the function
const result = calculateSum([1, 2, 3, 4, 5]);
console.log('Sum:', result);`;
    setCode(sampleCode);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src="/src/assets/feature-review.png"
          alt="Code Review Icon"
          className={styles.headerIcon}
        />
        <h1 className={styles.title}>AI Code Review</h1>
        <p className={styles.subtitle}>
          Select a language, paste your code, and get instant feedback on quality, style, and correctness.
        </p>
      </div>

      <div className={styles.topBar}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={styles.languageSelect}
          disabled={isLoading}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c++">C++</option>
          <option value="c">C</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
        </select>

        <button
          className={styles.submitButton}
          onClick={insertSampleCode}
          disabled={isLoading}
          type="button"
        >
          Try Sample Code
        </button>

        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isLoading || !code.trim()}
        >
          {isLoading ? 'Analyzing...' : 'Review My Code'}
        </button>
      </div>

      <div className={styles.codeAreas}>
        <div className={styles.editorContainer}>
          <label htmlFor="input-code" className={styles.label}>
            Your Code
          </label>
          <textarea
            id="input-code"
            className={styles.editor}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            spellCheck="false"
            disabled={isLoading}
          />
        </div>

        <div className={styles.editorContainer}>
          <label htmlFor="output-code" className={styles.label}>
            Review Results
          </label>
          <textarea
            id="output-code"
            className={`${styles.editor} ${styles.outputEditor}`}
            value={error ? `Error: ${error}\n\n${review}` : review}
            readOnly
            placeholder={isLoading ? "Analyzing your code..." : "Code review will appear here..."}
            spellCheck="false"
          />
        </div>
      </div>

      {isLoading && (
        <div style={{ 
          textAlign: 'center', 
          color: '#CBD5E1', 
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          AI is analyzing your code...
        </div>
      )}

      {error && !isLoading && (
        <div style={{
          background: error.includes('fallback') || error.includes('static analysis') 
            ? '#feebc8' 
            : '#fed7d7',
          border: error.includes('fallback') || error.includes('static analysis')
            ? '1px solid #fbd38d'
            : '1px solid #feb2b2',
          color: error.includes('fallback') || error.includes('static analysis')
            ? '#dd6b20'
            : '#c53030',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '16px',
          fontWeight: '500'
        }}>
          {error.includes('fallback') || error.includes('static analysis') ? '⚠️ ' : '❌ '}
          {error}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CodeReview;