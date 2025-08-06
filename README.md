# Prompt Grader

A powerful tool to help users create better AI prompts with real-time grading and intelligent suggestions.

## Features

- **Real-time Prompt Scoring**: Get instant feedback as you type with scores from 0-100%
- **Intelligent Suggestions**: Receive specific recommendations to improve your prompts
- **Modern UI**: Clean, accessible interface with WCAG 2.0 AA compliance
- **Chat History**: Save and review your prompt history (stored locally)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
prompt-grader/
├── src/
│   ├── client/          # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── context/
│   │   │   └── services/
│   │   └── public/
│   └── server/          # Node.js backend
│       ├── routes/
│       └── services/
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both client and server:

```bash
npm run install-all
```

### Development

Run both client and server in development mode:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- React frontend on http://localhost:3000

### Individual Commands

- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend
- `npm run build` - Build the React app for production

## Grading Criteria

The prompt grader evaluates prompts based on:

- **Length** (15%): Optimal word count and detail level
- **Clarity** (25%): Clear instructions and question words
- **Specificity** (20%): Specific requirements and formatting
- **Context** (15%): Background information and purpose
- **Persona** (10%): Role assignment for the AI
- **Examples** (10%): References and examples provided
- **Structure** (5%): Overall organization and formatting

## API Endpoints

- `POST /api/prompts/grade` - Grade a prompt and return score
- `POST /api/prompts/suggestions` - Get improvement suggestions

## Technologies Used

### Frontend
- React 18
- React Router
- Context API for state management
- Axios for API calls
- CSS3 with modern features

### Backend
- Node.js
- Express.js
- CORS middleware

## Accessibility

This application follows WCAG 2.0 AA guidelines:
- Proper color contrast ratios
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Semantic HTML structure

## Future Enhancements

- MongoDB integration for persistent storage
- User authentication
- Advanced prompt templates
- Export functionality
- Prompt sharing features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details