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
const submissionController = require('../controllers/submissionController');
const authController = require('../controllers/authController');
const oldRankingController = require('../controllers/oldRankingController');

const multer = require('multer');

let upload = multer();

// Users
router.get('/users', auth.required, userController.findAll);
router.get('/users/:id', auth.required, userController.find);
router.post('/users/:id/pass', auth.required, userController.changePass);
router.delete('/users/:id', auth.required, userController.delete);
router.put('/users/:id', auth.required, userController.update);
router.post('/users', auth.required, userController.create);
router.post('/users/file', auth.required, upload.single('text'), userController.createFromFile);

// Subjects
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

// Assignments
router.get('/assignments', auth.required, assignmentController.findAll);
router.get('/assignments/:id', auth.required, assignmentController.find);
router.get('/assignments/:id/submissions', auth.required, assignmentController.getSubmissionsOfAssignment);
router.get('/assignments/:id/ranking', auth.required, assignmentController.getRanking);
router.get('/assignments/:id/statistics', auth.required, assignmentController.getStatistics);
router.delete('/assignments/:id', auth.required, assignmentController.delete);
router.put('/assignments/:id', auth.required, assignmentController.update);
router.post('/assignments', auth.required, assignmentController.create);
router.post('/assignments/uploadData', upload.single('datafile'), assignmentController.uploadData);

//Submissions
router.get('/submission/:id', auth.required, submissionController.find);
router.delete('/submission/:id', auth.required, submissionController.delete);
router.post('/submission/file', auth.required, upload.single('text'), submissionController.uploadFile);
router.get('/submission', auth.required, submissionController.findAll);
router.get('/submission/:assignmentid/author/:userid', auth.required, submissionController.getSubmissionsOfAssignmentFromuUser);
router.get('/submission/:assignmentid/author/:userid/successful', auth.required, submissionController.getSuccessfulSubmissionsOfAssignmentFromuUser);
router.get('/submission/:id/successful', auth.required, submissionController.getSuccessfulSubmissionsFromuUser);

// Old Ranking
router.get('/oldranking', auth.required, oldRankingController.findAll);

// Utils
router.post('/init', utilsController.init);
router.post('/initAssignment', utilsController.initAssignment);
router.post('/cleanSubjects', utilsController.cleanSubjects);
router.post('/initSubmission', utilsController.initSubmission);

// Scripts
router.post('/scripts/submitJob', scriptsController.submitJob);

// Auth
router.post('/auth', authController.authenticate);

module.exports = router;
