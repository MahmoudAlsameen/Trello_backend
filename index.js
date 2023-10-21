import express from 'express';
import connection from './db/connection.js';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import cors from 'cors'; // Import the cors middleware

const app = express();
const port = 3000;
app.use(express.json());

connection();

// Use the cors middleware to enable CORS and allow requests from 'http://localhost:5173'
app.use(cors({
  origin: ['http://localhost:5173','https://trello-3bdallah.vercel.app'] // Replace with your frontend's URL
  methods: 'GET,POST,PUT,DELETE',
}));


app.use(userRoutes);
app.use(taskRoutes);

app.get('/', (req, res) => {
  console.log('Home page');
  res.send('Home page');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
