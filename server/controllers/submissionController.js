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

exports.find = function(req, res) {
  Submission.findOne({_id: req.params.id}).populate('author').populate('assignment').exec(function (err, user) {
    res.json(user);
  })
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
