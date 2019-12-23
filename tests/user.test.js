///////////////////////////////////////
//
// File to test task manager application.
//
///////////////////////////////////////

// Imports supertest npm library.
const request = require('supertest');
// Initializes express app.
const app = ('../scr/app');
// Impors User model.
const User = require('../src/models/user');

// Using jest for testing.

// Creates new user.
const userOne = {

  name: 'Mike',
  email: 'mike@example.com',
  password: '56what!!'

}

// Function call
// using async await.
// The purpose of this function is to wipe all the data from the database.
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
  await request(app).post('/users').send({

    // Configures data to be send.
    name: 'Jhoset',
    email: 'jhoset@example.com',
    password: 'MyPass777!'

  }).expect(201)

});


// Test case.
test('should login existing user', async () => {

  // Endpoint for posting.
  await request(app).post('/users/login').send({

    email: userOne.email,
    password: userOne.password

  }).expect(200)

});

// Test case.
test('Should not login nonexistent user', async() => {

  // Endpoint for posting.
  await request(app).post('/users/login').send({

    emai: userOne.email,
    password: 'thisisnotmypass'

  }).expect(400)

});
