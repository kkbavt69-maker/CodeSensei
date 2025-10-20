import React, { useState } from 'react';
import styles from './Learn.module.css';

const Learn = () => {
  const [language, setLanguage] = useState('python');
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState(''); // This will hold the API response

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder logic for now
    console.log("Submitting for explanation:", { language, topic });
    const mockExplanation = `--- MOCK EXPLANATION ---\n
Topic: ${topic} in ${language}

### What is it?
This is a detailed explanation of what '${topic}' means in the context of ${language}. It covers the core concepts and why it is important for developers to understand.

### Example:
Here is a simple, well-commented code example that demonstrates how to use '${topic}'.

\`\`\`${language}
// Example code for ${topic}
function example() {
  console.log("This demonstrates ${topic} in ${language}.");
}
\`\`\`

### Key Takeaways:
1.  First important point about ${topic}.
2.  Second crucial detail to remember.
3.  Common pitfalls to avoid when working with ${topic}.

--- END MOCK EXPLANATION ---`;
    setExplanation(mockExplanation);
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

        <button type="submit" className={styles.submitButton}>
          Explain This Topic
        </button>
      </form>

      {/* This is where the API response will be displayed */}
      {explanation && (
        <div className={styles.explanationOutput}>
          <h2 className={styles.outputTitle}>Explanation</h2>
          <pre className={styles.preformattedText}>{explanation}</pre>
        </div>
      )}
    </div>
  );
};

export default Learn;