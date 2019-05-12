const mongoose = require('mongoose');
const scriptsController = require('../controllers/scriptsController');

const Submission = mongoose.model('Submission');


exports.findAll = function(req, res) {
  Submission.find({}).populate('author').populate('assignment').exec(function (err, submission) {
    res.json(submission);
  })
};

exports.uploadFile = function(req, res) {
  console.log(req.params);
  console.log(req.file);

  console.log(req.headers);

  res.send();
};
