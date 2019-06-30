let jwt = require('jsonwebtoken');
const config = require('./config/config');
var winston = require('./config/winston');
const model = require('./model/model');
const status = require('./config/status');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        console.log('jwt.verify error:'+err);
        return res.json(new model.Response({
          status: status.invalidToken,
          message: 'Invalid token'
        }));
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let handleError = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err);
  winston.error(err);

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
  if (err.status) {
    res.json({ status: err.status , message: err.message });
  } else {
    res.json({ status: -1 , messawge: 'Internal error has occurred.' });
  }
};

module.exports = {
  checkToken: checkToken,
  handleError: handleError
};
