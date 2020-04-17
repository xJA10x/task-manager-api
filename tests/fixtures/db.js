const mongoose = require('mogoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

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

//Builds function.
const setupDatabase = async () => {

  // Deletes all the users from the database.
  await User.deleteMany()
  // Saves user to the database.
  await new User(userOne).save()

}

// Exports variables as properties.
module.exports = {

  userOneId,
  userOne,
  setupDatabase

}
