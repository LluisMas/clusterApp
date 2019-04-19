const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const axios = require('axios');
const auth = require('../auth');
const User = mongoose.model('User');
const userController = require('../controllers/userController');
const subjectController = require('../controllers/subjectController');

const API = 'https://jsonplaceholder.typicode.com';

const multer = require('multer');

let upload = multer();

router.get('/posts', auth.required, (req, res) => {
  axios.get(`${API}/posts`).then(posts=>{
    res.status(200).json(posts.data);
  })
});


router.get('/users', auth.required, userController.findAll);
router.delete('/users/:id', userController.delete);
router.put('/users/:id', userController.update);
router.post('/users', userController.create);
router.post('/users/file', upload.single('text'), userController.createFromFile);

router.get('/subjects', auth.required, subjectController.findAll);

router.post('/init', (req, res) => {
  const user = new User();
  user.email = "asd";
  user.setPassword("root");
  user.save()
    .catch( error =>{
      console.log(error);
      res.status(500).send();
    } )
    .then( result => {
      console.log(result);
      res.status(200).send();
    } );
});

router.post('/auth', (req, res) => {

  passport.authenticate('local', (err, username, info) => {
    if(err){
      console.log(err);
      res.status(402).json(info);
      return (err);
    }

    console.log(info);
    if(username) {
      const user = username;
      user.token = username.generateJWT();
      console.log(user);
      res.json({ user: user.toAuthJSON() });
    }else {
      res.status(401).json(info);
    }
  })(req, res);
});

module.exports = router;
