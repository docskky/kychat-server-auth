const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
let auth = require('./auth');
let middleware = require('./middleware');
var winston = require('./config/winston');

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  const port = process.env.PORT || 8000;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(morgan('combined', { stream: winston.stream }));

  // error handling
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    //res.status(err.status || 500);
    //res.render('error');
    if (err.status) {
      res.json({ status: err.status , message: error.message });
    } else {
      res.json({ status: -1 , message: 'Internal error has occurred.' });
    }
  });

  // Routes & Handlers
  app.post('/login', auth.login);
  app.get('/', middleware.checkToken, function (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  });
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();
