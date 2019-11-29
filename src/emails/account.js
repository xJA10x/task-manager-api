/*******************************

Module that contains all the
code from containing emails

********************************/

// imports sendGrid npm module.
const sgMail = require('@sendgrid/mail');

// Method call
// using object name.
// Takes one parameter,
// the environment variable that has the API key.
// Lets sendgrid module
// know when whant to work with the API key above.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Builds function.
// Takes two parameters,
// email address of the new user and
// the second one is for their name.
// function for sending emails to the
// new user.
const sendWelcomeEmail = (email, name) => {

  // Method call
  // using object name.
  // Takes one parameter,
  // an object with all the properties
  // to send individual email.
  sgMail.send({

    // Initializes properties.
    to: email,
    from: 'jhosetceron90@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`

  })

}

// Builds function.
// Takes two paratemers,
// email address of the user and
// the second one is for their name.
// Function for sending email when the
// user has deleted their account.
const sendCancelationEmail = (email, name) => {

  sgMail.send({

    to: email,
    from: 'jhosetceron90@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`

  })

}

// Exports function in order to
// be used by other files.
// By setting equal to an object,
// we can export multiple functions from this file
module.exports = {

  // Properties on the object we are exporting.
  sendWelcomeEmail,
  sendCancelationEmail

}
