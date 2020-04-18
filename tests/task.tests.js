
const request = require('supertest');
// Initializes express app.
const app = ('../scr/app');
const Task = require('../src/models/task');
// uses object destructoring to grab variables and functions from the db module.
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase } = require('./fixtures/db');

// Function call
// using async await.
// The purpose of this function is to wipe all the data from the database.
// Runs before each test case.
beforeEach(setupDatabase)

////////////////////////////////
///
/// Endpoint for creating
//
///////////////////////////////

test('Should create task for user', async () => {

  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.token[0].token}`)
    .send({

      description: 'From my test'

    })
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)

});

/////////////////////////////////////
////
///   Endpoint for getting tasks
///
///////////////////////////////////////

test('Should fetch user tasks', async () => {

  const response = await request(app)
    // endpoint
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(2)

});

//////////////////////////////////////////
///
// Endpoint for deleting task
//
//////////////////////////////////////////

test('Should not delete other users tasks', async () => {

  const response = await request(app)
    // Endpoint
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
  const task = Task.findById(taskOne._id)
  expect(task).not.toBeNull()

});
