const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const auth = require('../auth');
const userController = require('../controllers/userController');
const subjectController = require('../controllers/subjectController');
const assignmentController = require('../controllers/assignmentController');
const utilsController = require('../controllers/utilsController');
const scriptsController = require('../controllers/scriptsController');
const authController = require('../controllers/authController');

const multer = require('multer');

let upload = multer();

router.get('/users', auth.required, userController.findAll);
router.get('/users/:id', auth.required, userController.find);
router.delete('/users/:id', auth.required, userController.delete);
router.put('/users/:id', auth.required, userController.update);
router.post('/users', auth.required, userController.create);
router.post('/users/file', auth.required, upload.single('text'), userController.createFromFile);

router.get('/subjects', auth.required, subjectController.findAll);
router.get('/subjects/:id', auth.required, subjectController.find);
router.get('/subjects/:id/students', auth.required, subjectController.getStudentsOfSubject);
router.get('/subjects/:id/assignments', auth.required, subjectController.getAssignmentsOfSubject);
router.delete('/subjects/:id', auth.required, subjectController.delete);
router.delete('/subjects/:subjectid/delete/:userid', auth.required, subjectController.deleteUserFromSubject);
router.put('/subjects/:id', auth.required, subjectController.update);
router.post('/subjects', auth.required, subjectController.create);
router.post('/subjects/:id/addstudent', auth.required, subjectController.addStudent);
router.post('/subjects/:id/file', auth.required, upload.single('text'), subjectController.createFromFile);

router.get('/assignments', auth.required, assignmentController.findAll);
router.get('/assignments/:id', auth.required, assignmentController.find);
router.delete('/assignments/:id', auth.required, assignmentController.delete);
router.put('/assignments/:id', auth.required, assignmentController.update);
router.post('/assignments', auth.required, assignmentController.create);

router.post('/init', utilsController.init);
router.post('/initAssignment', utilsController.initAssignment);
router.post('/cleanSubjects', utilsController.cleanSubjects);

router.post('/scripts/submitJob', scriptsController.submitJob);

router.post('/auth', authController.authenticate);

module.exports = router;
