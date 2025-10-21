import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Advanced free AI models for education
const AI_MODELS = {
  primary: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
  code: "https://api-inference.huggingface.co/models/microsoft/CodeGPT-{lang}-py",
  general: "https://api-inference.huggingface.co/models/google/flan-t5-xxl",
  fallback: "https://api-inference.huggingface.co/models/gpt2"
};

// Knowledge graph for programming concepts
const PROGRAMMING_KNOWLEDGE = {
  data_structures: ['array', 'linked list', 'tree', 'graph', 'hash table', 'heap', 'stack', 'queue'],
  algorithms: ['sorting', 'searching', 'dynamic programming', 'greedy', 'backtracking', 'recursion'],
  paradigms: ['oop', 'functional', 'procedural', 'imperative', 'declarative'],
  concepts: ['variables', 'functions', 'classes', 'inheritance', 'polymorphism', 'encapsulation']
};

const categorizeTopic = (topic) => {
  const lowerTopic = topic.toLowerCase();
  
  for (const [category, items] of Object.entries(PROGRAMMING_KNOWLEDGE)) {
    if (items.some(item => lowerTopic.includes(item))) {
      return category;
    }
  }
  
  return 'general';
};

const generateIntelligentPrompt = (language, topic, category) => {
  const context = {
    data_structures: `Explain "${topic}" in ${language} as a data structure. Cover:
- Time/space complexity of operations
- Practical use cases and applications
- Implementation examples with code
- Comparison with similar data structures
- Real-world scenarios where it's useful`,

    algorithms: `Explain "${topic}" in ${language} as an algorithm. Cover:
- Algorithmic complexity analysis
- Step-by-step working mechanism
- Implementation with optimizations
- Edge cases and handling
- Practical applications and variations`,

    paradigms: `Explain "${topic}" in ${language} programming paradigm. Cover:
- Core principles and concepts
- How it differs from other paradigms
- Code examples demonstrating the paradigm
- Advantages and disadvantages
- When to use this approach`,

    concepts: `Explain "${topic}" in ${language} programming concept. Cover:
- Fundamental definition and purpose
- Syntax and usage patterns
- Best practices and common pitfalls
- Advanced applications
- Integration with other concepts`,

    general: `Provide a comprehensive explanation of "${topic}" in ${language} programming. Cover:
- Core concept and definition
- Practical implementation examples
- Common use cases and applications
- Best practices and optimization tips
- Related concepts and advanced topics`
  };

  return `As an expert ${language} developer and computer science educator, ${context[category]}

Provide detailed, accurate information with:
- Multiple code examples from basic to advanced
- Performance considerations
- Industry best practices
- Common mistakes to avoid
- Real-world applications

Format with clear sections and code blocks.`;
};

const callAIModel = async (prompt, modelUrl, language = '') => {
  try {
    const url = modelUrl.replace('{lang}', language.toLowerCase());
    const response = await axios.post(
      url,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1200,
          temperature: 0.3,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1,
          top_k: 50
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000
      }
    );

    return response.data;
  } catch (error) {
    console.log(`Model ${modelUrl} failed:`, error.message);
    return null;
  }
};

router.post("/", async (req, res) => {
  const { language, topic } = req.body;
  
  console.log('Advanced Learn Request:', { language, topic });
  
  if (!language || !topic) {
    return res.status(400).json({ error: "Language and topic are required." });
  }

  const category = categorizeTopic(topic);
  const prompt = generateIntelligentPrompt(language, topic, category);

  // Try multiple AI models in sequence
  let aiResponse = null;
  let usedModel = '';

  // Try primary model first
  aiResponse = await callAIModel(prompt, AI_MODELS.primary);
  usedModel = 'DialoGPT-large';

  // If primary fails, try code-specific model
  if (!aiResponse || !aiResponse[0]?.generated_text) {
    aiResponse = await callAIModel(prompt, AI_MODELS.code, language);
    usedModel = 'CodeGPT';
  }

  // If code model fails, try general model
  if (!aiResponse || !aiResponse[0]?.generated_text) {
    aiResponse = await callAIModel(prompt, AI_MODELS.general);
    usedModel = 'FLAN-T5';
  }

  let explanation = '';
  
  if (aiResponse && aiResponse[0]?.generated_text) {
    explanation = aiResponse[0].generated_text.replace(prompt, '').trim();
    
    // Enhance AI response with structured formatting
    explanation = `## 🤖 **AI-Generated Explanation: ${topic} in ${language}**\n\n**Category:** ${category.replace('_', ' ').toUpperCase()}\n\n${explanation}\n\n---\n*Generated using ${usedModel} • Always verify with official documentation*`;
  } else {
    // Advanced fallback with contextual knowledge
    explanation = generateAdvancedFallback(language, topic, category);
  }

  res.json({
    explanation: explanation,
    status: aiResponse ? 'ai_success' : 'enhanced_fallback',
    model: usedModel || 'knowledge_base',
    category: category,
    confidence: aiResponse ? 'high' : 'medium'
  });
});

const generateAdvancedFallback = (language, topic, category) => {
  const templates = {
    data_structures: `## ${topic} in ${language} - Data Structure

**🏗️ Structure Overview:**
- Fundamental organization and storage mechanism
- Defines relationship between data elements
- Specific operations and their complexities

**⚡ Key Operations:**
- Insertion, deletion, access patterns
- Time and space complexity analysis
- Memory layout and optimization

**🔍 Implementation Insights:**
\`\`\`${language}
// Basic ${topic} structure in ${language}
class ${topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')} {
    constructor() {
        this.elements = [];
        // Initialize structure
    }
    
    // Core operations
    insert(value) {
        // Implementation logic
    }
    
    search(key) {
        // Search mechanism
    }
}
\`\`\`

**🎯 Use Cases:**
- Data organization scenarios
- Algorithm optimization contexts
- System design applications

**📚 Further Learning:**
- Study time/space complexity tradeoffs
- Practice with LeetCode problems
- Implement from scratch for deep understanding`,

    algorithms: `## ${topic} in ${language} - Algorithm

**🔧 Algorithmic Approach:**
- Systematic problem-solving methodology
- Defined input-output transformation
- Complexity and efficiency analysis

**📊 Performance Metrics:**
- Time complexity (Big O notation)
- Space complexity requirements
- Best/worst/average case scenarios

**💻 Implementation:**
\`\`\`${language}
function ${topic.replace(/\s+/g, '')}(input) {
    // Algorithm logic
    let result = null;
    
    // Core algorithmic steps
    // 1. Initialization
    // 2. Processing
    // 3. Termination
    
    return result;
}
\`\`\`

**🔄 Optimization Techniques:**
- Divide and conquer strategies
- Dynamic programming approaches
- Space-time tradeoff considerations

**🚀 Practical Applications:**
- Real-world problem domains
- Industry use cases
- Performance-critical scenarios`,

    general: `## ${topic} in ${language}

**🎓 Conceptual Framework:**
- Core programming concept in ${language}
- Fundamental building block for software development
- Integration with broader computer science principles

**🛠️ Technical Implementation:**
\`\`\`${language}
// ${topic} implementation example
// Demonstrates core concepts and usage
\`\`\`

**💡 Key Insights:**
- Relationship to other programming concepts
- Language-specific features and syntax
- Best practices and common patterns

**🔍 Deep Dive Areas:**
- Advanced variations and extensions
- Performance considerations
- Error handling and edge cases

**📖 Learning Path:**
1. Master basic syntax and usage
2. Practice with progressively complex examples
3. Study advanced applications and optimizations
4. Explore related concepts and integrations`
  };

  return templates[category] || templates.general;
};

export default router;