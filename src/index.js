// Main file for starting the server as development mode.

// Loads express application.
const app = require('./app');
// Allows app to work on Heroku.
const port = process.env.PORT;

// Starts the server.
app.listen(port, () => {

  console.log('Server is up on port ' + port)

});
