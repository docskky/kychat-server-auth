const jwt = require('jsonwebtoken');
const v = require('voca');
const bcrypt = require('bcrypt');
const config = require('./config/config');
const dao = require('./database/dao')
const util = require('util');
const status = require('./config/status');
const user = require('./model/model');
let middleware = require('./middleware');

require('./common')();


bcrypt.hash = util.promisify(bcrypt.hash);


class Auth {
  async login (req, res) {
    let username = req.body.id;
    let password = req.body.password;

    if (v.isEmpty(username) || v.isEmpty(password)) {
      middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
      return;
    }

    try {
      var origEncPw = dao.chat.getEncPassword();
      var encPw = await bcrypt.hash(password, config.saltRounds);
  
      if (origEncPw === encPw) {
        // valid login
        let token = jwt.sign({username: username},
          config.secret,
          { expiresIn: config.tokenLife
          }
        );
        let refreshToken = jwt.sign({username: username},
          config.refreshTokenSecret,
          { expiresIn: config.refreshTokenLife
          }
        );
  
        // return the JWT token for the future API calls
        res.json({
          status: status.success,
          message: 'Authentication successful!',
          token: token,
          refreshToken: refreshToken
        });
      } else {
        middleware.handleError(Error.create(status.invalidPassword, 'incorrect password'), req, res);
        return;
      }
    } catch (error) {
      middleware.handleError(error, req, res);
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