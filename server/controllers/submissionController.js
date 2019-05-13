const mongoose = require('mongoose');
const Submission = mongoose.model('Submission');
const scriptsController = require('../controllers/scriptsController');

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

exports.uploadFile = function(req, res) {

  const submission = new Submission();
  submission.name = req.headers.name;
  submission.author = req.headers.user._id;
  submission.assignment = req.headers.assignment;
  submission.file  = req.file.buffer;
  submission.save(function (err, newSubmission) {
    if (err) throw err;

    const toSend = JSON.parse(JSON.stringify(newSubmission));
    toSend['file'] = newSubmission.file.toString('utf8');

    res.send(toSend);
  });
};
