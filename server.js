const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
let auth = require('./auth');
let member = require('./member');
let middleware = require('./middleware');
var winston = require('./config/winston');

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  var chatRoute = express.Router();

  const port = process.env.PORT || 8000;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(morgan('combined', { stream: winston.stream }));

  // error handling
  app.use(middleware.handleError);

  // Routes & Handlers
  app.post('/login', auth.login);
  app.post('/join', member.join);
  app.get('/', middleware.checkToken, function (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  });

  //authRoute.use(middleware.checkToken);

  //authRoute.get('/me', );

  //app.use('/chat', authRoute);

  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();
