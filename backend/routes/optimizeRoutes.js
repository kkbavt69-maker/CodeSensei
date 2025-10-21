import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Advanced code analysis models
const CODE_AI_MODELS = {
  analysis: "https://api-inference.huggingface.co/models/microsoft/codereviewer-base",
  generation: "https://api-inference.huggingface.co/models/codeparrot/codeparrot",
  understanding: "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
  fallback: "https://api-inference.huggingface.co/models/gpt2"
};

const analyzeCodeStructure = (code, language) => {
  const analysis = {
    complexity: {
      cyclomatic: 0,
      cognitive: 0,
      halstead: { volume: 0, difficulty: 0 }
    },
    smells: [],
    patterns: [],
    metrics: {
      lines: code.split('\n').length,
      characters: code.length,
      functions: (code.match(/(function|def)\s+\w+/g) || []).length,
      classes: (code.match(/class\s+\w+/g) || []).length
    }
  };

  // Advanced pattern detection
  const patterns = {
    recursion: /(\b\w+\s*\([^)]*\)\s*{[\s\S]*?\b\1\s*\()/,
    nestedLoops: /(for|while)[^{]*{[\s\S]*(for|while)[^{]*{/,
    deepConditionals: /(if|else\s+if)[^{]*{[\s\S]*(if|else\s+if)[^{]*{/,
    magicNumbers: /\b\d{2,}\b/,
    longMethods: /(function|def)\s+\w+[^{]*{[\s\S]{200,}?}/,
    duplicatedCode: /(.{20,})(?=\1)/
  };

  for (const [pattern, regex] of Object.entries(patterns)) {
    if (regex.test(code)) {
      analysis.patterns.push(pattern);
    }
  }

  // Language-specific analysis
  if (language === 'javascript') {
    if (code.includes('eval(')) analysis.smells.push('eval_usage');
    if (code.includes('with(')) analysis.smells.push('with_statement');
    if (!code.includes('use strict')) analysis.smells.push('no_strict_mode');
  }

  if (language === 'python') {
    if (code.includes('except:')) analysis.smells.push('bare_except');
    if (code.includes('import *')) analysis.smells.push('wildcard_import');
  }

  return analysis;
};

const generateCodeOptimizationPrompt = (language, code, analysis) => {
  return `As an expert software engineer and code optimizer, analyze and improve this ${language} code:

ORIGINAL CODE:
\`\`\`${language}
${code}
\`\`\`

CODE ANALYSIS:
- Lines: ${analysis.metrics.lines}, Functions: ${analysis.metrics.functions}
- Detected Patterns: ${analysis.patterns.join(', ') || 'None'}
- Code Smells: ${analysis.smells.join(', ') || 'None'}

PROVIDE COMPREHENSIVE OPTIMIZATION:

🔍 **Deep Analysis:**
- Algorithmic complexity assessment
- Memory usage patterns
- Potential bottlenecks identification
- Scalability considerations

⚡ **Optimization Strategies:**
- Algorithm improvements
- Data structure optimizations
- Memory management enhancements
- Parallelization opportunities

🎯 **Specific Improvements:**
1. Performance optimizations with benchmarks
2. Readability and maintainability enhancements
3. Error handling and edge case coverage
4. Security considerations

📊 **Before/After Comparison:**
- Time complexity improvement
- Space complexity reduction
- Code quality metrics

💡 **Advanced Techniques:**
- Design pattern applications
- Architectural improvements
- Testing strategy recommendations

Provide the optimized code with detailed explanations for each change.`;
};

const callCodeAI = async (prompt, modelType, language = '') => {
  try {
    const modelUrl = CODE_AI_MODELS[modelType];
    const response = await axios.post(
      modelUrl,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.2,
          do_sample: true,
          top_p: 0.95,
          repetition_penalty: 1.2,
          top_k: 40
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    return response.data;
  } catch (error) {
    console.log(`Code AI model ${modelType} failed:`, error.message);
    return null;
  }
};

router.post("/", async (req, res) => {
  const { code, language } = req.body;
  
  console.log('Advanced Optimize Request:', { language, codeLength: code?.length });
  
  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  if (code.length > 10000) {
    return res.status(400).json({ error: "Code exceeds maximum length of 10000 characters." });
  }

  // Perform advanced static analysis
  const analysis = analyzeCodeStructure(code, language);
  const prompt = generateCodeOptimizationPrompt(language, code, analysis);

  // Try multiple AI models for comprehensive analysis
  let aiResponse = null;
  let usedModel = '';

  // Try code analysis model first
  aiResponse = await callCodeAI(prompt, 'analysis');
  usedModel = 'CodeReviewer';

  // If analysis fails, try generation model
  if (!aiResponse || !aiResponse[0]?.generated_text) {
    aiResponse = await callCodeAI(prompt, 'generation');
    usedModel = 'CodeParrot';
  }

  let optimizationResult = '';
  
  if (aiResponse && aiResponse[0]?.generated_text) {
    optimizationResult = aiResponse[0].generated_text.replace(prompt, '').trim();
    
    // Enhance with structured analysis
    optimizationResult = `## 🚀 **AI-Powered Code Optimization**\n\n**Analysis Summary:**\n- **Complexity:** ${analysis.patterns.length > 0 ? 'Medium-High' : 'Low'}\n- **Issues Found:** ${analysis.smells.length + analysis.patterns.length}\n- **Optimization Model:** ${usedModel}\n\n${optimizationResult}\n\n---\n*AI analysis provided - Always test optimized code thoroughly*`;
  } else {
    // Advanced contextual fallback
    optimizationResult = generateContextualOptimization(code, language, analysis);
  }

  res.json({
    analysis: optimizationResult,
    status: aiResponse ? 'ai_optimized' : 'advanced_analysis',
    model: usedModel || 'static_analyzer',
    metrics: analysis.metrics,
    confidence: aiResponse ? 'high' : 'medium'
  });
});

const generateContextualOptimization = (code, language, analysis) => {
  const hasRecursion = analysis.patterns.includes('recursion');
  const hasNestedLoops = analysis.patterns.includes('nestedLoops');
  const hasDeepConditionals = analysis.patterns.includes('deepConditionals');

  let specificAdvice = '';
  
  if (hasRecursion) {
    specificAdvice = `**🎯 Recursion Optimization:**
- Consider memoization for repeated calculations
- Evaluate iterative alternatives
- Watch for stack overflow with large inputs
- Use tail recursion where supported`;
  }
  
  if (hasNestedLoops) {
    specificAdvice += `\n\n**🔄 Nested Loop Optimization:**
- Analyze time complexity (often O(n²) or worse)
- Consider algorithmic improvements
- Use efficient data structures to reduce nesting
- Explore parallel processing opportunities`;
  }

  if (hasDeepConditionals) {
    specificAdvice += `\n\n**⚖️ Conditional Logic Optimization:**
- Refactor complex conditionals into separate functions
- Use strategy pattern or state machines
- Implement guard clauses for early returns
- Consider polymorphism for type-based logic`;
  }

  return `## 🔍 **Advanced Code Analysis**

**📊 Comprehensive Metrics:**
- **Lines:** ${analysis.metrics.lines}
- **Functions/Classes:** ${analysis.metrics.functions}/${analysis.metrics.classes}
- **Code Smells:** ${analysis.smells.length}
- **Complex Patterns:** ${analysis.patterns.length}

**⚠️ Detected Issues:**
${analysis.smells.map(smell => `- ${smell}`).join('\n')}
${analysis.patterns.map(pattern => `- ${pattern}`).join('\n')}

${specificAdvice}

**💡 General Optimization Strategies:**

**1. Algorithmic Improvements:**
- Analyze time/space complexity
- Choose optimal data structures
- Implement caching where appropriate

**2. Code Quality:**
- Extract complex logic into functions
- Add comprehensive error handling
- Implement proper logging
- Write unit tests

**3. Performance:**
- Minimize expensive operations in loops
- Use efficient built-in functions
- Consider memory allocation patterns
- Profile and benchmark critical sections

**4. Maintainability:**
- Add meaningful comments
- Follow style guides
- Use descriptive naming
- Keep functions focused

**🚀 Next Steps:**
1. Profile code to identify bottlenecks
2. Implement suggested optimizations
3. Test thoroughly with edge cases
4. Benchmark before/after performance

*For AI-powered specific optimizations, ensure Hugging Face token is configured*`;
};

export default router;