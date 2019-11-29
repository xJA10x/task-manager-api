
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
// Allows app to work on Heroku.
const port = process.env.PORT;

// Automatically parses json into an object.
app.use(express.json());
// register userRouter.
app.use(userRouter);
// registers testRouter.
app.use(taskRouter);

// Starts the server.
app.listen(port, () => {

  console.log('Server is up on port ' + port)

});
