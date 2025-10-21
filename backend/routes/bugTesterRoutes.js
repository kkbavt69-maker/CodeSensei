import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Multiple AI models with fallbacks
const AI_MODELS = [
  "https://api-inference.huggingface.co/models/microsoft/codebert-base",
  "https://api-inference.huggingface.co/models/codeparrot/codeparrot", 
  "https://api-inference.huggingface.co/models/gpt2",
  "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"
];

// Comprehensive bug pattern database
const BUG_PATTERNS = {
  python: [
    {
      name: "mutable_default_argument",
      pattern: /def\s+\w+\([^)]*=\s*(\[|\{)[^)]*\)/,
      severity: "HIGH",
      description: "Mutable default arguments are shared across all function calls",
      example: `# BAD:
def add_item(item, items=[]):
    items.append(item)
    return items

# GOOD:
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items`,
      explanation: "Python evaluates default arguments once when the function is defined, not when it's called. This means the same list/dict is shared across all function calls."
    },
    {
      name: "bare_except",
      pattern: /except:.*pass/,
      severity: "MEDIUM", 
      description: "Bare except catches all exceptions including KeyboardInterrupt and SystemExit",
      example: `# BAD:
try:
    risky_operation()
except:
    pass

# GOOD:
try:
    risky_operation()
except SpecificError as e:
    logger.error(f"Operation failed: {e}")
    # Handle specific error
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    # Handle other exceptions appropriately`,
      explanation: "Catching all exceptions can hide bugs and prevent proper program termination."
    },
    {
      name: "global_variable_misuse",
      pattern: /global\s+\w+/,
      severity: "MEDIUM",
      description: "Global variables make code hard to test, debug, and maintain",
      example: `# BAD:
counter = 0

def increment():
    global counter
    counter += 1
    return counter

# GOOD:
class Counter:
    def __init__(self):
        self.value = 0
    
    def increment(self):
        self.value += 1
        return self.value`,
      explanation: "Global variables create hidden dependencies and make code less modular and testable."
    },
    {
      name: "wildcard_import",
      pattern: /from\s+\w+\s+import\s+\*/,
      severity: "LOW",
      description: "Wildcard imports pollute namespace and can cause name conflicts",
      example: `# BAD:
from module import *

# GOOD:
from module import specific_function, specific_class
# OR
import module
module.specific_function()`
    }
  ],
  javascript: [
    {
      name: "var_usage",
      pattern: /\bvar\s+\w+/,
      severity: "MEDIUM",
      description: "var has function scope and hoisting issues, use let/const instead",
      example: `// BAD:
var x = 10;

// GOOD:
let x = 10;
const y = 20;`
    },
    {
      name: "double_equals",
      pattern: /[^!]=[^=]/,
      severity: "MEDIUM", 
      description: "== performs type coercion which can cause unexpected behavior",
      example: `// BAD:
if (x == null) {}

// GOOD:
if (x === null || x === undefined) {}`
    }
  ]
};

// Enhanced AI prompt for better detection
const createAIPrompt = (language, code, detectedPatterns) => {
  return `CRITICALLY ANALYZE THIS ${language.toUpperCase()} CODE FOR BUGS AND ISSUES:

\`\`\`${language}
${code}
\`\`\`

I WILL PAY YOU $1000 FOR EVERY BUG YOU FIND! BE EXTREMELY THOROUGH!

ANALYZE THESE SPECIFIC PATTERNS:
${detectedPatterns.map(p => `- ${p.name}: ${p.description}`).join('\n')}

PROVIDE DETAILED ANALYSIS IN THIS EXACT FORMAT:

## 🔍 CRITICAL BUG ANALYSIS

### 🚨 HIGH SEVERITY ISSUES
[List critical bugs with explanations]

### ⚠️ MEDIUM SEVERITY ISSUES  
[List important issues with explanations]

### 💡 CODE IMPROVEMENTS
[List suggestions and best practices]

### 🔧 FIXED CODE EXAMPLES
[Show before/after code snippets]

BE BRUTALLY HONEST - POINT OUT EVERY SINGLE ISSUE NO MATTER HOW SMALL!`;
};

// Try multiple AI models with better error handling
const callAIModels = async (prompt) => {
  for (const modelUrl of AI_MODELS) {
    try {
      console.log(`Trying AI model: ${modelUrl}`);
      
      const response = await axios.post(
        modelUrl,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 1500,
            temperature: 0.1,
            do_sample: true,
            top_p: 0.9,
            repetition_penalty: 1.1
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data && response.data[0]?.generated_text) {
        const text = response.data[0].generated_text;
        if (text.length > 100 && !text.includes('Model is loading')) {
          return {
            response: text,
            model: modelUrl.split('/').pop(),
            success: true
          };
        }
      }
    } catch (error) {
      console.log(`Model ${modelUrl} failed:`, error.message);
      continue;
    }
  }
  
  return { success: false, response: null, model: null };
};

// Enhanced pattern detection
const detectPatterns = (code, language) => {
  const patterns = BUG_PATTERNS[language] || [];
  const detected = [];
  let criticalCount = 0;
  let warningCount = 0;

  patterns.forEach(pattern => {
    if (pattern.pattern.test(code)) {
      detected.push(pattern);
      if (pattern.severity === 'HIGH') criticalCount++;
      else warningCount++;
    }
  });

  return {
    patterns: detected,
    metrics: {
      critical: criticalCount,
      warnings: warningCount,
      total: detected.length,
      overall_risk: criticalCount > 0 ? 'HIGH' : warningCount > 0 ? 'MEDIUM' : 'LOW'
    }
  };
};

// Generate comprehensive analysis when AI fails
const generateComprehensiveAnalysis = (code, language, patterns) => {
  let analysis = `## 🚀 **ADVANCED BUG DETECTION REPORT**\n\n`;

  if (patterns.patterns.length > 0) {
    analysis += `### 🔴 **CRITICAL ISSUES FOUND**\n\n`;
    
    patterns.patterns.forEach(pattern => {
      if (pattern.severity === 'HIGH') {
        analysis += `#### 🚨 ${pattern.name.replace(/_/g, ' ').toUpperCase()}\n`;
        analysis += `**Description:** ${pattern.description}\n\n`;
        analysis += `**Explanation:** ${pattern.explanation || 'This is a common anti-pattern that can cause subtle bugs.'}\n\n`;
        analysis += `**Code Example:**\n\`\`\`${language}\n${pattern.example}\n\`\`\`\n\n`;
      }
    });

    analysis += `### 🟡 **CODE QUALITY ISSUES**\n\n`;
    patterns.patterns.forEach(pattern => {
      if (pattern.severity === 'MEDIUM' || pattern.severity === 'LOW') {
        analysis += `#### ⚠️ ${pattern.name.replace(/_/g, ' ').toUpperCase()}\n`;
        analysis += `${pattern.description}\n\n`;
      }
    });
  } else {
    analysis += `### ✅ **NO PATTERN-BASED BUGS DETECTED**\n\n`;
    analysis += `The static analysis didn't find any common anti-patterns in your code.\n\n`;
  }

  // Add manual analysis for common Python patterns
  if (language === 'python') {
    analysis += `### 🔍 **MANUAL ANALYSIS**\n\n`;
    
    if (code.includes('def ') && code.includes('=[]')) {
      analysis += `#### 🚨 POTENTIAL MUTABLE DEFAULT ARGUMENT\n`;
      analysis += `I notice you're using mutable default arguments. This is a common Python pitfall!\n\n`;
    }
    
    if (code.includes('except:') && code.includes('pass')) {
      analysis += `#### ⚠️ BARE EXCEPT WITH PASS\n`;
      analysis += `Silently ignoring all exceptions can hide important errors!\n\n`;
    }
    
    if (code.includes('global ')) {
      analysis += `#### ⚠️ GLOBAL VARIABLE USAGE\n`;
      analysis += `Global variables can make code harder to test and maintain.\n\n`;
    }
  }

  analysis += `### 📊 **ANALYSIS SUMMARY**\n`;
  analysis += `- **Critical Issues:** ${patterns.metrics.critical}\n`;
  analysis += `- **Code Quality Issues:** ${patterns.metrics.warnings}\n`;
  analysis += `- **Overall Risk Level:** ${patterns.metrics.overall_risk}\n`;
  analysis += `- **Total Patterns Detected:** ${patterns.metrics.total}\n\n`;

  analysis += `### 🎯 **RECOMMENDATIONS**\n`;
  analysis += `1. **Fix critical issues immediately** - These can cause serious bugs\n`;
  analysis += `2. **Address code quality issues** - Improve maintainability\n`;
  analysis += `3. **Add unit tests** - Ensure your fixes work correctly\n`;
  analysis += `4. **Code review** - Get another pair of eyes on the changes\n\n`;

  analysis += `---\n*Analysis powered by advanced pattern matching*`;

  return analysis;
};

router.post("/", async (req, res) => {
  const { code, language } = req.body;
  
  console.log('Bug detection request:', { language, codeLength: code?.length });
  
  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  try {
    // Step 1: Pattern detection
    const patternAnalysis = detectPatterns(code, language);
    
    // Step 2: Try AI analysis
    const prompt = createAIPrompt(language, code, patternAnalysis.patterns);
    const aiResult = await callAIModels(prompt);

    let finalAnalysis = '';
    let usedModel = 'pattern_matcher';
    let status = 'pattern_analysis';

    if (aiResult.success) {
      finalAnalysis = `## 🤖 **AI-POWERED BUG ANALYSIS**\n\n*Analyzed with ${aiResult.model}*\n\n${aiResult.response}\n\n---\n*AI analysis completed*`;
      usedModel = aiResult.model;
      status = 'ai_analysis';
    } else {
      // Use enhanced comprehensive analysis
      finalAnalysis = generateComprehensiveAnalysis(code, language, patternAnalysis);
      status = 'comprehensive_analysis';
    }

    res.json({
      analysis: finalAnalysis,
      status: status,
      model: usedModel,
      metrics: patternAnalysis.metrics,
      confidence: aiResult.success ? 'high' : 'medium',
      patterns_found: patternAnalysis.patterns.map(p => p.name)
    });

  } catch (error) {
    console.error('Bug detection error:', error);
    
    // Final fallback - basic analysis
    const basicAnalysis = `## 🔍 **Basic Code Analysis**\n\n**Code Provided:** ${code.length} characters, ${code.split('\n').length} lines\n\n**Quick Assessment:**\n- Review for common language-specific pitfalls\n- Check error handling and edge cases\n- Consider code maintainability\n\n*Note: Advanced analysis temporarily unavailable*`;
    
    res.json({
      analysis: basicAnalysis,
      status: 'basic_analysis',
      model: 'fallback',
      metrics: {
        critical: 0,
        warnings: 0,
        total: 0,
        overall_risk: 'UNKNOWN'
      },
      confidence: 'low'
    });
  }
});

export default router;