const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const API = 'https://jsonplaceholder.typicode.com';

router.get('/', (req, res) =>{
  res.send("ok")
});


router.get('/posts', (req, res) => {
  axios.get(`${API}/posts`).then(posts=>{
    res.status(200).json(posts.data);
  })
    .catch(error =>{
      res.status(500).send(error);
    });
});

router.post('/auth', function(req, res) {
  const body = req.body;

  console.log("LOGIN" + body.password + body.username);
  const user = USERS.find(user => user.username == body.username);
  if(!user || body.password != 'todo') return res.sendStatus(401);

  var token = jwt.sign({userID: user.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
  res.send({token});
});

module.exports = router;
