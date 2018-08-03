const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    const {
      firstName,
      lastName,
      // email,
      password
    } = body;
    let {
      email
    } = body;

    if (!firstName) {
      res.send({
        success: false,
        message: 'First name cannot be empty value.'
      });
    }
    if (!lastName) {
      res.send({
        success: false,
        message: 'Last name cannot be empty value.'
      });
    }
    if (!email) {
      res.send({
        success: false,
        message: 'Email name cannot be empty value.'
      });
    }
    if (!password) {
      res.send({
        success: false,
        message: 'Password name cannot be empty value.'
      });
    }

    email = email.toLowerCase();

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        res.send({
          succes: false,
          message: 'Error: Server error!'
        });
      } else if (users.length > 0 ) {
        res.send({
          success: false,
          message: 'Error: Account already exists'
        });
      }

      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          res.send({
            success: false,
            message: 'Error: server error'
          });
        }
        res.send({
          success: true,
          message: `User: ${user} created!`
        });
      });
    });
  });

  app.post('/api/account/signin', (req, res, next) => {
    const { body } = req;
    const {
      password
    } = body;
    let {
      email
    } = body;

    if (!email) {
      res.send({
        success: false,
        message: 'Email name cannot be empty value.'
      });
    }
    if (!password) {
      res.send({
        success: false,
        message: 'Password name cannot be empty value.'
      });
    }

    email = email.toLowerCase();

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Unknown error occurred'
        });
      }

      if (users.length < 1) {
        return res.json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Invalid password'
        });
      }

      let userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }

        return res.send({
          success: true,
          message: 'Signin successfull',
          token: doc._id
        });


      });
    });

  });

  app.get('/api/account/verify', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Token error occurred"
        });
      }

      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'No valid session found'
        });
      } else {
        return res.send({
          success: true,
          message: 'Token valid'
        });
      }
    });
  });

  app.get('/api/account/logout', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set:{
        isDeleted:true
      }
    }, null, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Token error occurred"
        });
      }

    
      return res.send({
        success: true,
        message: 'Logout successful'
      });
    
    });
  });
}