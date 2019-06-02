const mongoose = require('mongoose');
const Assignment = mongoose.model('Assignment');
const Submission = mongoose.model('Submission');
const oldranking = mongoose.model('oldranking');
const scriptsController = require('../controllers/scriptsController');
const fs = require('fs');


exports.findAll = function(req, res) {
  Assignment.find({}).populate('subject').exec(function (err, assignment) {
    res.json(assignment);
  })
};

exports.getRanking = function(req, res) {
  const userid = JSON.parse(req.headers.user)._id;
  const assignmentid = req.params.id;
  Submission.find({ $and :[{status: 4}, {assignment: assignmentid}]}).populate('author').exec( function(err, submissions) {
    oldranking.findOne( { $and :[{user: userid}, {assignment: assignmentid}]}, function (err, result) {

      const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

      let rankingToSend = {};
      let students = {};

      submissions.forEach(function (submission) {
        const time = average(submission.executionTime);

        if (rankingToSend[submission.author._id] === undefined || rankingToSend[submission.author] > time)
          rankingToSend[submission.author._id] = time;

        students[submission.author._id] = submission.author;
      });

      let items = Object.keys(rankingToSend).map(function(key) {
        return [students[key], rankingToSend[key]];
      });

      items.sort(function(first, second) {
        return  first[1] - second[1];
      });

      const itemAmount = items.length;
      const oldRanking = result ? result.ranking : null;

      items.forEach(function (item, index) {
        const userID = item[0]._id;
        const currentPos = index + 1;

        if (oldRanking === null) {
          item.push(0);
        } else {
          let oldPos = oldRanking[userID];

          if (oldPos === undefined)
            oldPos = itemAmount;

          item.push(oldPos - currentPos);
        }
      });

      res.send(items);
    });
  });
};

exports.getStatistics = function(req, res) {
  Submission.find({assignment: req.params.id}).populate('author').exec( function(err, submissions) {
    if (err) throw err;

    let result = {};

    submissions.forEach(function (submission) {
      if(result[submission.author._id] === undefined) {
        result[submission.author._id] = {
          name: submission.author.name,
          total: 0,
          correct: 0,
          incorrect: 0,
          waiting: 0
        };
      }

      result[submission.author._id]['total'] += 1;

      if (submission.status === 3)
        result[submission.author._id]['correct'] += 1;

      if (submission.status === 4 || submission.status === 5)
        result[submission.author._id]['incorrect'] += 1;

      if (submission.status === 0 || submission.status === 1 || submission.status === 2)
        result[submission.author._id]['waiting'] += 1;
    });

    const stats = Object.keys(result).map(function(key){
      return result[key];
    });

    res.json(stats);
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
