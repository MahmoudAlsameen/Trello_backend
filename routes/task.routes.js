import express from 'express';
import auth from '../middleware/auth.js';
import {
  addtask,
  updatetask,
  deletetask,
  getaAllTasksForUser,
  getalltaskswithuserdata,
  getalloverduetasks,
} from '../controllers/task.controller.js';

const taskRoutes = express.Router();

taskRoutes.post('/addtask', auth, addtask);
taskRoutes.put('/updatetask', auth, updatetask);
taskRoutes.delete('/deletetask', auth, deletetask);
taskRoutes.get('/getaAllTasksForUser', getaAllTasksForUser);
taskRoutes.get('/getalltaskswithuserdata', getalltaskswithuserdata);
taskRoutes.get('/getalloverduetasks', getalloverduetasks);

export default taskRoutes;
