/**************************************

middleware

**************************************/

  // loads json webtoken library in
  const jwt = require('jsonwebtoken');
  // laods user module.
  const User = require('../models/user');

  // Builds async function.
  // Takes one parameter,
  // the function that is going to run
  // between the request coming to the server and the
  // router handler actually running.
  // Register middleware function.
  // Next is specific to regestering middleware.
  // Middleware function.
  const auth = async (req, res, next) => {

    // Code that validates the user.
    try {

      // Function call
      // using object name.
      // Takes one parameter,
      // the name of the header we are trying to get access to.
      // Gets value for specific header.
      // replace method remover header name.
      const token = req.header('Authorization').replace('Bearer ', '')

      // Function call
      // using object name.
      // Takes two parameters,
      // the token to be verified and the secret we use to
      // generate it.
      // Validates json webtoken.
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Function call
      // using object name and await operator.
      // Takes two parameters,
      // an object with a search criteria and a string
      // that contains a property name that is going to look for the user that
      // has a token value in one of their arrays value.
      // Runs if token is valid
      // and finds user in the database.
      const user = await User.findOne({ _id: decoded._id, 'tokens.token' : token })

      if(!user) {

        throw new Error()

      }

      // Stores token that was used.
      // Gives other route handler access to this token
      // in order to delete it from that user profile.
      req.token = token
      // Give access to user.
      req.user = user

      next()

    } catch(e) {
      
      res.status(401).send({error: 'Please authenticate'})

    }

  }

  // Exports function
  // in order to be accessed outside the scope of this module.
  module.exports = auth;
