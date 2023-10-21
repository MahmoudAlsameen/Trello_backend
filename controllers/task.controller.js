import userModel from '../db/models/user.model.js'
import taskModel from '../db/models/task.model.js'
import {taskValidationSchema, updateTaskValidationSchema} from '../validation/task.validation.js'


import jwt from 'jsonwebtoken';



const addtask = async (req, res) => {
    try {
      if (!req.headers.token) {
        return res.status(401).json({ message: "Authentication token missing" });
      }
  
      // Verify the user's token and get their ID
      const userID = jwt.verify(req.headers.token, 'bl7 5ales').id;
      console.log('User identified:', userID);
  
      // Find the user by ID
      const targetedUser = await userModel.findById(userID);
  
      if (!targetedUser) {
          console.log("User not found")
        return res.status(404).json({ message: "User not found" });
      }
  
      // Define a function to validate user input
      const validateTask = (schema, source) => {
        const { error } = schema.validate(req[source]);
        return error;
      };
  
      // Validate the task data against the schema
      const taskValidationError = validateTask(taskValidationSchema, 'body');
  
      if (taskValidationError) {
         console.log( "Error validating task", taskValidationError)
        return res.status(400).json({ message: "Error validating task", error: taskValidationError });
      }
  
      // Create and save the task
      const taskObj = req.body;
      taskObj.creatorID=userID
      const newTask = new taskModel(taskObj);
      await newTask.save();
      await userModel.findByIdAndUpdate(userID, { createdTasks: newTask.id }, { new: true })
        await userModel.findByIdAndUpdate(newTask.assignedTo,{ $push: { assignedTasks: newTask } }, { new: true })
  
      res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (err) {
      console.error("Error adding task:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };





const updatetask = async (req,res)=>{
    try {
      if (!req.headers.token) {
        return res.status(401).json({ message: "Authentication token missing" });
      }
  
      // Verify the user's token and get their ID
      const userID = jwt.verify(req.headers.token, 'bl7 5ales').id;
      console.log('User identified:', userID);
  
      // Find the user by ID


      
      const taskAssignedToUser = await taskModel.find({assignedTo:userID});
      const creatorUser = await taskModel.find({creatorID:userID});

      if (!taskAssignedToUser && !creatorUser) {
        return res.status(404).json({ message: "Assigned User not found" });
      }
  
      // Define a function to validate user input
      const validateTask = (schema, source) => {
        const { error } = schema.validate(req[source]);
        return error;
      };
  
      // Validate the task data against the schema
      const updateTaskValidationError = validateTask(updateTaskValidationSchema, 'body');
  
      if (updateTaskValidationError) {
        console.log(updateTaskValidationError)
        return res.status(400).json({ message: "Error validating task", error: updateTaskValidationError });
      }
  
      // update task
      const updatedTask = req.body
console.log("updatedTask.id is :",updatedTask.id)
      const isUserArr = await userModel.findById(userID)
      const userCreatedTasks = isUserArr.createdTasks
      console.log('created tasks array of user: ',userCreatedTasks)
      let taskCreatorID= await taskModel.findById(updatedTask.id)
      if(!taskCreatorID){
        console.log("task not found");
        return res.status(401).json({ message: "task not found" });
      }
      taskCreatorID=taskCreatorID.creatorID
      console.log("taskCreatorID is : ",taskCreatorID)

      const fIsUserArr = userCreatedTasks.filter((task) => task.equals(updatedTask.id));
      console.log("fIsUserArr: ",fIsUserArr)
      console.log(fIsUserArr.length)
      taskAssignedToUser = taskAssignedToUser.find((task)=>task.id==updatedTask.id)
      if((fIsUserArr.length===1 && taskCreatorID.equals(userID)) || (taskAssignedToUser)){
        let targetedTask= await taskModel.findByIdAndUpdate(updatedTask.id, updatedTask, { new: true })
        console.log("Task updated successfully");
       return res.status(201).json({ message: "Task updated successfully", targetedTask });
      }else{
        console.log("User is not authorized to update this task");
        return res.status(401).json({ message: "User is not authorized to update this task" });
      }




    } catch (err) {
      console.error("Error updating task:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
    


const deletetask = async (req,res)=>{
    try {
      if (!req.headers.token) {
        return res.status(401).json({ message: "Authentication token missing" });
      }
  
      // Verify the user's token and get their ID
      const userID = jwt.verify(req.headers.token, 'bl7 5ales').id;
      console.log('User identified:', userID);
  
      // Find the user by ID
      const targetedUser = await userModel.findById(userID);
  
      if (!targetedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Define a function to validate user input
      const validateTask = (schema, source) => {
        const { error } = schema.validate(req[source]);
        return error;
      };
  
      // Validate the task data against the schema
      const updateTaskValidationError = validateTask(updateTaskValidationSchema, 'body');
  
      if (updateTaskValidationError) {
        console.log()
        return res.status(400).json({ message: "Error validating task", error: updateTaskValidationError });
      }
  
      // update task
      const updatedTask = req.body
console.log("deletedTask.id is :",updatedTask.id)
      const isUserArr = await userModel.findById(userID)
      const isUserArr2 = isUserArr.createdTasks
      console.log('created tasks array of user: ',isUserArr2)
      let taskCreatorID= await taskModel.findById(updatedTask.id)
      if(!taskCreatorID){
        console.log("task not found");
        return res.status(401).json({ message: "task not found" });
      }
      taskCreatorID=taskCreatorID.creatorID
      console.log("taskCreatorID is : ",taskCreatorID)

      const fIsUserArr = isUserArr2.filter((task) => task.equals(updatedTask.id));
      console.log("fIsUserArr: ",fIsUserArr)
      if(fIsUserArr.length===1 && taskCreatorID.equals(userID)){
        let targetedTask= await taskModel.findByIdAndDelete(updatedTask.id)
        console.log("Task deleted successfully");
       return res.status(201).json({ message: "Task deleted successfully", targetedTask });
      }else{
        console.log("User is not authorized to delete this task");
        return res.status(401).json({ message: "User is not authorized to delete this task" });
      }




    } catch (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
    

 const getaAllTasksForUser = async (req,res)=>{
    try {
       
      if (!req.headers.token) {
        return res.status(401).json({ message: "Authentication token missing" });
      }
  
      // Verify the user's token and get their ID
      const userID = jwt.verify(req.headers.token, 'bl7 5ales').id;
      console.log('User identified:', userID);
  
      // Find the user by ID
      const targetedUser = await userModel.findById(userID);
  
      if (!targetedUser) {
        console.log("User not found")
        return res.status(404).json({ message: "User not found" });
      }
        const allTasksWithUserData= await taskModel.find({ creatorID: userID }).populate('creatorID').populate('assignedTo')
        console.log("Task dispalyed successfully");
        return res.status(201).json({ message: "Task displayed successfully", allTasksWithUserData });

    } catch (err) {
        console.error("Error displaying task:", err);
        res.status(500).json({ message: "Error displaying task" });
      }
    };


    const getaAllTasksAssignedForUser = async (req,res)=>{
      try {
         
        if (!req.headers.token) {
          return res.status(401).json({ message: "Authentication token missing" });
        }
    
        // Verify the user's token and get their ID
        const userID = jwt.verify(req.headers.token, 'bl7 5ales').id;
        console.log('User identified:', userID);
    
        // Find the user by ID
        const targetedUser = await userModel.findById(userID);
    
        if (!targetedUser) {
          console.log("User not found")
          return res.status(404).json({ message: "User not found" });
        }
          const allTasksAssignedToUser= await taskModel.find({ assignedTo: userID }).populate('creatorID');
          console.log("Task dispalyed successfully");
          return res.status(201).json({ message: "Task displayed successfully", allTasksAssignedToUser });
  
      } catch (err) {
          console.error("Error displaying task:", err);
          res.status(500).json({ message: "Error displaying task" });
        }
      };



const getalltaskswithuserdata = async (req,res)=>{
    try {
       

        const allTasksWithUserData= await taskModel.find().populate('creatorID').populate('assignedTo')
        console.log("Task dispalyed successfully");
        return res.status(201).json({ message: "Task displayed successfully", allTasksWithUserData });

    } catch (err) {
        console.error("Error displaying task:", err);
        res.status(500).json({ message: "Error displaying task" });
      }
    };

const getalloverduetasks = async (req,res)=>{
    try {
        const allTasksWithUserData = await taskModel.find({}).populate('creatorID').populate('assignedTo');
        console.log("All tasks displayed successfully");
    
        // Filter overdue tasks
        const currentDate = new Date();
        const overdueTasks = allTasksWithUserData.filter((task) => {
          const taskDeadline = new Date(task.deadline);
          return taskDeadline < currentDate;
        });
    
        return res.status(201).json({ message: "Tasks displayed successfully", overdueTasks });
      } catch (err) {
        console.error("Error displaying tasks:", err);
        res.status(500).json({ message: "Error displaying tasks" });
      }
    };


export {addtask, updatetask, deletetask, getalltaskswithuserdata, getalloverduetasks, getaAllTasksForUser, getaAllTasksAssignedForUser}
