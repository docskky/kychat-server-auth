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


var Member = function() {
  var hash = util.promisify(bcrypt.hash);

  this.join = async (req, res) => {
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
      user.password = await hash(password, config.saltRounds);
      let error = await dao.addUser(user);
      console.debug('dao.addUser(user) = '+error);
      if (error) {
        middleware.handleError(error, req, res);
      } else {
        // return the JWT token for the future API calls
        res.json({
          status: status.success
        });
      }
    } catch (error) {
      middleware.handleError(error, req, res);
    }

  }

};

module.exports = new Member();