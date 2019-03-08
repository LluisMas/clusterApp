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
app.use(cors());

// app.use(expressWinston.logger({
//   transports: [
//     new winston.transports.Console(debugConfig.console)
//   ]
// }));

const routes = require('./server/routes/routes');
app.use('/routes', routes);

app.use(function(req, res, next) {
  if(req.user)
  {
      console.log("hi");
      console.log(req.user.isAuthenticated());
  }
  else {
    console.log("bye");
  }
  //if (req.session.user == null){
// if user is not logged-in redirect back to login page //
    //res.redirect('/login');
  //}   else{
    next();
  //}
});

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(debugConfig.console)
  ]
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/clusterApp/index.html'))
});

app.listen(port, (req, res) => {
  console.log(`working on port ${port}`);
});

