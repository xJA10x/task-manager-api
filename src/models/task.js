/***************************************

Task model

***************************************/

// loads mongoose npm library.
const mongoose = require('mongoose');

// Defines properties for schema.
// Takes two parameters,
// an object that defines all the properties
// for the schema, and a timestamp.
const taskSchema = new mongoose.Schema({

  // Defines fields in the document
  // as properties on this object.
  description: {

    // Defines types for field.
    // Uses data validation and data
    // zanitation.
    type: String,
    required: true,
    trim: true

  },
  // Field
  completed: {

    // Properties.
    type: Boolean,
    default: false

  },
  owner: {

    // Stores id of user who
    // created the task.
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Allows to create a reference from this field to another module.
    // Creates reference to a user.
    // Allows to fetch the entire user profile.
    ref: 'User'

  }

}, {

  // Initializes property.
  timestamps: true

});

// Method call
// using object name.
// Takes two parameters,
// the first one is the string name for
// your model and the second is the schema.
// Defines task model.
// By using schemas,
// we can take advantage all the things that we can
// customize when we have a schema.
const Task = mongoose.model('Task', taskSchema);

// Expots task model.
module.exports = Task;
