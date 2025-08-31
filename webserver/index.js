// request reaches the index.js through the route,
// the route hands it over to the controller
// the controller saves the data with the model
// the model saves the data in the database

//1. Make express application
//2. Make a route using express router
//3. Make a CRUD API
const express = require('express');
const app = express();
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect')
require('dotenv').config()

app.use(express.json())
app.use('/api/v1/tasks', tasks)

// app.get('/api/v1/tasks') - get all tasks
// app.post('/api/v1/tasks') - create a new task
// app.get('/api/v1/tasks/:id') - get single task
// app.patch('/api/v1/tasks/:id') - update task
// app.delete('/api/v1/tasks/:id') - delete task

const port = 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(`Error occurred while connecting to db: ${error}`)
    }
}

start()
