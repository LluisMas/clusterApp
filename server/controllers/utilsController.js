const mongoose = require('mongoose');
const User = mongoose.model('User');
const Subject = mongoose.model('Subject');
const Assignment = mongoose.model('Assignment');
const Submission = mongoose.model('Submission');
const Roles = require('../models/Roles');

exports.init = function(req, res) {

  const user = new User();
  user.email = "admin@admin";
  user.name = 'admin';
  user.setPassword("root");
  user.role = Roles.Admin;

  let deleted = false;
  User.remove({email: user.email})
    .then((docs) => {
      if(docs)
        deleted = true;
    });

  user.save()
    .catch( error =>{
      console.log(error);
      res.status(500).send();
    } )
    .then( result => {
      res.status(200).json({user: result, deleted: deleted});
    } );
};

exports.initAssignment = function (req, res) {
  const assignment = new Assignment();
  assignment.name = 'vergactividad';

  let deleted = false;
  Assignment.remove({name: assignment.name})
    .then((docs) => {
      if(docs)
        deleted = true;
    });

  assignment.save()
    .catch( error =>{
      console.log(error);
      res.status(500).send();
    } )
    .then( result => {
      res.status(200).json({user: result, deleted: deleted});
    } );
};

exports.initSubmission = function (req, res) {
  const submission = new Submission();
  submission.name = 'verga';
  submission.status = 3;
  submission.author = '5ccafcd5316dd6539529ff08';
  submission.assignment = '5ce278dd0152af750a8a2e6f';
  submission.file = '';
  submission.executionTime = 40;

  submission.save();

  res.send();
};


exports.cleanSubjects = function (req, res) {
  User.find({}, function(err, users) {
    Subject.find({}, function (err, subj) {
      users.forEach(function (user) {
        user.subjects = user.subjects.filter(function (sub) {
          var entry;
          for (entry in subj) {
            if (String(subj[entry]._id) === String(sub._id))
              return true;
          }
          return false;
        });

        user.save();
      });
    });
  });

  res.send();
};
