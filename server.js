require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");


connectDB();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LearnBack API is running!');
});

app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/users', require('./routes/userRouters'));
app.use('/api/skills', require('./routes/skillroutes'));
app.use('/api/learninggoals', require('./routes/learninggoalroutes'));
app.use('/api/tests', require('./routes/testroutes'));


app.listen(PORT, () => {
  console.log(`Server is running  on port ${PORT}`);
});