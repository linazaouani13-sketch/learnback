require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");


connectDB();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LearnBack API is running!');
});

app.use('/api/auth', require('./routes/authroutes'));
app.use('/api/users', require('./routes/userroutes'));
app.use('/api/skills', require('./routes/skillroutes'));
app.use('/api/learninggoals', require('./routes/learninggoalroutes'));
app.use('/api/tests', require('./routes/testroutes'));
app.use('/api/match',require('./routes/matchingroutes'));
app.use('/api/courses', require('./routes/coursesroutes'));
app.use('/api/admin', require('./routes/adminroutes'));


app.listen(PORT, () => {
  console.log(`Server is running  on port ${PORT}`);
});