const jwt = require('jsonwebtoken');
const v = require('voca');
const bcrypt = require('bcrypt');
const config = require('./config/config');
const dao = require('./database/dao')
const util = require('util');
const status = require('./config/status');
const model = require('./model/model');
let middleware = require('./middleware');

require('./common')();


bcrypt.hash = util.promisify(bcrypt.hash);


var Auth = {
  login : async (req, res) => {
    let username = req.body.id;
    let password = req.body.password;

    if (v.isEmpty(username) || v.isEmpty(password)) {
      middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
      return;
    }

    try {
      var pwHash = await dao.getEncPassword(username);
      const match = await bcrypt.compare(password, pwHash);
      if (match) {

        tokens = this._createTokens(username);
        // return the JWT token for the future API calls
        
        res.json(new model.Response({
          status: status.success,
          message: 'Authentication successful!',
          result: tokens
        }));
      } else {
        middleware.handleError(Error.create(status.invalidPassword, 'incorrect password'), req, res);
        return;
      }
    } catch (error) {
      middleware.handleError(error, req, res);
    }

  },

  refreshToken : async (req, res) => {
    let refreshToken = req.body.refreshToken;

    if (v.isEmpty(refreshToken)) {
      middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
      return;
    }

    try {
      var decoded = jwt.verify(refreshToken, config.secret);
      if (decoded && decoded.username) {
        tokens = this._createTokens(username);
        res.json(new model.Response({
          status: status.success,
          message: 'Authentication successful!',
          result: tokens
        }));
      } else {
        middleware.handleError(Error.create(status.invalidToken, 'invalid token'), req, res);
        return;
      }
    } catch (error) {
      middleware.handleError(error, req, res);
    }
  },

  responseSuccess: async (req, res) => {

    res.json(new model.Response({
      status: status.success,
      message: 'Authentication successful!',
    }));
  },

  //
  //
  //

  // create tokens
  _createTokens: (username) => {
    // valid login
    let token = jwt.sign({username: username},
      config.secret,
      { expiresIn: config.tokenTTL }
    );
    let refreshToken = jwt.sign({username: username},
      config.refreshTokenSecret,
      { expiresIn: config.refreshTokenTTL
      }
    );

    return {
      accessToken: token,
      refreshToken: refreshToken
    };
  }
  

};

module.exports = new Auth();