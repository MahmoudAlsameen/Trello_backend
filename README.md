# Trello_backend

This is a Node.js and Express.js project that implements a RESTful API with several routes for managing users and tasks.

## User Routes

1. **Sign Up**
   - Endpoint: `/api/users/signUp`
   - Description: Register a new user.
   
2. **Login**
   - Endpoint: `/api/users/login`
   - Description: Log in and create an authentication token.

3. **Change Password**
   - Endpoint: `/api/users/changePassword`
   - Description: Change the user's password (user must be logged in).

4. **Update User**
   - Endpoint: `/api/users/updateUser`
   - Description: Update user details such as age, firstName, and lastName (user must be logged in).

5. **Delete User**
   - Endpoint: `/api/users/deleteUser`
   - Description: Delete the user account (user must be logged in).

6. **Soft Delete**
   - Endpoint: `/api/users/softDelete`
   - Description: Soft delete the user account (user must be logged in).

7. **Logout**
   - Endpoint: `/api/users/logout`
   - Description: Log out and invalidate the authentication token.

## Task Routes

1. **Add Task with Status (ToDo)**
   - Endpoint: `/api/tasks/addTask`
   - Description: Add a new task with a status of "ToDo" (user must be logged in).

2. **Update Task**
   - Endpoint: `/api/tasks/updateTask`
   - Description: Update task details such as title, description, and status (user must be logged in, creator only can update task).

3. **Delete Task**
   - Endpoint: `/api/tasks/deleteTask`
   - Description: Delete a task (user must be logged in, creator only can delete task).

4. **Get All Tasks with User Data**
   - Endpoint: `/api/tasks/getAllTasks`
   - Description: Retrieve all tasks with user data.

5. **Get All Tasks Not Done After Deadline**
   - Endpoint: `/api/tasks/getTasksNotDoneAfterDeadline`
   - Description: Retrieve all tasks that are not done after the deadline.

**Note**: Don't forget to get the user ID from the token for authentication and authorization purposes.

## Technologies Used

- Node.js
- Express.js
- Other relevant technologies or libraries you may have used.
