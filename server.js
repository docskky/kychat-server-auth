const express = require('express');
const bodyParser = require('body-parser');
let auth = require('./auth');
let middleware = require('./middleware');

// Starting point of the server
function main () {
  let app = express(); // Export app for other routes to use
  const port = process.env.PORT || 8000;
  app.use(bodyParser.urlencoded({ // Middleware
    extended: true
  }));
  app.use(bodyParser.json());
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
