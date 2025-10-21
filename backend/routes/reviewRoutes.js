import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Professional code review models
const REVIEW_MODELS = {
  professional: "https://api-inference.huggingface.co/models/microsoft/codereviewer-base",
  comprehensive: "https://api-inference.huggingface.co/models/codeparrot/codeparrot", 
  educational: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
  fallback: "https://api-inference.huggingface.co/models/gpt2"
};

const analyzeCodeQuality = (code, language) => {
  const metrics = {
    maintainability: {
      score: 100,
      factors: []
    },
    readability: {
      score: 100,
      factors: []
    },
    efficiency: {
      score: 100,
      factors: []
    },
    bestPractices: {
      score: 100,
      factors: []
    }
  };

  const lines = code.split('\n');
  const totalLines = lines.length;
  
  // Maintainability analysis
  const longMethodThreshold = 50;
  const deepNestingThreshold = 3;
  
  let nestingLevel = 0;
  let maxNesting = 0;
  
  lines.forEach(line => {
    // Track nesting
    if (line.includes('{') || line.includes(':')) nestingLevel++;
    if (line.includes('}')) nestingLevel--;
    maxNesting = Math.max(maxNesting, nestingLevel);
    
    // Check for long lines
    if (line.length > 100) {
      metrics.readability.factors.push('long_line');
      metrics.readability.score -= 5;
    }
  });

  if (maxNesting > deepNestingThreshold) {
    metrics.maintainability.factors.push('deep_nesting');
    metrics.maintainability.score -= 15;
  }

  if (totalLines > longMethodThreshold) {
    metrics.maintainability.factors.push('long_method');
    metrics.maintainability.score -= 20;
  }

  // Efficiency analysis
  const hasInefficientPatterns = 
    /O\(n\^2\)|nested.*loop|double.*loop/.test(code) ||
    /document\.getElementById\(.*\)/.test(code) ||
    /string\.concat|array\.push.*loop/.test(code);

  if (hasInefficientPatterns) {
    metrics.efficiency.factors.push('inefficient_algorithm');
    metrics.efficiency.score -= 25;
  }

  // Best practices analysis
  const bestPracticeViolations = {
    javascript: {
      noSemicolons: /[a-z]\)\s*$/,
      varUsage: /\bvar\s+\w+/,
      doubleEquals: /[^=]=[^=]/,
      consoleLog: /console\.log\([^)]*\)[^;]*$/
    },
    python: {
      noDocstrings: /def\s+\w+\([^)]*\):[^{]*(?:\n[^{]*)*?(?=def|\n\s*\n|$)/,
      bareExcept: /except:/
    }
  };

  if (bestPracticeViolations[language]) {
    for (const [violation, pattern] of Object.entries(bestPracticeViolations[language])) {
      if (pattern.test(code)) {
        metrics.bestPractices.factors.push(violation);
        metrics.bestPractices.score -= 10;
      }
    }
  }

  // Calculate overall score
  const overallScore = Math.round(
    (metrics.maintainability.score + 
     metrics.readability.score + 
     metrics.efficiency.score + 
     metrics.bestPractices.score) / 4
  );

  return {
    ...metrics,
    overall: {
      score: overallScore,
      grade: overallScore >= 90 ? 'A' : 
             overallScore >= 80 ? 'B' : 
             overallScore >= 70 ? 'C' : 
             overallScore >= 60 ? 'D' : 'F'
    }
  };
};

const generateProfessionalReviewPrompt = (language, code, qualityMetrics) => {
  return `As a senior software engineer and tech lead, conduct a professional code review for this ${language} code:

CODE UNDER REVIEW:
\`\`\`${language}
${code}
\`\`\`

QUALITY METRICS:
- Overall Grade: ${qualityMetrics.overall.grade} (${qualityMetrics.overall.score}/100)
- Maintainability: ${qualityMetrics.maintainability.score}/100
- Readability: ${qualityMetrics.readability.score}/100  
- Efficiency: ${qualityMetrics.efficiency.score}/100
- Best Practices: ${qualityMetrics.bestPractices.score}/100

PROVIDE PROFESSIONAL CODE REVIEW:

🏆 **Overall Assessment:**
- Code quality evaluation
- Production readiness assessment
- Team standards compliance

📋 **Architecture & Design:**
- Design pattern appropriateness
- Modularity and separation of concerns
- Scalability considerations
- Integration patterns

🔧 **Implementation Quality:**
- Algorithm efficiency and optimization
- Error handling robustness
- Code clarity and expressiveness
- Testing strategy adequacy

📖 **Readability & Maintainability:**
- Code organization and structure
- Naming conventions and consistency
- Documentation and comments quality
- Complexity management

🛡️ **Security & Reliability:**
- Input validation and sanitization
- Exception handling completeness
- Resource management
- Security best practices compliance

💡 **Specific Improvements:**
1. Critical issues requiring immediate attention
2. Important enhancements for next iteration
3. Nice-to-have refinements
4. Long-term architectural considerations

📝 **Code Examples:**
Provide before/after code snippets for key improvements

🎯 **Action Items:**
Prioritized list of changes with effort/impact assessment

Provide constructive, professional feedback suitable for a production code review.`;
};

const callReviewAI = async (prompt, modelType) => {
  try {
    const modelUrl = REVIEW_MODELS[modelType];
    const response = await axios.post(
      modelUrl,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 2500,
          temperature: 0.3,
          do_sample: true,
          top_p: 0.92,
          repetition_penalty: 1.15,
          top_k: 45
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
    console.log(`Review model ${modelType} failed:`, error.message);
    return null;
  }
};

router.post("/", async (req, res) => {
  const { code, language } = req.body;
  
  console.log('Professional Code Review Request:', { language, codeLength: code?.length });
  
  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  if (code.length > 10000) {
    return res.status(400).json({ error: "Code exceeds maximum length of 10000 characters." });
  }

  // Perform comprehensive quality analysis
  const qualityMetrics = analyzeCodeQuality(code, language);
  const prompt = generateProfessionalReviewPrompt(language, code, qualityMetrics);

  // Try multiple AI models for professional review
  let aiResponse = null;
  let usedModel = '';

  // Try professional review model first
  aiResponse = await callReviewAI(prompt, 'professional');
  usedModel = 'CodeReviewer Pro';

  // Fallback to comprehensive model
  if (!aiResponse || !aiResponse[0]?.generated_text) {
    aiResponse = await callReviewAI(prompt, 'comprehensive');
    usedModel = 'CodeParrot Comprehensive';
  }

  let reviewReport = '';
  
  if (aiResponse && aiResponse[0]?.generated_text) {
    reviewReport = aiResponse[0].generated_text.replace(prompt, '').trim();
    
    // Enhance with professional formatting
    reviewReport = `## 🏆 **Professional Code Review Report**\n\n**📊 Quality Score:** ${qualityMetrics.overall.score}/100 (${qualityMetrics.overall.grade})\n**🔍 Review Model:** ${usedModel}\n**📝 Lines Analyzed:** ${code.split('\n').length}\n\n${reviewReport}\n\n---\n*AI-powered review - Combine with human review for production code*`;
  } else {
    // Professional quality analysis fallback
    reviewReport = generateProfessionalQualityAnalysis(code, language, qualityMetrics);
  }

  res.json({
    analysis: reviewReport,
    status: aiResponse ? 'professional_review' : 'quality_analysis',
    model: usedModel || 'quality_analyzer',
    metrics: qualityMetrics,
    confidence: aiResponse ? 'high' : 'medium'
  });
});

const generateProfessionalQualityAnalysis = (code, language, qualityMetrics) => {
  const improvements = [];
  
  if (qualityMetrics.maintainability.factors.length > 0) {
    improvements.push(`**🔧 Maintainability Issues:**\n${qualityMetrics.maintainability.factors.map(f => `- ${f.replace(/_/g, ' ')}`).join('\n')}`);
  }
  
  if (qualityMetrics.readability.factors.length > 0) {
    improvements.push(`**📖 Readability Concerns:**\n${qualityMetrics.readability.factors.map(f => `- ${f.replace(/_/g, ' ')}`).join('\n')}`);
  }
  
  if (qualityMetrics.efficiency.factors.length > 0) {
    improvements.push(`**⚡ Efficiency Opportunities:**\n${qualityMetrics.efficiency.factors.map(f => `- ${f.replace(/_/g, ' ')}`).join('\n')}`);
  }
  
  if (qualityMetrics.bestPractices.factors.length > 0) {
    improvements.push(`**🛡️ Best Practices:**\n${qualityMetrics.bestPractices.factors.map(f => `- ${f.replace(/_/g, ' ')}`).join('\n')}`);
  }

  return `# 🏆 **Professional Code Quality Assessment**

## 📊 **Quality Metrics Summary**
- **Overall Score:** ${qualityMetrics.overall.score}/100 ⭐ ${qualityMetrics.overall.grade}
- **Maintainability:** ${qualityMetrics.maintainability.score}/100
- **Readability:** ${qualityMetrics.readability.score}/100
- **Efficiency:** ${qualityMetrics.efficiency.score}/100  
- **Best Practices:** ${qualityMetrics.bestPractices.score}/100

## 💡 **Key Improvement Areas**

${improvements.join('\n\n')}

## 🎯 **Professional Recommendations**

### **1. Architecture & Design**
- Evaluate design pattern applicability
- Assess modularity and component boundaries
- Consider future scalability requirements
- Review integration approaches

### **2. Implementation Excellence**
\`\`\`${language}
// Example: Improved error handling
try {
    const result = processData(input);
    return { success: true, data: result };
} catch (error) {
    logger.error('Processing failed', { error, input });
    return { success: false, error: error.message };
}
\`\`\`

### **3. Code Quality Standards**
- Implement comprehensive error handling
- Add meaningful documentation
- Follow consistent naming conventions
- Ensure adequate test coverage

### **4. Performance Optimization**
- Analyze algorithmic complexity
- Review memory usage patterns
- Consider asynchronous operations
- Implement proper caching strategies

## 🚀 **Action Plan**

**🟢 Immediate (This Sprint):**
${qualityMetrics.overall.score < 70 ? '- Address critical maintainability issues\n' : ''}
- Fix security and best practice violations
- Implement basic error handling

**🟡 Short-term (Next Sprint):**
- Refactor long methods and deep nesting
- Improve code documentation
- Add unit test coverage

**🔵 Long-term (Roadmap):**
- Architectural improvements
- Performance optimization
- Comprehensive testing strategy

## 📈 **Industry Benchmarks**
- **Excellent:** 90-100 (Production-ready)
- **Good:** 80-89 (Needs minor improvements)  
- **Average:** 70-79 (Requires refactoring)
- **Needs Work:** <70 (Major revisions needed)

*Your code quality: ${qualityMetrics.overall.score}/100 - ${qualityMetrics.overall.score >= 80 ? 'Good foundation with specific improvements needed' : 'Substantial refactoring recommended'}*`;
};

export default router;