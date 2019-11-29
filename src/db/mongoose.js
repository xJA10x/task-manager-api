/************************************

Moongoose

*************************************/

// Function call.
// Takes one parameter,
// loads mongoose npm library.
// Stores output in the variable mongoose.
const mongoose = require('mongoose');

// Function call
// using object name.
// Takes one parameter,
// Connects to the database.
// Takes two parameters,
// the enviroment variable that contains conection
// to database, name of database collection to create, followed
// by options object.
mongoose.connect(process.env.MONGODB_URL, {

  // Configures URL parser.
  useNewUrlParser: true,
  // Indexes are created to access the
  // data we need.
  useCreateIndex: true,
  // Adress deprecation warning
  useFindAndModify: false

});
