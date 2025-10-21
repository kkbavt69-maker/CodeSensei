// import React, { useState } from 'react';
// import styles from './bugTester.module.css'; // Correct CSS import

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

// const BugTester = () => {
//   const [language, setLanguage] = useState(''); // Default to empty
//   const [inputCode, setInputCode] = useState('');
//   const [fixedCode, setFixedCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFixBug = () => {
//     if (!inputCode.trim() || !language) {
//       alert('Please select a language and paste your code.');
//       return;
//     }

//     setIsLoading(true);
//     setFixedCode('// Analyzing your code...');

//     // --- MOCK API CALL ---
//     setTimeout(() => {
//       const mockFixedCode = `// --- Original ${language} Code ---
// ${inputCode}

// // --- ✨ Code Fixed ✨ ---
// // (Your corrected code would appear here)
// // Example:
// function correctedFunction() {
//   console.log("Bug fixed!");
// }`;

//       setFixedCode(mockFixedCode);
//       setIsLoading(false);
//     }, 2000); // Simulate a 2-second network delay
//   };

//   return (
//     <div className={styles.container}>
//       {/* --- Header --- */}
//       <div className={styles.header}>
//         <img src="/src/assets/feature-bug.png" alt="Bug Tester Icon" className={styles.headerIcon} />
//         <h1 className={styles.title}>AI Bug Tester</h1>
//         <p className={styles.subtitle}>
//           Select a language, paste your code, and let's find that bug.
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
//           className={styles.submitButton}
//           onClick={handleFixBug}
//           disabled={isLoading}
//         >
//           {isLoading ? 'Analyzing...' : 'Remove Bug'}
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
//             Corrected Code
//           </label>
//           <textarea
//             id="output-code"
//             className={`${styles.editor} ${styles.outputEditor}`}
//             value={fixedCode}
//             readOnly
//             placeholder="Your corrected code will appear here..."
//             spellCheck="false"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BugTester;

import React, { useState } from 'react';
import styles from './bugTester.module.css'; // Correct CSS import

const languages = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'PHP', 'Swift', 'Go', 'Kotlin', 'Ruby', 'Rust', 'SQL', 'HTML', 'CSS',
];

const BugTester = () => {
  const [language, setLanguage] = useState('JavaScript');
  const [inputCode, setInputCode] = useState('');
  const [fixedCode, setFixedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFixBug = async () => {
    if (!inputCode.trim() || !language) {
      alert('Please select a language and paste your code.');
      return;
    }

    setIsLoading(true);
    setFixedCode('');
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/bugtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inputCode, language }), // Sending code and language
      });

      if (!response.ok) {
        throw new Error('Network response was not ok. Is the backend server running?');
      }

      const data = await response.json();
      setFixedCode(data.analysis); // The backend returns an 'analysis' property

    } catch (err) {
      console.error('Error fetching bug analysis:', err);
      setError(err.message);
      setFixedCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/src/assets/feature-bug.png" alt="Bug Tester Icon" className={styles.headerIcon} />
        <h1 className={styles.title}>AI Bug Tester</h1>
        <p className={styles.subtitle}>
          Select a language, paste your code, and let's find that bug.
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
          onClick={handleFixBug}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Remove Bug'}
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
            Corrected Code
          </label>
          <textarea
            id="output-code"
            className={`${styles.editor} ${styles.outputEditor}`}
            value={error || fixedCode} // Show error or the fixed code
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

