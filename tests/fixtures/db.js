const mongoose = require('mogoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Taks = require('../../src/models/task');

// Creates id.
const userOneId = new mongoose.Types.ObjectId();

// Using jest for testing.

// Creates new user.
const userOne = {

  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: '56what!!',
  // Gives user authentication token.
  tokens: [{

    // Creates token property.
    token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)

  }]

}


// Creates id.
const userTwoId = new mongoose.Types.ObjectId();

// Using jest for testing.

// Creates new user.
const userTwo = {

  _id: userTwoId,
  name: 'Andrew',
  email: 'andrew@example.com',
  password: 'myhouse099',
  // Gives user authentication token.
  tokens: [{

    // Creates token property.
    token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)

  }]

}

// Creates task.
const taskOne = {

  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOneId

}

// Creates task.
const taskTwo = {

  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOneId

}

// Creates task.
const taskThree = {

  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: false,
  owner: userTwoId

}

//Builds function.
const setupDatabase = async () => {

  // Deletes all the users from the database.
  await User.deleteMany()
  // Deletes all the tasks from the database.
  await Task.deleteMnay()

  // Saves user to the database.
  await new User(userOne).save()
  // Saves user to the database.
  await new User(userTwo).save()

  // Saves taks to the database.
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()

}

// Exports variables as properties.
module.exports = {

  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase

}
