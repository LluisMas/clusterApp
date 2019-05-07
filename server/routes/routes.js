const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const axios = require('axios');
const auth = require('../auth');
const userController = require('../controllers/userController');
const subjectController = require('../controllers/subjectController');
const assignmentController = require('../controllers/assignmentController');
const utilsController = require('../controllers/utilsController');

const API = 'https://jsonplaceholder.typicode.com';

const multer = require('multer');

let upload = multer();

router.get('/posts', auth.required, (req, res) => {
  axios.get(`${API}/posts`).then(posts=>{
    res.status(200).json(posts.data);
  })
});


router.get('/users', auth.required, userController.findAll);
router.get('/users/:id', userController.find);
router.delete('/users/:id', userController.delete);
router.put('/users/:id', userController.update);
router.post('/users', userController.create);
router.post('/users/file', upload.single('text'), userController.createFromFile);

router.get('/subjects', auth.required, subjectController.findAll);
router.get('/subjects/:id', subjectController.find);
router.get('/subjects/:id/students', subjectController.getStudentsOfSubject);
router.get('/subjects/:id/assignments', subjectController.getAssignmentsOfSubject);
router.delete('/subjects/:id', subjectController.delete);
router.delete('/subjects/:subjectid/delete/:userid', subjectController.deleteUserFromSubject);
router.put('/subjects/:id', subjectController.update);
router.post('/subjects', subjectController.create);
router.post('/subjects/:id/addstudent', subjectController.addStudent);
router.post('/subjects/:id/file', upload.single('text'), subjectController.createFromFile);

router.get('/assignments', auth.required, assignmentController.findAll);
router.get('/assignments/:id', assignmentController.find);
router.delete('/assignments/:id', assignmentController.delete);
router.put('/assignments/:id', assignmentController.update);
router.post('/assignments', assignmentController.create);

router.post('/init', utilsController.init);
router.post('/initAssignment', utilsController.initAssignment);
router.post('/cleanSubjects', utilsController.cleanSubjects);

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
