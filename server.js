const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 4600;
const passport = require('passport');
require('./server/config/passport');
require('./server/models/User');
const winston = require('winston'), expressWinston = require('express-winston');
const mongoose = require('mongoose');
var morgan = require('morgan');

app.use(morgan('combined'));
const url = 'mongodb://localhost/tfg';
const debugConfig = require('./server/config/debug.json');

mongoose.Promise = global.Promise;
mongoose.connect(url, function (err, res) {
  if (err)
    console.log ('ERROR connecting to: ' + url + '. ' + err);
  else
    console.log ('Connected to: ' + url );
});

app.use(express.static(path.join(__dirname, 'dist/clusterApp')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(debugConfig.console)
  ]
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const routes = require('./server/routes/routes');

// Only Admin
app.use('/routes/users*', function (req, res, next) {
  const user = JSON.parse(req.headers.user);
  console.log('USER', user);
  if(!user || user.role !== 'Admin')
    res.status(401).send();
  else
    next();
});

app.use('/routes', routes);

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(debugConfig.console)
  ]
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/clusterApp/index.html'))
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log("REDIRECT");
    res.status(err.status).send({message:err.message});
  }
  else{
    next();
  }
});

app.listen(port, (req, res) => {
  console.log(`working on port ${port}`);
});
