// Application-wide constants

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// Grading Criteria Configuration
const GRADING_CRITERIA = {
  length: { weight: 0.15, min: 10, optimal: 50 },
  clarity: { weight: 0.25 },
  specificity: { weight: 0.2 },
  context: { weight: 0.15 },
  persona: { weight: 0.1 },
  examples: { weight: 0.1 },
  structure: { weight: 0.05 },
};

// Score Color Mapping
const SCORE_COLORS = {
  EXCELLENT: "#22c55e", // Green (80+)
  GOOD: "#f59e0b", // Yellow (60-79)
  FAIR: "#f97316", // Orange (40-59)
  POOR: "#ef4444", // Red (0-39)
};

// Score Labels
const SCORE_LABELS = {
  90: "Excellent",
  80: "Great",
  70: "Good",
  60: "Fair",
  40: "Needs Work",
  1: "Poor",
  0: "No Prompt",
};

// Category Icons
const CATEGORY_ICONS = {
  Persona: "👤",
  Examples: "📝",
  Length: "📏",
  Specificity: "🎯",
  Context: "🔍",
  Structure: "🏗️",
  Clarity: "💡",
};

// Perfect Prompt Example
const PERFECT_PROMPT_EXAMPLE = {
  prompt:
    "Act as an experienced content marketing strategist and write a comprehensive 800-word blog post about email marketing best practices for small businesses. The post should be written in a professional yet approachable tone, similar to HubSpot's blog style. Structure it with an engaging introduction, 5 main sections with actionable tips, and a compelling conclusion with a call-to-action. Include specific examples such as subject line formulas and email templates. The target audience is small business owners with limited marketing experience who want to improve their email open rates and conversions because they need cost-effective marketing strategies.",
  score: "100%",
  breakdown: {
    clarity:
      "✅ Clear action word 'write' and comprehensive instructions (100/100)",
    specificity:
      "✅ Defined format, tone, word count, sections, and structure (100/100)",
    length: "✅ Comprehensive but focused - 85 words (100/100)",
    context:
      "✅ Target audience, business context, and purpose provided (100/100)",
    persona: "✅ Assigned expert role 'content marketing strategist' (100/100)",
    examples:
      "✅ Referenced style (HubSpot) and specific examples requested (100/100)",
    structure: "✅ Well-organized with clear sentence structure (100/100)",
  },
};

// Criteria Data for How To Prompt Page
const CRITERIA_DATA = [
  {
    category: "Clarity",
    weight: "25%",
    icon: "💡",
    description: "Use clear, direct language that leaves no room for ambiguity",
    tips: [
      "Use specific action words like 'write', 'analyze', 'create', 'explain'",
      "Include question words: what, how, why, when, where, which, who",
      "Avoid vague terms like 'good', 'nice', 'some', 'many', 'kind of'",
      "Be direct: 'Please help me...' instead of 'Maybe you could...'",
      "Replace unclear pronouns ('it', 'this', 'that') with specific nouns",
    ],
    examples: {
      bad: "Make this better and more professional.",
      good: "Rewrite this email to sound more professional by using formal language and removing casual expressions.",
    },
  },
  {
    category: "Specificity",
    weight: "20%",
    icon: "🎯",
    description:
      "Provide detailed requirements about format, style, and constraints",
    tips: [
      "Specify the desired format (bullet points, paragraphs, tables, lists)",
      "Define the tone (professional, casual, technical, friendly)",
      "Include word count or length requirements",
      "Mention specific style preferences",
      "Add constraints like 'within 200 words' or 'in 5 bullet points'",
    ],
    examples: {
      bad: "Write something about marketing.",
      good: "Write a 300-word professional blog post about digital marketing trends, formatted in 3 paragraphs with bullet points for key strategies.",
    },
  },
  {
    category: "Length",
    weight: "15%",
    icon: "📏",
    description: "Provide adequate detail without being overly verbose",
    tips: [
      "Aim for 10-50 words for optimal scoring",
      "Include enough context to be clear",
      "Avoid single-word or very short prompts",
      "Don't exceed 500 words unless absolutely necessary",
      "Break down complex requests into focused prompts",
    ],
    examples: {
      bad: "Help.",
      good: "Help me create a weekly meal plan for a family of four that includes vegetarian options and stays within a $150 budget.",
    },
  },
  {
    category: "Context",
    weight: "15%",
    icon: "🔍",
    description: "Provide background information and explain the purpose",
    tips: [
      "Explain the background or situation",
      "Mention your target audience",
      "State the purpose or goal",
      "Include relevant details about your project or company",
      "Use phrases like 'for', 'because', 'in order to', 'intended for'",
    ],
    examples: {
      bad: "Write a presentation.",
      good: "Write a 10-slide presentation for new employees about our company culture, intended for their first-day orientation.",
    },
  },
  {
    category: "Persona",
    weight: "10%",
    icon: "👤",
    description: "Assign a specific role or expertise to the AI",
    tips: [
      "Use 'Act as...' or 'You are...' to assign roles",
      "Specify relevant expertise (professional writer, marketing expert, teacher)",
      "Match the persona to your task",
      "Examples: 'Act as a financial advisor', 'You are an expert copywriter'",
      "Consider the perspective you want the AI to take",
    ],
    examples: {
      bad: "Give me investment advice.",
      good: "Act as a financial advisor and provide investment advice for a 30-year-old looking to save for retirement with moderate risk tolerance.",
    },
  },
  {
    category: "Examples",
    weight: "10%",
    icon: "📝",
    description: "Include examples or references to clarify expectations",
    tips: [
      "Provide specific examples of what you want",
      "Use phrases like 'for example', 'such as', 'similar to', 'like'",
      "Include sample formats or structures",
      "Reference existing work or styles",
      "Show both good and bad examples when relevant",
    ],
    examples: {
      bad: "Write a social media post.",
      good: "Write a LinkedIn post similar to industry thought leaders like Seth Godin, including a personal story and actionable advice.",
    },
  },
  {
    category: "Structure",
    weight: "5%",
    icon: "🏗️",
    description: "Organize your prompt with clear structure and flow",
    tips: [
      "Use proper punctuation and grammar",
      "Break complex requests into numbered steps",
      "Use connecting words like 'first', 'then', 'finally'",
      "Separate different requirements clearly",
      "End with a clear question or call to action",
    ],
    examples: {
      bad: "write blog post marketing tips social media engagement",
      good: "Please write a blog post about marketing tips. First, focus on social media engagement strategies. Then, include 5 actionable tips with examples.",
    },
  },
];

// Quick Tips Data
const QUICK_TIPS = [
  {
    title: "🚀 Start Strong",
    description:
      'Begin with "Act as [role]" or "You are [expert]" to immediately establish context and persona.',
  },
  {
    title: "📊 Be Specific",
    description:
      "Include exact word counts, formats, and style requirements. Specificity always beats vagueness.",
  },
  {
    title: "🎯 Show Examples",
    description:
      "Reference existing work, styles, or provide sample formats to clarify your expectations.",
  },
  {
    title: "🔍 Add Context",
    description:
      "Explain who the audience is, what the purpose is, and why you need this content.",
  },
];

// Local Storage Keys
const STORAGE_KEYS = {
  HISTORY: "promptGraderHistory",
  SESSION: "promptGraderSession",
};

// App Routes
const ROUTES = {
  HOME: "/",
  HOW_TO_PROMPT: "/how-to-prompt",
  CONTACT: "/contact",
  FEEDBACK: "/feedback",
};

// External Links
const EXTERNAL_LINKS = {
  GITHUB: "https://github.com/danov6/prompt-corrector-tool",
};

// Email Configuration
const EMAIL_CONFIG = {
  RECIPIENT: process.env.EMAIL_RECIPIENT,
};

// Debounce Delay (milliseconds)
const DEBOUNCE_DELAY = 300;

// Maximum History Entries
const MAX_HISTORY_ENTRIES = 50;

// Maximum Suggestions to Display
const MAX_SUGGESTIONS = 6;

// Export all constants
module.exports = {
  API_CONFIG,
  GRADING_CRITERIA,
  SCORE_COLORS,
  SCORE_LABELS,
  CATEGORY_ICONS,
  PERFECT_PROMPT_EXAMPLE,
  CRITERIA_DATA,
  QUICK_TIPS,
  STORAGE_KEYS,
  ROUTES,
  EXTERNAL_LINKS,
  EMAIL_CONFIG,
  DEBOUNCE_DELAY,
  MAX_HISTORY_ENTRIES,
  MAX_SUGGESTIONS,
};
