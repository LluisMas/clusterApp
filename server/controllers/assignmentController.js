const mongoose = require('mongoose');
const Assignment = mongoose.model('Assignment');
const Submission = mongoose.model('Submission');
const scriptsController = require('../controllers/scriptsController');
const fs = require('fs');


exports.findAll = function(req, res) {
  Assignment.find({}).populate('subject').exec(function (err, assignment) {
    res.json(assignment);
  })
};

exports.getRanking = function(req, res) {
  Submission.find({status: 4}).populate('author').exec( function(err, submissions) {

    const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

    let ranking = {};
    let users = {};
    submissions.forEach(function (submission) {
      time = average(submission.executionTime);

      if (ranking[submission.author._id] === undefined || ranking[submission.author] > time)
        ranking[submission.author._id] = time;

      users[submission.author._id] = submission.author;
    });

    let items = Object.keys(ranking).map(function(key) {
      return [users[key], ranking[key]];
    });

    items.sort(function(first, second) {
      return  first[1] - second[1];
    });

    res.send(items);
  });
};

exports.find = function(req, res) {
  Assignment.findOne({_id: req.params.id})
    .populate('subject')
    .exec(function (err, assignment) {
      res.json(assignment);
    });
};

exports.getSubmissionsOfAssignment = function(req, res) {

  Submission.find({assignment: req.params.id}).populate('author').populate('assignment').exec(function (err, submissions) {
    if (err) throw err;

    res.json(submissions);
  });
};

exports.delete = function(req, res) {
  Submission.remove({assignment: req.params.id})
    .then((docs) => {
      Assignment.remove({_id: req.params.id})
        .then((docs) => {
          scriptsController.removeAssignment(req.params.id);
          if(docs)
            res.status(200).send();
          else
            res.status(409).send();
        });
    });

  console.log("deleting assignment: " + req.params.id);
};

exports.update = function(req, res) {
  Assignment.findOneAndUpdate({_id : req.params.id}, req.body, function (err, post) {
    if (err){
      return (err);
    }

    res.json(post);
  });
  console.log("updating assignment: " + req.params.id);
};

exports.create = function(req, res) {
  const assignment = new Assignment();

  assignment.name = req.body.name;
  if (req.body.startDate != null)
    assignment.startDate = req.body.startDate;

  if (req.body.endDate != null)
    assignment.endDate = req.body.endDate;

  assignment.subject = req.body.subject;

  assignment.parallelenvironment = req.body.parallelenvironment;
  assignment.compilecommand = req.body.compilecommand;
  assignment.runcommand = req.body.runcommand;
  assignment.cpuamount = req.body.cpuamount;

  assignment.save(function (err, newAssig) {
    if (err) throw err;

    res.send(newAssig);
  });

  console.log("Created assignment: " + assignment.name);
};

exports.uploadData = function(req, res) {
  const id = req.headers.assignment;
  var ext = req.file.originalname.split('.');
  ext.splice(0, 1);
  ext = ext.join('.');

  fs.writeFile('uploads/' + id + '.' + ext, req.file.buffer, function (err) {
    if (err) {
      return console.log(err);
    }

    Assignment.findOne({_id: id}, function (err, assignment) {
        scriptsController.initAssignment(assignment.subject, assignment._id, ext);
      });
  });
  res.send();
};
