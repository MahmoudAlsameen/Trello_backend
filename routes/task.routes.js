import express from 'express';
import auth from '../middleware/auth.js';
import {
  addtask,
  updatetask,
  deletetask,
  getaAllTasksForUser,
  getalltaskswithuserdata,
  getalloverduetasks,
  getaAllTasksAssignedForUser, deleteTaskComments,
  addTaskComments
} from '../controllers/task.controller.js';

const taskRoutes = express.Router();

taskRoutes.post('/addtask', auth, addtask);
taskRoutes.put('/updatetask', auth, updatetask);
taskRoutes.delete('/deletetask/:taskID', auth, deletetask);
taskRoutes.get('/getaAllTasksAssignedForUser', getaAllTasksAssignedForUser);
taskRoutes.get('/getaAllTasksForUser', getaAllTasksForUser);
taskRoutes.get('/getalltaskswithuserdata', getalltaskswithuserdata);
taskRoutes.get('/getalloverduetasks', getalloverduetasks);
taskRoutes.post('/addTaskComments/', addTaskComments);
taskRoutes.delete('/deleteTaskComments/:commentID', deleteTaskComments);

export default taskRoutes;
