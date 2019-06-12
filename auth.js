const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('./config');
const pool = require('./database');

const saltRounds = 10;

class Auth {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
      try {
        var rows = await pool.query('SELECT password FROM chatuser')
        var orig_pw = rows[0];
        var hpw = bcrypt.hash(password, saltRounds).then(
          function(hash) {
            if (orig_pw)
          }
        );
      } catch(err) {
        throw new Error(err)
      }


      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          config.secret,
          { expiresIn: '24h' // expires in 24 hours
          }
        );
          // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        res.send(403).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.send(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }

  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }
};



module.exports = new Auth();