const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const port = process.env.PORT || 4600;
const routes = require('./server/routes/routes');
const winston = require('winston'), expressWinston = require('express-winston');
const mongoose = require('mongoose');

require('./server/models/User');

mongoose.connect('mongodb://localhost/passport-tutorial');
app.use(express.static(path.join(__dirname, 'dist/clusterApp')));
app.use(bodyParser.json());
app.use(expressJwt({secret: 'todo-app-super-shared-secret'}).unless({path: ['/api/auth']}));


var options = {
  file: {
    level: 'info',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};


app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(options.console)
  ]
}));

app.use('/routes', routes);

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(options.console)
  ]
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/clusterApp/index.html'))
});

app.listen(port, (req, res) => {
  console.log(`working on port ${port}`);
});

