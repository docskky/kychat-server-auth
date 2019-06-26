const jwt = require('jsonwebtoken');
const v = require('voca');
const bcrypt = require('bcrypt');
const config = require('./config/config');
const dao = require('./database/dao')
const util = require('util');
const status = require('./config/status');
const user = require('./model/user');

require('./common')();

bcrypt.hash = util.promisify(bcrypt.hash);


class Member {
    
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
        status: status.success,
        message: 'Authentication successful!',
        token: token,
        refreshToken: refreshToken
      });
    } else {
      throw Error.create(status.invalidPassword, 'incorrect password');
    }
  }

  async join(req, res) {
    let password = req.body.password;

    var user = new user();
    user.id = req.body.id;
    user.name = req.body.name;
    user.fcm_token = req.body.fcm_token;

    if (v.isEmpty(username) || v.isEmpty(password)) {
      throw Error.create(status.invalidParameter, 'invalid parameter');
    }

    user.password = await bcrypt.hash(password, saltRounds);
    let userDao = new dao.ChatDao();

    userDao.addUser(user);

  }

};

module.exports = new Member();