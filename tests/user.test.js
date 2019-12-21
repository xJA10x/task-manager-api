// File to test task manager application.

// Imports supertest npm library.
const request = require('supertest');

// Initializes express app.
const app = ('../scr/app');

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
