const jwt = require('jsonwebtoken');
const v = require('voca');
const bcrypt = require('bcrypt');
const config = require('./config/config');
const dao = require('./database/dao')
const util = require('util');
require('./common')();


const saltRounds = 10;
bcrypt.hash = util.promisify(bcrypt.hash);


class Auth {
  async login (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (v.isEmpty(username) || v.isEmpty(password)) {
      throw Error.create(-100, 'invalid parameter');
    }

    let userDao = new dao.ChatDao();
    var origEncPw = userDao.getEncPassword();
    var encPw = await bcrypt.hash(password, saltRounds);

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
        status: 0,
        message: 'Authentication successful!',
        token: token,
        refreshToken: refreshToken
      });
    } else {
      thow Error.create(-101, 'invali')
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