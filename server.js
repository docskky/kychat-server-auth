const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
let auth = require('./auth');
let chat = require('./chat_service');
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
  app.post('/refresh_token', auth.refreshToken);
  app.get('/', middleware.checkToken, auth.responseSuccess);
  app.post('/chat/create_room', middleware.checkToken, chat.createRoom);
  app.post('/chat/join_room', middleware.checkToken, chat.joinRoom);
  app.post('/chat/exit_room', middleware.checkToken, chat.exitRoom);
  app.post('/chat/message', middleware.checkToken, chat.sendMessage);
  app.post('/login_kakao', auth.loginKakao);
  
  //authRoute.use(middleware.checkToken);

  //authRoute.get('/me', );

  //app.use('/chat', authRoute);

  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();
