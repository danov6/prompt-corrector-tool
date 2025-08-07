# Prompt Grader

A powerful tool to help users create better AI prompts with real-time grading and intelligent suggestions. Built with React and Parcel for a modern, fast development experience.

## Features

- **Real-time Prompt Scoring**: Get instant feedback as you type with scores from 0-100%
- **Enhanced Grading Algorithm**: 12+ criteria including persona, examples, specificity, and context
- **Intelligent Suggestions**: Receive specific recommendations to improve your prompts
- **Modern UI**: Clean, accessible interface with WCAG 2.0 AA compliance
- **Chat History**: Save and review your prompt history (stored locally, PostgreSQL ready)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Fast Development**: Built with Parcel for lightning-fast builds and hot reloading

## Project Structure

```
prompt-grader/
├── src/
│   ├── client/              # React frontend
│   │   ├── components/      # React components
│   │   ├── pages/          # React pages
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   ├── styles/         # Global styles
│   │   ├── index.html      # HTML entry point
│   │   └── index.js        # React entry point
│   └── server/             # Node.js backend
│       ├── routes/         # API routes
│       └── services/       # Business logic
├── package.json            # Dependencies and scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install all dependencies:

```bash
npm install
```

### Development

Run both client and server in development mode:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5001
- React frontend on http://localhost:3000 (with Parcel)

### Individual Commands

- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend with Parcel
- `npm run build` - Build the React app for production
- `npm run clean` - Clean build artifacts and cache

## Enhanced Grading Criteria

The prompt grader evaluates prompts based on:

- **Clarity** (25%): Clear instructions, action words, avoiding vague language
- **Specificity** (20%): Specific requirements, format, tone, constraints
- **Length** (15%): Optimal word count and detail level
- **Context** (15%): Background information, purpose, audience
- **Persona** (10%): Role assignment for the AI
- **Examples** (10%): References and examples provided
- **Structure** (5%): Overall organization and formatting

## Advanced Suggestions

The system provides intelligent suggestions for:
- Adding personas and roles
- Including specific examples
- Improving clarity and specificity
- Adding context and constraints
- Structuring requests properly
- Specifying output formats
- Defining tone and style

## API Endpoints

- `POST /api/prompts/grade` - Grade a prompt and return score
- `POST /api/prompts/suggestions` - Get improvement suggestions

## Technologies Used

### Frontend
- React 18
- React Router
- Context API for state management
- Axios for API calls
- Parcel for bundling and development
- Modern CSS with accessibility features

### Backend
- Node.js
- Express.js
- CORS middleware
- Enhanced prompt analysis algorithms

## Accessibility

This application follows WCAG 2.0 AA guidelines:
- Proper color contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Semantic HTML structure
- Skip links for navigation

## Future Enhancements

- PostgreSQL integration for persistent storage
- User authentication and profiles
- Advanced prompt templates and categories
- Export functionality (PDF, JSON)
- Prompt sharing and collaboration features
- Analytics and usage insights
- Multi-language support

## Development with Parcel

This project uses Parcel for fast development and building:

- **Hot Module Replacement**: Changes reflect instantly
- **Zero Configuration**: No complex webpack setup
- **Fast Builds**: Optimized for development speed
- **Modern JavaScript**: ES6+ support out of the box
- **CSS Processing**: Automatic vendor prefixing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details