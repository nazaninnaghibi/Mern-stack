const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/api/userRoute');
const authRoute = require('./routes/api/authRoute');
const flightRoute = require('./routes/api/flightRoute');
const raserRoute = require('./routes/api/raserRoute');
const postRoutes = require('./routes/api/posts');
const connectDB = require('./config/connectDB');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/api/users');

const app = express();

//coneect to db
connectDB();

//set a middleware to parse dat
app.use(express.json());
app.use(cors());


app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/flight',flightRoute);
app.use('/api/reserve',raserRoute);
app.use('/posts',postRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server started');
});

