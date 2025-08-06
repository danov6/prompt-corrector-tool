// Prompt grading criteria and weights
const GRADING_CRITERIA = {
  length: { weight: 0.15, min: 10, optimal: 50 },
  clarity: { weight: 0.25 },
  specificity: { weight: 0.20 },
  context: { weight: 0.15 },
  persona: { weight: 0.10 },
  examples: { weight: 0.10 },
  structure: { weight: 0.05 }
};

const SUGGESTION_TEMPLATES = [
  {
    condition: (prompt) => !hasPersona(prompt),
    message: "Consider adding a persona or role for the AI (e.g., 'Act as a professional writer...')",
    category: "Persona"
  },
  {
    condition: (prompt) => !hasExamples(prompt),
    message: "Adding examples or references would help clarify your expectations",
    category: "Examples"
  },
  {
    condition: (prompt) => prompt.length < 20,
    message: "Your prompt could be more detailed. Try adding more context about what you need",
    category: "Length"
  },
  {
    condition: (prompt) => !hasSpecificInstructions(prompt),
    message: "Be more specific about the format or style you want in the response",
    category: "Specificity"
  },
  {
    condition: (prompt) => !hasContext(prompt),
    message: "Provide more background context to help the AI understand your situation",
    category: "Context"
  }
];

function gradePrompt(prompt) {
  if (!prompt || prompt.trim().length === 0) return 0;
  
  let totalScore = 0;
  
  // Length scoring
  const lengthScore = calculateLengthScore(prompt);
  totalScore += lengthScore * GRADING_CRITERIA.length.weight;
  
  // Clarity scoring
  const clarityScore = calculateClarityScore(prompt);
  totalScore += clarityScore * GRADING_CRITERIA.clarity.weight;
  
  // Specificity scoring
  const specificityScore = calculateSpecificityScore(prompt);
  totalScore += specificityScore * GRADING_CRITERIA.specificity.weight;
  
  // Context scoring
  const contextScore = calculateContextScore(prompt);
  totalScore += contextScore * GRADING_CRITERIA.context.weight;
  
  // Persona scoring
  const personaScore = hasPersona(prompt) ? 100 : 0;
  totalScore += personaScore * GRADING_CRITERIA.persona.weight;
  
  // Examples scoring
  const examplesScore = hasExamples(prompt) ? 100 : 0;
  totalScore += examplesScore * GRADING_CRITERIA.examples.weight;
  
  // Structure scoring
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
    return 100;
  }
  return 60 + ((wordCount - GRADING_CRITERIA.length.min) / (GRADING_CRITERIA.length.optimal - GRADING_CRITERIA.length.min)) * 40;
}

function calculateClarityScore(prompt) {
  let score = 50;
  
  // Check for question words
  if (/\b(what|how|why|when|where|which|who)\b/i.test(prompt)) score += 20;
  
  // Check for clear instructions
  if (/\b(please|help|create|generate|write|explain|analyze)\b/i.test(prompt)) score += 15;
  
  // Penalize for ambiguous language
  if (/\b(maybe|perhaps|kind of|sort of|something like)\b/i.test(prompt)) score -= 15;
  
  return Math.min(100, Math.max(0, score));
}

function calculateSpecificityScore(prompt) {
  let score = 30;
  
  // Check for specific requirements
  if (/\b(format|style|tone|length|structure)\b/i.test(prompt)) score += 25;
  if (/\b(professional|casual|formal|technical|simple)\b/i.test(prompt)) score += 20;
  if (/\b(\d+\s*(words?|sentences?|paragraphs?|points?))\b/i.test(prompt)) score += 25;
  
  return Math.min(100, score);
}

function calculateContextScore(prompt) {
  let score = 40;
  
  // Check for background information
  if (/\b(background|context|situation|scenario|for|because)\b/i.test(prompt)) score += 30;
  if (/\b(audience|target|purpose|goal)\b/i.test(prompt)) score += 30;
  
  return Math.min(100, score);
}

function hasPersona(prompt) {
  return /\b(act as|you are|as a|role of|pretend|imagine you)\b/i.test(prompt);
}

function hasExamples(prompt) {
  return /\b(example|for instance|such as|like|similar to)\b/i.test(prompt);
}

function hasSpecificInstructions(prompt) {
  return /\b(format|style|tone|structure|include|avoid|must|should)\b/i.test(prompt);
}

function hasContext(prompt) {
  return /\b(background|context|situation|because|for|purpose|goal)\b/i.test(prompt);
}

function calculateStructureScore(prompt) {
  let score = 70;
  
  // Check for good structure indicators
  if (prompt.includes('.') || prompt.includes('?') || prompt.includes('!')) score += 15;
  if (prompt.split(/[.!?]/).length > 2) score += 15;
  
  return Math.min(100, score);
}

function generateSuggestions(prompt) {
  return SUGGESTION_TEMPLATES
    .filter(template => template.condition(prompt))
    .map(template => ({
      message: template.message,
      category: template.category
    }));
}

module.exports = {
  gradePrompt,
  generateSuggestions
};