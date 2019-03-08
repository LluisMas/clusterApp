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


router.get('/posts', auth.required, (req, res) => {
  axios.get(`${API}/posts`).then(posts=>{
    res.status(200).json(posts.data);
  })
    .catch(error =>{
      //res.status(500).send(error);
    });
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
  /*
  const body = req.body;

  console.log(Users);

  console.log("LOGIN" + body.password + body.username);
  const user = USERS.find(user => user.username == body.username);
  if(!user || body.password != 'todo') return res.sendStatus(401);

  var token = jwt.sign({userID: user.id}, 'secret', {expiresIn: '2h'});
  res.send({token});*/
});

module.exports = router;
