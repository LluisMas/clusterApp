const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const axios = require('axios');
const auth = require('../auth');
const User = mongoose.model('User');

const API = 'https://jsonplaceholder.typicode.com';

router.get('/posts', auth.required, (req, res) => {
  axios.get(`${API}/posts`).then(posts=>{
    res.status(200).json(posts.data);
  })
});

router.get('/users', auth.optional, (req, res) => {

  User.find({}, function(err, users) {
    var userMap = [];

    users.forEach(function(user) {
      userMap.push(user);
    });

    console.log(userMap);
    res.json(userMap);
  });
});

router.post('/init', (req, res) => {
  console.log("asdasd");
  const user = new User();
  user.email = "asd2";
  user.setPassword("root");
  user.save();
  res.status(200).send();
});

router.post('/auth', (req, res) => {

  passport.authenticate('local', (err, username, info) => {
    if(err){
      console.log(err);
      res.status(402).json(info);
      return (err);
    }

    if(username) {
      const user = username;
      user.token = username.generateJWT();
      res.json({ user: user.toAuthJSON() });
    }else {
      res.status(401).json(info);
    }
  })(req, res);
});

module.exports = router;
