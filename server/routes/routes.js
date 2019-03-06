const mongoose = require('mongoose');
const passport = require('passport');

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

const axios = require('axios');
const jwt = require('jsonwebtoken');
const auth = require('../auth');

const Users = mongoose.model('User');

const API = 'https://jsonplaceholder.typicode.com';

router.get('/', (req, res) =>{
  res.send("ok")
});


router.get('/posts', auth.optional, (req, res) => {
  axios.get(`${API}/posts`).then(posts=>{
    res.status(200).json(posts.data);
  })
    .catch(error =>{
      res.status(500).send(error);
    });
});

router.post('/auth', auth.optional, (req, res, next) => {

  var newuser = new Users();
  newuser.email = "asd";
  newuser.setPassword("root");
  newuser.save();

  passport.authenticate('local', (err, passportUser, info) => {
    if(err)
      return next(err);

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      res.json({ user: user.toAuthJSON() });
    }else {
      res.sendStatus(400);
    }
  })(req, res, next);

  return;
  const body = req.body;

  console.log(Users);

  console.log("LOGIN" + body.password + body.username);
  const user = USERS.find(user => user.username == body.username);
  if(!user || body.password != 'todo') return res.sendStatus(401);

  var token = jwt.sign({userID: user.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
  res.send({token});
});

module.exports = router;
