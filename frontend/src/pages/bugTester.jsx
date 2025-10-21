import React, { useState } from 'react';
import styles from './bugTester.module.css';

const languages = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'PHP', 'Swift', 'Go', 'Kotlin', 'Ruby', 'Rust'
];

const BugTester = () => {
  const [language, setLanguage] = useState('JavaScript');
  const [inputCode, setInputCode] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisMetrics, setAnalysisMetrics] = useState(null);

  const handleBugAnalysis = async (e) => {
    e?.preventDefault();
    
    if (!inputCode.trim()) {
      setError('Please paste your code first');
      return;
    }

    setIsLoading(true);
    setAnalysis('');
    setError('');
    setAnalysisMetrics(null);

    try {
      const response = await fetch('http://localhost:8080/api/bugtest', {
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

      setAnalysis(data.analysis || 'No bugs found or analysis generated.');
      setAnalysisMetrics(data.metrics || null);

    } catch (err) {
      console.error('Error fetching bug analysis:', err);
      setError(err.message || 'Failed to analyze bugs. Check if backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample buggy codes
  const insertSampleCode = (type) => {
    let sampleCode = '';
    
    if (type === 'python') {
      sampleCode = `# 🐛 Python bugs example
def add_item(item, items=[]):
    items.append(item)
    return items

def divide(a, b):
    try:
        return a / b
    except:
        pass

counter = 0

def increment():
    global counter
    counter += 1
    return counter

# Test the functions
print(add_item(1))  # [1]
print(add_item(2))  # [1, 2] - Bug! Should be [2]`;
    } else if (type === 'javascript') {
      sampleCode = `// 🐛 JavaScript bugs example
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

var user = "John";

function processData(data) {
    if (data == null) return;
    console.log(data);
    
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[i] === data[j]) {
                console.log("Duplicate found");
            }
        }
    }
}

// Test
console.log(fibonacci(5));`;
    } else if (type === 'java') {
      sampleCode = `// 🐛 Java bugs example
import java.util.*;

public class BugExample {
    private static List<String> items = new ArrayList<>();
    
    public static void addItem(String item) {
        items.add(item);
    }
    
    public static void processData(String input) {
        try {
            int number = Integer.parseInt(input);
            System.out.println(100 / number);
        } catch (Exception e) {
            // Silent catch
        }
    }
    
    public static void main(String[] args) {
        addItem("test");
        processData("0");
    }
}`;
    }
    
    setInputCode(sampleCode);
    setLanguage(type);
  };

  const clearCode = () => {
    setInputCode('');
    setAnalysis('');
    setError('');
    setAnalysisMetrics(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src="/src/assets/feature-bug.png" alt="Bug Tester Icon" className={styles.headerIcon} />
        <h1 className={styles.title}>AI Bug Tester</h1>
        <p className={styles.subtitle}>
          Find bugs, security issues, and performance problems in your code using advanced AI analysis.
        </p>
      </div>

      {/* Sample Code Buttons */}
      <div className={styles.sampleSection}>
        <h3>Try Sample Buggy Code:</h3>
        <div className={styles.sampleButtons}>
          <button 
            type="button" 
            className={styles.sampleButton}
            onClick={() => insertSampleCode('python')}
            disabled={isLoading}
          >
            Python Bugs
          </button>
          <button 
            type="button" 
            className={styles.sampleButton}
            onClick={() => insertSampleCode('javascript')}
            disabled={isLoading}
          >
            JavaScript Bugs
          </button>
          <button 
            type="button" 
            className={styles.sampleButton}
            onClick={() => insertSampleCode('java')}
            disabled={isLoading}
          >
            Java Bugs
          </button>
          <button 
            type="button" 
            className={styles.clearButton}
            onClick={clearCode}
            disabled={isLoading}
          >
            Clear Code
          </button>
        </div>
      </div>

      <form onSubmit={handleBugAnalysis} className={styles.form}>
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
              disabled={isLoading}
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
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Analyzing Bugs...
              </>
            ) : (
              '🐛 Find Bugs'
            )}
          </button>
        </div>

        {/* Metrics Panel */}
        {analysisMetrics && (
          <div className={styles.metricsPanel}>
            <div className={styles.metricItem}>
              <span 
                className={styles.metricValue} 
                style={{
                  color: analysisMetrics.overall_risk === 'HIGH' ? '#ef4444' : 
                         analysisMetrics.overall_risk === 'MEDIUM' ? '#f59e0b' : '#10b981'
                }}
              >
                {analysisMetrics.overall_risk}
              </span>
              <span className={styles.metricLabel}>Overall Risk</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>{analysisMetrics.critical}</span>
              <span className={styles.metricLabel}>Critical</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>{analysisMetrics.warnings}</span>
              <span className={styles.metricLabel}>Warnings</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>{analysisMetrics.patterns}</span>
              <span className={styles.metricLabel}>Patterns</span>
            </div>
          </div>
        )}

        <div className={styles.codeSection}>
          <div className={styles.editorContainer}>
            <div className={styles.editorHeader}>
              <label htmlFor="input-code" className={styles.label}>
                Your Code
              </label>
              {inputCode.length > 0 && (
                <span className={styles.codeInfo}>
                  {inputCode.length} chars, {inputCode.split('\n').length} lines
                </span>
              )}
            </div>
            <textarea
              id="input-code"
              className={styles.editor}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste your code here to analyze for bugs..."
              spellCheck="false"
              rows={15}
              disabled={isLoading}
            />
          </div>

          <div className={styles.editorContainer}>
            <div className={styles.editorHeader}>
              <label htmlFor="output-analysis" className={styles.label}>
                Bug Analysis
                {analysis && !isLoading && (
                  <span className={styles.statusBadge}>
                    {analysisMetrics?.overall_risk === 'HIGH' ? '🚨 Issues Found' : 
                     analysisMetrics?.overall_risk === 'MEDIUM' ? '⚠️ Review Needed' : '✅ Looks Good'}
                  </span>
                )}
              </label>
            </div>
            <textarea
              id="output-analysis"
              className={`${styles.editor} ${styles.outputEditor}`}
              value={error || analysis}
              readOnly
              placeholder={isLoading ? "🔍 AI is analyzing your code for bugs, security issues, and performance problems..." : "Bug analysis will appear here..."}
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
          <div>
            <p>🤖 AI is deeply analyzing your code...</p>
            <p className={styles.loadingSub}>Checking for security issues, performance bugs, and code smells</p>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className={styles.tips}>
        <h3>💡 What the AI Checks:</h3>
        <div className={styles.tipsGrid}>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>🔴</span>
            <div>
              <strong>Critical Issues</strong>
              <p>Security vulnerabilities, memory leaks, infinite loops</p>
            </div>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>🟡</span>
            <div>
              <strong>Performance Bugs</strong>
              <p>Slow algorithms, inefficient data structures, memory issues</p>
            </div>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>🔵</span>
            <div>
              <strong>Code Quality</strong>
              <p>Anti-patterns, poor error handling, maintainability issues</p>
            </div>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>🛡️</span>
            <div>
              <strong>Best Practices</strong>
              <p>Language-specific idioms, modern features, testing gaps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugTester;