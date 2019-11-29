/**********************************

User model

***********************************/


// loads mongoose npm library.
const mongoose = require('mongoose');
// loads validator npm library.
const validator = require('validator');
// loads bcrypt npm module.
const bcrypt = require('bcryptjs');
// loads jsonwebtoken npm module.
const jwt = require('jsonwebtoken');
// loads the task model.
const Task = require('./task');

// Defines properties for schema.
// Takes two parameters,
// an object that defines all the properties
// for the schema, and a timestamp.
const userSchema = new mongoose.Schema({

  // Defines fields in the document
  // as properties on this object.
  name: {

    // Defines types for fields.
    // Uses data zanitation to
    // make sure user's don't have
    // spaces on their name.
    type: String,
    required: true,
    trim: true

  },
  email: {

    // Tream spaces before and after.
    // Converts email to lowercase before saving it.
    type: String,
    // Creates index in moongodb database
    // to creat unineques.
    unique: true,
    requiered: true,
    trim: true,
    lowercase: true,
    // Builds validate method.
    // Takes one parameter,
    // value to validate.
    validate(value) {

      // Builds if statement.
      // Method call
      // using object name.
      if(!validator.isEmail(value)) {

        throw new Error('Email is invalid')

      }

    }

  },
  password: {

    // Defines types for field.
    // Uses data validation and data
    // zanitation.
    type: String,
    requiered: true,
    minlength: 7,
    trim: true,
    // Builds function for
    // data validation.
    // Takes one parameter,
    // the value we are evaluating.
    validate(value) {

      // Builds if statement.
      if(value.toLowerCase().includes('password')) {

        throw new Error('Password cannot contain "Password"')

      }

    }

  },
  age: {

    type: Number,
    default: 0,
    // Builds function for data
    // validation.
    // Takes one parameter,
    // the value we are evaluating.
    validate(value) {

      // Builds if statement.
      // Runs validation.
      // For example,
      // people cannot enter negative numbers for
      // their age.
      if(value < 0) {

        throw new Error('Age must be a positive number')

      }

    }

  },
  // Builds property
  // that stores an array of objects.
  tokens: [{

    // Each object will have fields of its own.
    token: {

      type: String,
      required: true

    }

  }],
  // Builds object(field).
  avatar: {

    type: Buffer

  }

},{

  // Property enables timestamps.
  timestamps: true

});

// Builds virtual property.
// Takes two parameters,
// the name for our virtual field and
// object to configure the individual field.
// Sets up virtual attributes on property.
// This is not stored in the database.
// This allows moongoose to see how users and tasks are related.
userSchema.virtual('tasks', {

  ref: 'Task',
  // Property where local data is stored.
  localField: '_id',
  // Created relantionship
  foreignField: 'owner'

});

// Builds function.
// Takes no parameters.
// Only renders public data and
// hides private data about the user.
userSchema.methods.toJSON = function() {

  // Access individual user.
  const user = this
  // Returns back an objec with
  // just our user data.
  const userObject = user.toObject()

  // Change what we want to expose
  // about the user data.
  // Deleters properties we don want to expose.
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  // Returns raw profile data.
  return userObject

}

// Builds async function.
// The purpose of this function is to
// generate a token.
userSchema.methods.generateAuthToken = async function() {

  // Access individual user.
  const user = this

  // Method call
  // using object name await operator.
  // Takes three parameters,
  // the first is an object and the
  // second is a string which contains a secret, and finally an object to expire the json webtoken.
  // The object contains the data that it is going to be embedded in
  // your token, in this example is an id for the user.
  // Generates json web token.
  // Stores output in the variable token.
  const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)

  // Adds token to the array
  // ands saves the user so that
  // the token shows up in the database.
  user.tokens = user.tokens.concat({ token })

  // Method call
  // using object name and await operator.
  // Saves token to the database.
  await user.save()

  // Returns token.
  return token

}

// Builds async function.
// Takes two parametes,
// the email and password to check.
// Method for login user.
userSchema.statics.findByCredentials = async (email, password) => {

  // Method call
  // using object name
  // and await operator.
  // Takes one pameter,
  // an object with the search criteria.
  // Finds user by email.
  const user = await User.findOne({ email })

  // Run if there is not user with that email.
  if(!user) {

    // Ends execution of function
    throw new Error('Unable to login')

  }

  // Method call
  // using object name
  // and await operator.
  // Takes one parameter,
  // an object with the search criteria.
  // Finds user by password.
  const isMatch = await bcrypt.compare(password, user.password)

  // Runs if there is not user with that password.
  if(!isMatch) {

    // Ends execution of function.
    throw new Error('Unable to login')

  }

  // Codes that runs if the criteria was found.
  return user

}

// Method call
// using object name.
// Takes two parameters,
// the first is the name of the event
// and the second is an async function to run.
// Does something before an event.
// Hash the plain text password before saving.
userSchema.pre('save',  async function(next) {

  // Gives access to individual user that it is about to be saved.
  const user = this

  // Method call
  // using object name.
  // Takes one parameter,
  // the property to check.
  // Makes sure users password is already hashed.
  if(user.isModified('password')) {

    // Method call
    // using object name.
    // Takes two parameters,
    // the first is the thing to hash and
    // the second is the number of rounds.
    user.password = await bcrypt.hash(user.password, 8)

  }

  // Function call.
  // next is called when we are done.
  next()

});

// Builds async function.
// Creates middleware to delete user task when
// user is removed.
userSchema.pre('remove', async function(next) {

  // Gives access to individual user that it is about to be saved.
  const user = this

  // Method call
  // using object name and await operator.
  // Takes one parameter,
  // our criteria for deleting.
  // Deletes task using just the owner field.
  await Task.deleteMany({ owner: user._id})

  // Function call.
  // Lets moongoose know when we are done running our code.
  next()

});

// Method call
// using object name.
// Takes two parameters,
// the first is the string name for
// your model and the second is the
// definition where we define all the fields we want.
// Stores output in the variable User.
// Defines user model.
const User = mongoose.model('User', userSchema);

// Exports User model.
module.exports = User;
