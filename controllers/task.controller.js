import userModel from '../db/models/user.model.js'
import taskModel from '../db/models/task.model.js'
import commentModel from '../db/models/comment.model.js';
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
        taskObj.comments=[]
      const newTask = await taskModel.create(taskObj)
      await userModel.findByIdAndUpdate(userID, { $push: { createdTasks: newTask.id }}, { new: true })
      await userModel.findByIdAndUpdate(newTask.assignedTo,{ $push: { assignedTasks: newTask.id } },
        { new: true })
  
  
      res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (err) {
      console.error("Error adding task:", err);
      res.status(500).json({message: "Internal server error",err});
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


      
      let taskAssignedToUser = await taskModel.find({assignedTo:userID});
      const creatorUser = await taskModel.find({creatorID:userID});

      if (taskAssignedToUser.length==0 && !creatorUser) {
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
      const updatedTask = req.body // the updated task from body
console.log("updatedTask.id is :",updatedTask.id)
      const user = await userModel.findById(userID) // getting the user that created the task to make sure the created tasks inside is matching with the task id
      const userCreatedTasks = user.createdTasks // the array of tasks that user created
      const fIsUserArr = userCreatedTasks.filter((task) => task.equals(updatedTask.id)); // the array of tasks that matches the updated task id


      console.log('userCreatedTasks: ',userCreatedTasks)



      const taskByCreator= await taskModel.findById(updatedTask.id) // getting the task that i want to update
      if(!taskByCreator){
        console.log("task not found");
        return res.status(401).json({ message: "task not found" });
      }
      const taskCreatorID=taskByCreator.creatorID
      console.log("taskCreatorID is : ",taskCreatorID)

      console.log("fIsUserArr: ",fIsUserArr)
      taskAssignedToUser = taskAssignedToUser.find((task)=>task.id==updatedTask.id)
      if((fIsUserArr.length>0 && taskCreatorID == userID) || (true)){
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
  
      // Validation section
  
      // update task
      const deletedTaskID = req.params.taskID
console.log("deletedTask.id is :",deletedTaskID)
      const isUserArr = await userModel.findById(userID)
      const isUserArr2 = isUserArr.createdTasks
      console.log('created tasks array of user: ',isUserArr2)
      let taskCreatorID= await taskModel.findById(deletedTaskID)
      if(!taskCreatorID){
        console.log("task not found");
        return res.status(401).json({ message: "task not found" });
      }
      taskCreatorID=taskCreatorID.creatorID
      console.log("taskCreatorID is : ",taskCreatorID)

      
      if(taskCreatorID== userID){
        let targetedTask= await taskModel.findByIdAndDelete(deletedTaskID)
         const newisUserArr2=isUserArr2.filter((task)=>{task.id !=deletedTaskID})
         await userModel.findByIdAndUpdate(userID,{ $set: { createdTasks: newisUserArr2 } }, { new: true })
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
        const allTasksWithUserData= await taskModel.find({ creatorID: userID }).populate('creatorID').populate('assignedTo').populate({
          path: 'comments',
          populate: {
            path: 'creatorID',
            model: 'User'
          },
        })
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
          const allTasksAssignedToUser= await taskModel.find({ assignedTo: userID }).populate('creatorID').populate({
          path: 'comments',
          populate: {
            path: 'creatorID',
            model: 'User'
          },
        })
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

    const addTaskComments = async (req,res)=>{
      try{
      if (!req.headers.token) {
        return res.status(401).json({ message: "Authentication token missing" });
      }
      const userID = jwt.verify(req.headers.token, 'bl7 5ales').id;
      console.log('User identified:', userID);
      const targetedUser= await userModel.findById(userID)
      if(!targetedUser){
        console.log("user not found")
        return res.status(401).json({message:"user not found" })
      }
          const {taskID, text}=req.body
      if(!taskID){
        console.log("no task id")
        return res.status(401).json({message:"no task id" })
      }
     if(!text){
      console.log("invalid task comment")
      return res.status(401).json({message:"invalid task comment" })
     }
     const updatedTaskID = await taskModel.findById(taskID)
     if(!updatedTaskID){
      console.log("task not found")
        return res.status(401).json({message:"task not found" })
     }

     const addedComment = await commentModel.create({...req.body,creatorID:userID})

     const updatedTask = await taskModel.findByIdAndUpdate(taskID,{$push:{comments:addedComment.id}},{new:true})

     console.log("comment added successfully","comment: ", addedComment, "updatedTask: ", updatedTask)
      return res.status(200).json({message:"comment added successfully",comment: addedComment, updatedTask: updatedTask })

    }catch(err){
      console.log("catch error ", err)
      return res.status(401).json({message:"catch error ", err })
    }
    }


    const deleteTaskComments = async (req,res)=>{

      try{
        if (!req.headers.token) {
          return res.status(401).json({ message: "Authentication token missing" });
        }
        const userID = jwt.verify(req.headers.token, 'bl7 5ales').id;
        console.log('User identified:', userID);
        const targetedUser= await userModel.findById(userID)
        if(!targetedUser){
          console.log("user not found")
          return res.status(401).json({message:"user not found" })
        }
        const deletedCommentID = req.params.commentID
        const deletedComment = await commentModel.findById(deletedCommentID)
        if(!deletedComment){
          console.log("comment not found");
          return res.status(401).json({message:"comment not found" })
        }

        if(deletedComment.creatorID !=userID ){
          console.log("user not authorized")
          return res.status(401).json({message:"user not authorized" })
        }
      
        const taskAfterCommentDeleted1 = await taskModel.findById(deletedComment.taskID)
        const taskAfterCommentDeletedArr = taskAfterCommentDeleted1.comments.filter((comment) => comment.id != deletedCommentID);

        const deletedCommentUpdated = await commentModel.findByIdAndDelete(deletedCommentID)
        const taskAfterCommentDeleted = await taskModel.findByIdAndUpdate(deletedComment.taskID, {comments:taskAfterCommentDeletedArr},{new:true})

        console.log("comment deleted successfully: ",deletedCommentUpdated,"task after comment deleted: ", taskAfterCommentDeleted)
        return res.status(200).json({message:"comment deleted successfully: ",deletedComment:deletedCommentUpdated,taskAfterCommentDeleted: taskAfterCommentDeleted })
      }catch(err){
        console.log("catch error ", err)
        return res.status(401).json({message:"catch error ", err })
      }
      }


export {addtask, updatetask, deletetask, getalltaskswithuserdata, getalloverduetasks, getaAllTasksForUser, getaAllTasksAssignedForUser, deleteTaskComments, addTaskComments}
