import express from 'express'
import connection from './db/connection.js'
import userRoutes from './routes/user.routes.js'
import taskRoutes from './routes/task.routes.js'


const app = express();
const port=3000;
app.use(express.json())


connection()

app.use(userRoutes)
app.use(taskRoutes)

app.get('/',(req,res)=>{
    console.log('Home page')
    res.send('Home page')})


    app.listen(port,() => console.log(`Example app listening on port ${port}!`))