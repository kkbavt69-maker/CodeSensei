// import React, { useState } from 'react';
// import styles from './codeOptimizer.module.css';

// // A list of common languages for the dropdown
// const languages = [
//   'JavaScript',
//   'Python',
//   'Java',
//   'C++',
//   'C#',
//   'TypeScript',
//   'PHP',
//   'Swift',
//   'Go',
//   'Kotlin',
//   'Ruby',
//   'Rust',
//   'SQL',
//   'HTML',
//   'CSS',
// ];

// const CodeOptimizer = () => {
//   const [language, setLanguage] = useState('');
//   const [inputCode, setInputCode] = useState('');
//   const [optimizedCode, setOptimizedCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleOptimizeCode = () => {
//     if (!inputCode.trim() || !language) {
//       alert('Please select a language and paste your code.');
//       return;
//     }

//     setIsLoading(true);
//     setOptimizedCode('// Optimizing your code...');

//     // --- MOCK API CALL ---
//     setTimeout(() => {
//       const mockOptimizedCode = `// --- Original ${language} Code ---
// ${inputCode}

// // --- ✨ Code Optimized ✨ ---
// // (Your optimized code would appear here)
// // Example:
// // Efficient algorithm or refactored logic
// const optimizedResult = data.map(item => item * 2);`;

//       setOptimizedCode(mockOptimizedCode);
//       setIsLoading(false);
//     }, 2000); // Simulate a 2-second network delay
//   };

//   return (
//     <div className={styles.container}>
//       {/* --- ADDED HEADER FOR CONSISTENCY --- */}
//       <div className={styles.header}>
//         <img src="/src/assets/feature-optimize.png" alt="Code Optimizer Icon" className={styles.headerIcon} />
//         <h1 className={styles.title}>Code Optimizer</h1>
//         <p className={styles.subtitle}>
//           Paste your code, select the language, and let's make it more efficient.
//         </p>
//       </div>

//       <div className={styles.topBar}>
//         {/* --- CHANGED TO A <select> DROPDOWN --- */}
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           className={styles.languageSelect}
//         >
//           <option value="" disabled>Select a language...</option>
//           {languages.map((lang) => (
//             <option key={lang} value={lang}>
//               {lang}
//             </option>
//           ))}
//         </select>

//         <button
//           className={styles.submitButton} // Renamed from fixButton
//           onClick={handleOptimizeCode}
//           disabled={isLoading}
//         >
//           {isLoading ? 'Optimizing...' : 'Optimize Code'}
//         </button>
//       </div>

//       {/* Code Editors */}
//       <div className={styles.codeAreas}>
//         <div className={styles.editorContainer}>
//           <label htmlFor="input-code" className={styles.label}>
//             Your Code
//           </label>
//           <textarea
//             id="input-code"
//             className={styles.editor}
//             value={inputCode}
//             onChange={(e) => setInputCode(e.target.value)}
//             placeholder="Paste your code here..."
//             spellCheck="false"
//           />
//         </div>

//         <div className={styles.editorContainer}>
//           <label htmlFor="output-code" className={styles.label}>
//             Optimized Code
//           </label>
//           <textarea
//             id="output-code"
//             className={`${styles.editor} ${styles.outputEditor}`} // Renamed from output
//             value={optimizedCode}
//             readOnly
//             placeholder="Your optimized code will appear here..."
//             spellCheck="false"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodeOptimizer;

import React, { useState } from 'react';
import styles from './codeOptimizer.module.css';

const languages = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'PHP', 'Swift', 'Go', 'Kotlin', 'Ruby', 'Rust', 'SQL', 'HTML', 'CSS',
];

const CodeOptimizer = () => {
  const [language, setLanguage] = useState('JavaScript');
  const [inputCode, setInputCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptimizeCode = async () => {
    if (!inputCode.trim() || !language) {
      alert('Please select a language and paste your code.');
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
        body: JSON.stringify({ code: inputCode, language }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok. Is the backend server running?');
      }

      const data = await response.json();
      setOptimizedCode(data.analysis);

    } catch (err) {
      console.error('Error fetching optimization:', err);
      setError(err.message);
      setOptimizedCode('');
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
          Paste your code, select the language, and let's make it more efficient.
        </p>
      </div>

      <div className={styles.topBar}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={styles.languageSelect}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <button
          className={styles.submitButton}
          onClick={handleOptimizeCode}
          disabled={isLoading}
        >
          {isLoading ? 'Optimizing...' : 'Optimize Code'}
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
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste your code here..."
            spellCheck="false"
          />
        </div>

        <div className={styles.editorContainer}>
          <label htmlFor="output-code" className={styles.label}>
            Optimized Code
          </label>
          <textarea
            id="output-code"
            className={`${styles.editor} ${styles.outputEditor}`}
            value={error || optimizedCode} // Show error or the optimized code
            readOnly
            placeholder="Your optimized code will appear here..."
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeOptimizer;
