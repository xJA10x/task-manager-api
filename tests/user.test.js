///////////////////////////////////////
//
// File to test task manager application.
//
///////////////////////////////////////

// Imports supertest npm library.
const request = require('supertest');
// Imports jwt to genarate json web token
const jwt = require('jsonwebtoken');
// Imports mongoose npm library.
const mongoose = require('mongoose');
// Initializes express app.
const app = ('../scr/app');
// Impors User model.
const User = require('../src/models/user');


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

// Function call
// using async await.
// The purpose of this function is to wipe all the data from the database.
// Runs before each test case.
beforeEach(async () => {

  // Deletes all the users from the database.
  await User.deleteMany()

  // Saves user to the database.
  await new User(userOne).save()

});

// Function call.
// Takes one parameter,
// the name of the test case we want to provide,
// and a callback function.
// Makes request to express application
// from test cases.
test('Should signup a new user', async () => {

  //////////////////////////////////////////////////
  //
  // Here we can create endpoints for testing using the
  // four crud operations such
  // as post, get, patch, delete.
  //
  //////////////////////////////////////////////////

  // Function call
  // Using await operator.
  // Takes one parameter,
  // the express application.
  // By using await, it makes sure the request finishes
  // before test figures out if it is a success or a failure.
  // post takes the path to the url.
  // send allows us to provide an object containing our data.
  // Endpoint for posting.
  // Assertions expects for something to happen after the request is made.
  const respone = await request(app).post('/users').send({

    // Configures data to be send.
    name: 'Jhoset',
    email: 'jhoset@example.com',
    password: 'MyPass777!'

  }).expect(201)

  // Fetching the user from the database.
  // Assert that the database was changed correctly.
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assert from the response body.
  expect(response.body).toMatchObject({

    user: {

      name: 'Jhoset',
      email: 'jhoset@example.com'

    },

    token: user.tokens[0].token

  })

  expect(user.password).not.toBe('MyPass777!')

});

// Test case.
test('should login existing user', async () => {

  // Endpoint for posting.
  const response = await request(app).post('/users/login').send({

    email: userOne.email,
    password: userOne.password

  }).expect(200)

  // Fetches user from the database.
  const user = await user.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)

});

// Test case.
test('Should not login nonexistent user', async() => {

  // Endpoint for posting.
  await request(app).post('/users/login').send({

    emai: userOne.email,
    password: 'thisisnotmypass'

  }).expect(400)

});

////////////////////////////////////////
//
//  Endpoint for getting user profile
//
///////////////////////////////////////

test('should get profile for user', async () => {

  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expext(200)

});

test('Should not get profile for unauthenticated user', async() => {

  await request(app)
    .get('/users/me')
    .send()
    .expect(401)

});

/////////////////////////////////////////
//
//  Endpoint for user to close their account
//
//////////////////////////////////////////

test('should delete account for user', async() => {

  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    // Fetches the user.
    const user = await User.findById(userOneId)
    expect(user).toBeNull()

});

test('should not delete account for unauthenticated user', async() => {

  await request(app)
    .delete('/users/me')
    .send()
    .expext(401)

});
