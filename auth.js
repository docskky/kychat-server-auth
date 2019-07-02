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


var Auth = function() {
  this.login = async (req, res) => {
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

        tokens = createTokens(username);
        // return the JWT token for the future API calls
        
        res.json(new model.Response({
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

  };

  this.refreshToken = async (req, res) => {
    let refreshToken = req.body.refreshToken;

    console.debug('refreshToken: '+refreshToken);
    if (v.isEmpty(refreshToken)) {
      middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
      return;
    }

    try {
      jwt.verify(refreshToken, config.refreshTokenSecret, (err, decoded) => {
        if (err) {
          console.log('jwt.verify error:'+err);
          middleware.handleError(Error.create(status.invalidToken, 'invalid token'), req, res);
        } else {
          console.debug('refresh token decoded: '+JSON.stringify(decoded));
          if (decoded['username']) {
            tokens = createTokens(decoded['username']);
            res.json(new model.Response({
              status: status.success,
              message: 'Token refresh successful!',
              result: tokens
            }));
          } else {
            middleware.handleError(Error.create(status.invalidToken, 'invalid token'), req, res);
            return;
          }
        }
      });
    } catch (error) {
      middleware.handleError(error, req, res);
    }
  }

  this.responseSuccess = async (req, res) => {

    res.json(new model.Response({
      status: status.success,
      message: 'Authentication successful!',
    }));
  };

  //
  //
  //

  // create tokens
  function createTokens(username) {
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
  };

};

module.exports = new Auth();