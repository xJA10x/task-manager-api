// Main file for testing.


// loads express.
const express = require('express');
// loads Moongoose file.
require('./db/mongoose');
// loads user router module.
const userRouter = require('./routers/user');
// loads task router module.
const taskRouter = require('./routers/task');

// Stars express app.
const app = express();

// Automatically parses json into an object.
app.use(express.json());
// register userRouter.
app.use(userRouter);
// registers testRouter.
app.use(taskRouter);

// Exports module so that it can be used in other modules.
module.exports = app;
