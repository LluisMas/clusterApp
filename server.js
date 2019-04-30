const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 4600;
const passport = require('passport');
require('./server/config/passport');
require('./server/models/User');
require('./server/models/Subject');
require('./server/models/Assignment');
const winston = require('winston'), expressWinston = require('express-winston');
const mongoose = require('mongoose');
const User = mongoose.model('User');

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
  res.header("Access-Control-Expose-Headers", "user");
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


app.use('/routes', function(req, res, next) {
  if (req.headers.user) {
    const reqUser = JSON.parse(req.headers.user);

    User.findOne({_id: reqUser._id}).populate('subjects').exec( function (err, user) {
      res.setHeader('user', JSON.stringify(user));
      next();
    });
  } else {
    next();
  }
});

app.use('/routes', routes);

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(debugConfig.console)
  ]
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/clusterApp/index.html'));
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log("REDIRECT");
    res.status(err.status).send({message:err.message});
  }
  else {
      next();
  }
});

app.listen(port, (req, res) => {
  console.log(`working on port ${port}`);
});
