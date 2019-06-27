const jwt = require('jsonwebtoken');
const v = require('voca');
const bcrypt = require('bcrypt');
const config = require('./config/config');
const dao = require('./database/dao')
const util = require('util');
const status = require('./config/status');
const model = require('./model/model');

require('./common')();

bcrypt.hash = util.promisify(bcrypt.hash);


class Member {
    
  async login (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (v.isEmpty(username) || v.isEmpty(password)) {
      console.log('invalid parameter');return;
      //throw Error.create(-100, 'invalid parameter');
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
      console.log('incorrect password');
      //throw Error.create(status.invalidPassword, 'incorrect password');
    }
  }

  async join(req, res) {
    let password = req.body.password;

    var user = new model.ChatUser();
    user.id = req.body.id;
    user.name = req.body.name;
    user.fcm_token = req.body.fcm_token;

    if (v.isEmpty(user.id) || v.isEmpty(password)) {
      middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
      return;
    }

    try {
      user.password = await bcrypt.hash(password, config.saltRounds);  
      error = dao.chat.addUser(user);
      if (error) {
        middleware.handleError(error, req, res);
      } else {
        // return the JWT token for the future API calls
        res.json({
          status: status.success,
          message: 'Authentication successful!',
          token: token,
          refreshToken: refreshToken
        });
      }
    } catch (error) {
      middleware.handleError(error, req, res);
    }

  }

};

module.exports = new Member();