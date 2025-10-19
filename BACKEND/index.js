const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoute'));
app.use('/api/schedule', require('./routes/scheduleRoutes'));
app.use('/api/leave', require("./routes/leaveRoutes"));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
