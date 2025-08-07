// Enhanced prompt grading criteria and weights for PostgreSQL future integration
const GRADING_CRITERIA = {
  length: { weight: 0.15, min: 10, optimal: 50 },
  clarity: { weight: 0.25 },
  specificity: { weight: 0.20 },
  context: { weight: 0.15 },
  persona: { weight: 0.10 },
  examples: { weight: 0.10 },
  structure: { weight: 0.05 }
};

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
  
  // Clarity scoring (25%)
  const clarityScore = calculateClarityScore(prompt);
  totalScore += clarityScore * GRADING_CRITERIA.clarity.weight;
  
  // Specificity scoring (20%)
  const specificityScore = calculateSpecificityScore(prompt);
  totalScore += specificityScore * GRADING_CRITERIA.specificity.weight;
  
  // Context scoring (15%)
  const contextScore = calculateContextScore(prompt);
  totalScore += contextScore * GRADING_CRITERIA.context.weight;
  
  // Persona scoring (10%)
  const personaScore = hasPersona(prompt) ? 100 : 0;
  totalScore += personaScore * GRADING_CRITERIA.persona.weight;
  
  // Examples scoring (10%)
  const examplesScore = hasExamples(prompt) ? 100 : 0;
  totalScore += examplesScore * GRADING_CRITERIA.examples.weight;
  
  // Structure scoring (5%)
  const structureScore = calculateStructureScore(prompt);
  totalScore += structureScore * GRADING_CRITERIA.structure.weight;
  
  return Math.round(totalScore);
}

function calculateLengthScore(prompt) {
  const wordCount = prompt.trim().split(/\s+/).length;
  if (wordCount < GRADING_CRITERIA.length.min) {
    return (wordCount / GRADING_CRITERIA.length.min) * 60;
  }
  if (wordCount >= GRADING_CRITERIA.length.optimal) {
    return Math.max(85, 100 - (wordCount - GRADING_CRITERIA.length.optimal) * 0.5);
  }
  return 60 + ((wordCount - GRADING_CRITERIA.length.min) / (GRADING_CRITERIA.length.optimal - GRADING_CRITERIA.length.min)) * 40;
}

function calculateClarityScore(prompt) {
  let score = 40;
  
  // Check for question words and clear instructions
  if (/\b(what|how|why|when|where|which|who)\b/i.test(prompt)) score += 20;
  if (/\b(please|help|create|generate|write|explain|analyze|describe|list|compare)\b/i.test(prompt)) score += 20;
  if (/\b(specifically|exactly|precisely|clearly)\b/i.test(prompt)) score += 10;
  
  // Penalize for ambiguous language
  if (/\b(maybe|perhaps|kind of|sort of|something like|might|could be)\b/i.test(prompt)) score -= 15;
  if (/\b(good|nice|better|best|some|many|few)\b/i.test(prompt)) score -= 10;
  
  return Math.min(100, Math.max(0, score));
}

function calculateSpecificityScore(prompt) {
  let score = 30;
  
  // Check for specific requirements
  if (/\b(format|style|tone|length|structure|template)\b/i.test(prompt)) score += 20;
  if (/\b(professional|casual|formal|technical|simple|detailed|concise)\b/i.test(prompt)) score += 15;
  if (/\b(\d+\s*(words?|sentences?|paragraphs?|points?|steps?|items?))\b/i.test(prompt)) score += 20;
  if (/\b(bullet points?|numbered list|table|outline|summary)\b/i.test(prompt)) score += 15;
  
  return Math.min(100, score);
}

function calculateContextScore(prompt) {
  let score = 30;
  
  // Check for background information
  if (/\b(background|context|situation|scenario|for|because|in order to)\b/i.test(prompt)) score += 25;
  if (/\b(audience|target|purpose|goal|objective|intended for)\b/i.test(prompt)) score += 25;
  if (/\b(project|company|business|academic|research)\b/i.test(prompt)) score += 20;
  
  return Math.min(100, score);
}

function calculateStructureScore(prompt) {
  let score = 60;
  
  // Check for good structure indicators
  if (prompt.includes('.') || prompt.includes('?') || prompt.includes('!')) score += 15;
  if (prompt.split(/[.!?]/).length > 2) score += 15;
  if (/\b(first|second|third|finally|also|additionally)\b/i.test(prompt)) score += 10;
  
  return Math.min(100, score);
}

// Helper functions for condition checking
function hasPersona(prompt) {
  return /\b(act as|you are|as a|role of|pretend|imagine you|assume you are)\b/i.test(prompt);
}

function hasExamples(prompt) {
  return /\b(example|for instance|such as|like|similar to|including|e\.g\.|i\.e\.)\b/i.test(prompt);
}

function hasSpecificInstructions(prompt) {
  return /\b(format|style|tone|structure|include|avoid|must|should|ensure|make sure)\b/i.test(prompt);
}

function hasContext(prompt) {
  return /\b(background|context|situation|because|for|purpose|goal|in order to|intended for)\b/i.test(prompt);
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
  return /\b(professional|casual|formal|informal|technical|simple|friendly|serious|humorous|persuasive)\b/i.test(prompt);
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
    .slice(0, 6); // Limit to 6 suggestions for better UX
}

module.exports = {
  gradePrompt,
  generateSuggestions
};