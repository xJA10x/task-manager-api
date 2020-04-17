
const request = require('supertest');
// Initializes express app.
const app = ('../scr/app');
const Task = require('../src/models/task');
// uses object destructoring to grab variables and functions.
const {userOneId, userOne, setupDatabase } = require('./fixtures/db');

// Function call
// using async await.
// The purpose of this function is to wipe all the data from the database.
// Runs before each test case.
beforeEach(setupDatabase)


/////////
///
/// Endpoint for creating
//
/////////

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
