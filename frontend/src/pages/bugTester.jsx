import React, { useState } from 'react';
import styles from './bugTester.module.css'; // Correct CSS import

// A list of common languages for the dropdown
const languages = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'TypeScript',
  'PHP',
  'Swift',
  'Go',
  'Kotlin',
  'Ruby',
  'Rust',
  'SQL',
  'HTML',
  'CSS',
];

const BugTester = () => {
  const [language, setLanguage] = useState(''); // Default to empty
  const [inputCode, setInputCode] = useState('');
  const [fixedCode, setFixedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFixBug = () => {
    if (!inputCode.trim() || !language) {
      alert('Please select a language and paste your code.');
      return;
    }

    setIsLoading(true);
    setFixedCode('// Analyzing your code...');

    // --- MOCK API CALL ---
    setTimeout(() => {
      const mockFixedCode = `// --- Original ${language} Code ---
${inputCode}

// --- ✨ Code Fixed ✨ ---
// (Your corrected code would appear here)
// Example:
function correctedFunction() {
  console.log("Bug fixed!");
}`;

      setFixedCode(mockFixedCode);
      setIsLoading(false);
    }, 2000); // Simulate a 2-second network delay
  };

  return (
    <div className={styles.container}>
      {/* --- Header --- */}
      <div className={styles.header}>
        <img src="/src/assets/feature-bug.png" alt="Bug Tester Icon" className={styles.headerIcon} />
        <h1 className={styles.title}>AI Bug Tester</h1>
        <p className={styles.subtitle}>
          Select a language, paste your code, and let's find that bug.
        </p>
      </div>

      <div className={styles.topBar}>
        {/* --- CHANGED TO A <select> DROPDOWN --- */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={styles.languageSelect}
        >
          <option value="" disabled>Select a language...</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <button
          className={styles.submitButton}
          onClick={handleFixBug}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Remove Bug'}
        </button>
      </div>

      {/* Code Editors */}
      <div className={styles.codeAreas}>
        <div className={styles.editorContainer}>
          <label htmlFor="input-code" className={styles.label}>
            Your Code
          </label>
          <textarea
            id="input-code"
            className={styles.editor}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste your code here..."
            spellCheck="false"
          />
        </div>

        <div className={styles.editorContainer}>
          <label htmlFor="output-code" className={styles.label}>
            Corrected Code
          </label>
          <textarea
            id="output-code"
            className={`${styles.editor} ${styles.outputEditor}`}
            value={fixedCode}
            readOnly
            placeholder="Your corrected code will appear here..."
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default BugTester;