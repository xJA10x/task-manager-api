/***********************************

User router

**********************************/

// loads express libray.
const express = require('express');
// loads multer npm library.
const multer = require('multer');
// loads user model.
const User = require('../models/user');
// loads auth module.
const auth = require('../middleware/auth');
// loads account module.
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account');

//  syntax for creating a new router.
const router = new express.Router();

/*
  Endoints for CRUD operations.
*/
// Endpoints for posting.
// Url in postman will look something like this.
// localhost:3000/users
router.post('/users', async (req, res) => {

  const user = new User(req.body)

  try {

    await user.save()

    sendWelcomeEmail(user.email, user.name)

    const token = await user.generateAuthToken()

    res.status(201).send({user, token})

  } catch(e) {

    res.status(400).send(e)

  }

});


router.post('/users/login', async (req, res) => {

  try {

    const user = await User.findByCredentials(req.body.email, req.body.password)

    const token = await user.generateAuthToken()

    res.send({user, token})

  } catch(e) {

    res.status(400).send()

  }

});


router.get('/users/me', auth, async (req, res) => {

  res.send(req.user)

});


router.post('/users/logout', auth, async (req, res) => {

  try {

    req.user.tokens = req.user.tokens.filter((token) => {

      return token.token !== req.token

    })

    await req.user.save()

    res.send()

    await req.user.save()

  } catch(e) {

    res.status(500).send()

  }

});

router.post('/users/logoutAll', auth, async (req, res) => {

  try {

    req.user.tokens = []

    await req.user.save()

    res.send()

  } catch(e) {

    res.status(500).send()

  }

});

router.patch('/users/me', auth, async (req, res) => {

  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']

  const isValidOperation = updates.every((update) => {

    return allowedUpdates.includes(update)

  })

  if(!isValidOperation) {

    return res.status(400).send({ error: 'Invalid updates'})

  }

  try {

    updates.forEach((update) =>  {

      req.user[update] = req.body[update]

    })

    await req.user.save()

    res.send(req.user)

  } catch(e) {

    res.status(400).send(e);

  }

});

router.delete('/users/me', auth, async (req, res) => {

  try {

    await req.user.remove()

    sendCancelationEmail(req.user.email, req.user.name)

    res.send(req.user)

  } catch(e) {

    res.status(500).send()

  }

});

const upload = multer({

  limits: {

    fileSize: 1000000

  },

  fileFilter(req, file, cb) {


    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {

      return cb(new Error('Please upload an image'))

    }

    cb(undefined, true)

  }

});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

  req.user.avatar = req.file.buffer

  await req.user.save()

  res.send()

}, (error, req, res, next) => {

  res.status(400).send({error: error.message})

});

router.delete('/users/me/avatar', auth, async (req, res) => {

  req.user.avatar = undefined

  await req.user.save()

  res.send()

});

router.get('/users/:id/avatar',   async (req, res) => {

  try {

    const user = await User.findById(req.params.id)

    if(!user || !user.avatar) {

      throw new Error()

    }

    res.set('Content-Type', 'image/jpg')

    res.send(user.avatar)

  } catch(e) {

    res.status(404).send()

  }

});

// Exports router
// in order to have access to the routes in other modules.
module.exports = router;
