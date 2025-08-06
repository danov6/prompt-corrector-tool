const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/prompts', require('./routes/prompts'));

app.get('/', (req, res) => {
  res.json({ message: 'Prompt Grader API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});