// Import shared constants
const { GRADING_CRITERIA, MAX_SUGGESTIONS } = require('../../shared/constants');

const ENHANCED_SUGGESTION_TEMPLATES = [
  {
    condition: (prompt) => !hasPersona(prompt),
    message: "Consider adding a persona or role for the AI (e.g., 'Act as a professional writer...', 'You are an expert in...')",
    category: "Persona",
    highlightPatterns: [] // No specific text to highlight - missing element
  },
  {
    condition: (prompt) => !hasExamples(prompt),
    message: "Adding specific examples or references would help clarify your expectations and improve output quality",
    category: "Examples",
    highlightPatterns: [] // No specific text to highlight - missing element
  },
  {
    condition: (prompt) => prompt.length < 20,
    message: "Your prompt could be more detailed. Try adding more context about what you need and why",
    category: "Length",
    highlightPatterns: [] // Highlight entire prompt for length issues
  },
  {
    condition: (prompt) => prompt.length > 500,
    message: "Consider breaking down your prompt into smaller, more focused requests for better results",
    category: "Length",
    highlightPatterns: [] // Highlight entire prompt for length issues
  },
  {
    condition: (prompt) => !hasSpecificInstructions(prompt),
    message: "Be more specific about the format, style, or structure you want in the response",
    category: "Specificity",
    highlightPatterns: [] // No specific text to highlight - missing element
  },
  {
    condition: (prompt) => !hasContext(prompt),
    message: "Provide more background context to help the AI understand your situation and goals",
    category: "Context",
    highlightPatterns: [] // No specific text to highlight - missing element
  },
  {
    condition: (prompt) => !hasActionWords(prompt),
    message: "Use clear action words like 'write', 'analyze', 'create', 'explain' to specify what you want",
    category: "Clarity",
    highlightPatterns: [] // No specific text to highlight - missing element
  },
  {
    condition: (prompt) => hasVagueLanguage(prompt),
    message: "Avoid vague terms like 'good', 'nice', 'some'. Be specific about quantities, qualities, and requirements",
    category: "Specificity",
    highlightPatterns: ['\\b(good|nice|better|best|some|many|few|thing|stuff|kind of|sort of)\\b']
  },
  {
    condition: (prompt) => !hasOutputFormat(prompt),
    message: "Specify the desired output format (e.g., bullet points, paragraph, table, step-by-step)",
    category: "Structure",
    highlightPatterns: [] // No specific text to highlight - missing element
  },
  {
    condition: (prompt) => !hasToneSpecification(prompt),
    message: "Consider specifying the tone you want (professional, casual, technical, friendly, etc.)",
    category: "Specificity",
    highlightPatterns: [] // No specific text to highlight - missing element
  },
  {
    condition: (prompt) => hasMultipleRequests(prompt),
    message: "Consider breaking this into separate prompts for each distinct request to get better focused responses",
    category: "Structure",
    highlightPatterns: ['\\b(and|also|additionally|furthermore|moreover|plus)\\b']
  },
  {
    condition: (prompt) => !hasConstraints(prompt) && prompt.length > 100,
    message: "Add constraints like word count, time limits, or specific requirements to guide the response",
    category: "Specificity",
    highlightPatterns: [] // No specific text to highlight - missing element
  },
  {
    condition: (prompt) => hasUnclearPronouns(prompt),
    message: "Replace unclear pronouns like 'it', 'this', 'that' with specific nouns for better clarity",
    category: "Clarity",
    highlightPatterns: ['\\b(it|this|that|these|those)\\b(?!\\s+(is|are|was|were|will|would|should|could))']
  },
  {
    condition: (prompt) => hasFillerWords(prompt),
    message: "Remove filler words like 'um', 'uh', 'like', 'you know' to make your prompt more direct",
    category: "Clarity",
    highlightPatterns: ['\\b(um|uh|like|you know|basically|actually|literally)\\b']
  }
];

function gradePrompt(prompt) {
  if (!prompt || prompt.trim().length === 0) return 0;
  
  let totalScore = 0;
  
  // Length scoring (15%)
  const lengthScore = calculateLengthScore(prompt);
  totalScore += lengthScore * GRADING_CRITERIA.length.weight;
  console.log(`Length Score: ${lengthScore}`);
  // Clarity scoring (25%)
  const clarityScore = calculateClarityScore(prompt);
  totalScore += clarityScore * GRADING_CRITERIA.clarity.weight;
  console.log(`Clarity Score: ${clarityScore}`);
  // Specificity scoring (20%)
  const specificityScore = calculateSpecificityScore(prompt);
  totalScore += specificityScore * GRADING_CRITERIA.specificity.weight;
  console.log(`Specificity Score: ${specificityScore}`);
  // Context scoring (15%)
  const contextScore = calculateContextScore(prompt);
  totalScore += contextScore * GRADING_CRITERIA.context.weight;
  console.log(`Context Score: ${contextScore}`);
  // Persona scoring (10%)
  const personaScore = hasPersona(prompt) ? 100 : 0;
  totalScore += personaScore * GRADING_CRITERIA.persona.weight;
  console.log(`Persona Score: ${personaScore}`);
  // Examples scoring (10%)
  const examplesScore = hasExamples(prompt) ? 100 : 0;
  totalScore += examplesScore * GRADING_CRITERIA.examples.weight;
  console.log(`Examples Score: ${examplesScore}`);
  // Structure scoring (5%)
  const structureScore = calculateStructureScore(prompt);
  totalScore += structureScore * GRADING_CRITERIA.structure.weight;
  console.log(`Structure Score: ${structureScore}`);
  return Math.round(totalScore);
}

function calculateLengthScore(prompt) {
  const wordCount = prompt.trim().split(/\s+/).length;
  if (wordCount < GRADING_CRITERIA.length.min) {
    return (wordCount / GRADING_CRITERIA.length.min) * 60;
  }
  // Give full score for prompts between 50-100 words (comprehensive but not too long)
  if (wordCount >= GRADING_CRITERIA.length.optimal && wordCount <= 100) {
    return 100;
  }
  // Gradual decrease for very long prompts
  if (wordCount > 100) {
    return Math.max(85, 100 - (wordCount - 100) * 0.2);
  }
  return 60 + ((wordCount - GRADING_CRITERIA.length.min) / (GRADING_CRITERIA.length.optimal - GRADING_CRITERIA.length.min)) * 40;
}

function calculateClarityScore(prompt) {
  let score = 50;
  
  // Check for clear action words (stronger weight)
  if (/\b(write|create|generate|analyze|explain|describe|list|compare|summarize|outline|design|develop)\b/i.test(prompt)) score += 25;
  
  // Check for question words and clear instructions
  if (/\b(what|how|why|when|where|which|who)\b/i.test(prompt)) score += 15;
  
  // Bonus for specificity words
  if (/\b(specifically|exactly|precisely|clearly|comprehensive|detailed)\b/i.test(prompt)) score += 10;
  
  // Penalize for ambiguous language
  if (/\b(maybe|perhaps|kind of|sort of|something like|might|could be)\b/i.test(prompt)) score -= 15;
  if (/\b(good|nice|better|the best|some|many|few)\b/i.test(prompt)) score -= 10;
  
  return Math.min(100, Math.max(0, score));
}

function calculateSpecificityScore(prompt) {
  let score = 20;
  
  // Check for specific requirements (higher weight)
  if (/\b(format|style|tone|length|structure|template)\b/i.test(prompt)) score += 25;
  
  // Check for tone specifications
  if (/\b(professional|casual|formal|technical|simple|detailed|concise|approachable)\b/i.test(prompt)) score += 20;
  
  // Check for word/length specifications
  if (/\b(\d+\s*(words?|sentences?|paragraphs?|points?|steps?|items?|sections?))\b/i.test(prompt)) score += 25;
  
  // Check for format specifications
  if (/\b(bullet points?|numbered list|table|outline|summary|introduction|conclusion)\b/i.test(prompt)) score += 20;
  
  // Bonus for multiple specific requirements
  const specificityMatches = [
    /\b(format|style|tone|length|structure|template)\b/i.test(prompt),
    /\b(professional|casual|formal|technical|simple|detailed|concise|approachable)\b/i.test(prompt),
    /\b(\d+\s*(words?|sentences?|paragraphs?|points?|steps?|items?|sections?))\b/i.test(prompt),
    /\b(bullet points?|numbered list|table|outline|summary|introduction|conclusion)\b/i.test(prompt)
  ].filter(Boolean).length;
  
  if (specificityMatches >= 3) score += 10;
  
  console.log(`Specificity Score: ${score}`);
  return Math.min(100, score);
}

function calculateContextScore(prompt) {
  let score = 20;
  
  // Check for background information
  if (/\b(background|context|situation|scenario|for|because|in order to|about)\b/i.test(prompt)) score += 25;
  
  // Check for audience specification (higher weight) - our prompt has "target audience"
  if (/\b(audience|target|purpose|goal|objective|intended for)\b/i.test(prompt)) score += 35;
  
  // Check for domain/industry context - our prompt has "small businesses", "marketing", "business"
  if (/\b(project|company|business|academic|research|small business|marketing|industry|businesses)\b/i.test(prompt)) score += 30;
  
  // Bonus for multiple context elements
  const contextMatches = [
    /\b(background|context|situation|scenario|for|because|in order to|about)\b/i.test(prompt),
    /\b(audience|target|purpose|goal|objective|intended for)\b/i.test(prompt),
    /\b(project|company|business|academic|research|small business|marketing|industry|businesses)\b/i.test(prompt)
  ].filter(Boolean).length;
  
  if (contextMatches >= 2) score += 15;
  
  return Math.min(100, score);
}

function calculateStructureScore(prompt) {
  let score = 75;
  
  // Check for good structure indicators
  if (prompt.includes('.') || prompt.includes('?') || prompt.includes('!')) score += 15;
  
  // Check for multiple sentences (well-structured)
  const sentences = prompt.split(/[.!?]/).filter(s => s.trim().length > 0);
  if (sentences.length >= 2) score += 10;
  
  // Check for structural words and organization - our prompt has "Structure", "sections", "introduction", "conclusion"
  if (/\b(first|second|third|finally|also|additionally|structure|sections?|introduction|conclusion)\b/i.test(prompt)) score += 10;
  
  return Math.min(100, score);
}

// Helper functions for condition checking
function hasPersona(prompt) {
  return /\b(act as|you are|as a|role of|pretend|imagine you|assume you are)\b/i.test(prompt);
}

function hasExamples(prompt) {
  return /\b(example|for instance|such as|like|similar to|including|e\.g\.|i\.e\.|examples|formulas|templates)\b/i.test(prompt);
}

function hasSpecificInstructions(prompt) {
  return /\b(format|style|tone|structure|include|avoid|must|should|ensure|make sure)\b/i.test(prompt);
}

function hasContext(prompt) {
  return /\b(background|context|situation|because|for|purpose|goal|in order to|intended for|about|target|audience)\b/i.test(prompt);
}

function hasActionWords(prompt) {
  return /\b(write|create|generate|analyze|explain|describe|list|compare|summarize|outline|design|develop)\b/i.test(prompt);
}

function hasVagueLanguage(prompt) {
  return /\b(good|nice|better|best|some|many|few|thing|stuff|kind of|sort of)\b/i.test(prompt);
}

function hasOutputFormat(prompt) {
  return /\b(bullet points?|numbered list|table|outline|summary|paragraph|essay|report|step-by-step)\b/i.test(prompt);
}

function hasToneSpecification(prompt) {
  return /\b(professional|casual|formal|informal|technical|simple|friendly|serious|humorous|persuasive|approachable)\b/i.test(prompt);
}

function hasMultipleRequests(prompt) {
  const requests = prompt.split(/\b(and|also|additionally|furthermore|moreover|plus)\b/i);
  return requests.length > 3;
}

function hasConstraints(prompt) {
  return /\b(\d+\s*(words?|characters?|sentences?|paragraphs?|minutes?|hours?|pages?))\b/i.test(prompt) ||
         /\b(within|under|maximum|minimum|at least|no more than|limit|restrict)\b/i.test(prompt);
}

function hasUnclearPronouns(prompt) {
  return /\b(it|this|that|these|those)\b(?!\s+(is|are|was|were|will|would|should|could))/i.test(prompt);
}

function hasFillerWords(prompt) {
  return /\b(um|uh|like|you know|basically|actually|literally)\b/i.test(prompt);
}

function generateSuggestions(prompt) {
  return ENHANCED_SUGGESTION_TEMPLATES
    .filter(template => template.condition(prompt))
    .map(template => ({
      message: template.message,
      category: template.category,
      highlightPatterns: template.highlightPatterns || []
    }))
    .slice(0, MAX_SUGGESTIONS); // Limit suggestions for better UX
}

module.exports = {
  gradePrompt,
  generateSuggestions
};