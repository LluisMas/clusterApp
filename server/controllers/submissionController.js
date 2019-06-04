const mongoose = require('mongoose');
const Submission = mongoose.model('Submission');
const Assignment = mongoose.model('Assignment');
const User = mongoose.model('User');
const scriptsController = require('../controllers/scriptsController');
const Status = require('../models/SubmissionStatus');

exports.findAll = function(req, res) {
  Submission.find({}).populate('author').populate('assignment').exec(function (err, submissions) {

    const toSend = [];

    submissions.forEach(function (submission) {
      var u = JSON.parse(JSON.stringify(submission));
      u['file'] = submission.file.toString('utf8');
      toSend.push(u);
    });

    res.json(toSend);
  })
};

exports.find = function(req, res) {
  Submission.findOne({_id: req.params.id}).populate('author').populate('assignment').exec(function (err, user) {
    res.json(user);
  })
};

exports.getSubmissionsOfAssignmentFromuUser = function(req, res) {
  Submission.find({$and: [{assignment: req.params.assignmentid}, {author: req.params.userid}]})
    .populate('author').populate('assignment').exec(function (err, submissions) {
    if (err) throw err;

    res.json(submissions);
  });
};

exports.getSuccessfulSubmissionsOfAssignmentFromuUser = function(req, res) {
  Submission.find({$and: [{assignment: req.params.assignmentid}, {author: req.params.userid}, {status: Status.Correct}]})
    .populate('author').populate('assignment').exec(function (err, submissions) {
    if (err) throw err;

    res.json(submissions);
  });
};

exports.getSuccessfulSubmissionsFromuUser = function(req, res) {
  // Submission.find({$and: [{author: req.params.id}, {status: Status.Correct}]})
  User.findOne({_id: req.params.id}).populate('subjects').exec( function (err, user) {
    Submission.find({$and: [{author: req.params.id}]})
      .populate('author').populate('assignment').exec(async function (err, submissions) {
      if (err) throw err;

      const toSend = {};

      user.subjects.forEach(async function (subject) {
        const query = Assignment.find({subject: subject});
        const result = await query.exec();
        result.forEach(function (assignment) {
          toSend[assignment._id] = [assignment.name];
        });

        submissions.forEach(function (submission) {
          if (toSend [submission.assignment._id] === undefined)
            toSend[submission.assignment._id] = [submission];
          else
            toSend[submission.assignment._id].push(submission);
        });

        res.json(toSend);
      });
    });
  });
};

exports.delete = function(req, res) {
  Submission.remove({_id: req.params.id})
    .then((docs) => {
      if(docs)
        res.status(200).send();
      else
        res.status(409).send();
    });
  console.log("deleting submission: " + req.params.id);
};

exports.uploadFile = function(req, res) {
  const id = JSON.parse(req.headers.user)._id;

  const submission = new Submission();
  submission.name = req.headers.name;
  submission.author = id;
  submission.assignment = req.headers.assignment;
  submission.file  = req.file.buffer;
  submission.originalName = req.file.originalname;

  submission.save(function (err, newSubmission) {
    if (err) throw err;

    const toSend = JSON.parse(JSON.stringify(newSubmission));
    toSend['file'] = newSubmission.file.toString('utf8');

    scriptsController.newSubmission(newSubmission._id);

    res.send(toSend);
  });
};

exports.checkRunningSubmissions = function (req, res) {
  Submission.findOne({status: Status.Running}, function (err, submissions) {
    res.json(submissions);
  });
};
