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
// uses object destructoring to grab variables and functions.
const {userOneId, userOne, setupDatabase } = require('./fixtures/db');

// Function call
// using async await.
// The purpose of this function is to wipe all the data from the database.
// Runs before each test case.
beforeEach(setupDatabase)

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

/////
/// Endpoint for sending files
///
test('Should upload avatar image', async () => {

  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))

});

//
// Endpoint for updating.
//
test('Should update valid user fields', async () => {

  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Jess'
    })
    .expect(200)

    const user = await user.findById(userOneId)
    expect(user.name).toEqual('Jess')

});

//
/// Endpoint for not updating invalid users.
//
test('Should not update invalid user fields', async () => {

  await request(app)
  .patch('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    location: 'Philadelphia'
  })
  .expect(400)

});
