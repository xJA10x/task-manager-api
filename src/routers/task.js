/***************************************

Task router

***************************************/

// loads express.
const express = require('express');
// loads task model.
const Task = require('../models/task');
// Loads auth middleware module.
const auth = require('../middleware/auth')
// Creates route.
const router = new express.Router();

/*

  Endpoints for CRUD operations.

*/
// Endpoint for posting.
// Url in postamn will look something
// like this,
// localhost:3000/tasks
router.post('/tasks', auth, async(req, res) => {


  const task = new Task({


    ...req.body,

    owner: req.user._id

  })

  try {

    await task.save()

    res.status(201).send(task)

  } catch(e) {


    res.status(400).send(e)

  }

});

router.get('/tasks', auth, async(req, res) => {

  // Builbs empty object.
  // Filters data to see which task data the user wants back.
  const match = {}
  // Builds empty object
  // for sorting data.
  const sort = {}

  // Runs if value is provided.
  if(req.query.completed) {

    match.completed = req.query.completed === 'true'

  }

  // Builds if statement.
  // Runs if sort by was provided
  // in the query string.
  if(req.query.sortBy) {

    // Brakes up the value.
    const parts = req.query.sortBy.split(':')
    // Grabs first item in the parts array
    // and uses it as name the of the property we are using on sort.
    // Determines if it is in accending or decending order.
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

  }

  try {

    await req.user.populate({

      path: 'tasks',
      match,
      // Options property that can
      // be use for pagenation.
      // It can also be used for sorting.
      options: {

        // Parses the query
        // if any to a value.
            // Limits the result to fetch back from the database.
        limit: parseInt(req.query.limit),
        // Property for skiping results.
        skip: parseInt(req.query.skip),
        // Property for sorting.
        sort

      }

    }).execPopulate()
    // Sends back respone.
    res.send(req.user.tasks)

  } catch(e) {

    // Sends back response if something went wrong.
    res.status(500).send()

  }

});

router.get('/tasks/:id', auth, async(req, res) => {

  // Gets value by id.
  const _id = req.params.id

  try {

    // Finds task by id of authenticated user.
    const task = await Task.findOne({_id, owner: req.user._id})

    if(!task) {

      return res.status(404).send()

    }

    res.send(task)

  } catch(e) {

    res.status(500).send()

  }

});


router.patch('/tasks/:id', auth, async (req, res) => {

  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']

  const isValidOperation = updates.every((update) => {

    return allowedUpdates.includes(update)

  });


  if(!isValidOperation) {


    return res.status(400).send({error: 'Invalid Updates'})

  }

  try {


    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

    await task.save()

    if(!task) {

      return res.status(404).send()

    }

    updates.forEach((update) =>  {

      task[update] = req.body[update]

    })

    res.send(task)

  } catch(e) {

    res.status(400).send(e)

  }

});

router.delete('/tasks/:id', auth, async (req, res) => {

  try {


    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

    if(!task) {

      res.status(404).send()

    }

    res.send(task)

  } catch(e) {

    res.status(500).send()

  }

});

// Exports router
// in order to have access to the routes in other modules.
module.exports = router;
