const mongoose = require('mongoose');
const Subject = mongoose.model('Subject');
const User = mongoose.model('User');
const Assignment = mongoose.model('Assignment');
const Submission = mongoose.model('Submission');
const scriptsController = require('../controllers/scriptsController');

exports.findAll = function(req, res) {
  Subject.find({})
    .populate('professor')
    .populate('students')
    .exec(function (err, subject) {
      res.json(subject);
    })
};

exports.find = function(req, res) {
  Subject.findOne({_id: req.params.id})
    .populate('professor')
    .populate('students')
    .exec(function (err, subject) {
      res.json(subject);
    })
};

exports.delete = function(req, res) {
  Assignment.find({subject: req.params.id}, function (err, assignments) {

    assignments.forEach(function (assignment) {
      const id = assignment._id;
      Submission.find({assignment: id}, function (err, submissions) {
        submissions.forEach(function (submission) {
          submission.remove();
        })
      });
      assignment.remove();
    });

    Subject.deleteOne({_id: req.params.id})
      .then((docs) => {
        if(docs) {
          scriptsController.removeSubject(req.params.id);
          res.status(200).send();
          User.find({subjects: req.params.id}, function (err, users) {
            if (err) return err;

            users.forEach(function (user) {
              user.subjects = user.subjects.filter(function (sub) {
                return String(sub._id) !== req.params.id;
              });
              user.save();
            });
          });
        }
        else
          res.status(409).send();
      });
  });

  console.log("deleting subject: " + req.params.id);
};

exports.deleteUserFromSubject = function(req, res) {

  const subjectId = req.params.subjectid;
  const userid = req.params.userid;


  Subject.findOne({_id: subjectId}, function (err, subject) {
    if (err) return err;

    subject.students = subject.students.filter(function (student) {
      return String(student._id) !== userid;
    });
    subject.save();
  });

  User.findOne({_id: userid}, function (err, user) {
    if (err) return err;

    user.subjects = user.subjects.filter(function (subject) {
      return String(subject._id) !== subjectId;
    });
    user.save();
  });

  res.status(200).send();
};

exports.update = function(req, res) {
  Subject.findOneAndUpdate({_id : req.params.id}, req.body, function (err, post) {
    if (err){
      return (err);
    }

    res.json(post);
  });
  console.log("updating user: " + req.params.id);
};

exports.create = function(req, res) {
  const name = req.body.name;
  const year = req.body.year;
  const professor = req.body.professor;
  const students = req.body.students;

  const incorrectUsers = [];
  const correctUsers = [];
  const sendUsers = [];

  Promise.all(students.map (
    async student => {

      const query = User.findOne({email: student});
      const res = await query.exec();
      if (res){
        correctUsers.push(res);
        sendUsers.push(student);
      }
      else
        incorrectUsers.push(student);
    }
  ))
    .catch( console.error)
    .then( result => {

      const subject = new Subject();
      subject.name = name;
      subject.year = year;
      subject.professor = professor;
      subject.students = correctUsers;
      subject.save();

      res.send({
        success: true,
        correct: sendUsers,
        incorrect: incorrectUsers,
        subject: subject
      });

      correctUsers.forEach(function (user) {

        let found = false;
        user.subjects.forEach(function (sub) {
          if (sub._id === subject._id)
            found = true;
        });

        if (!found) {
          user.subjects.push(subject);
          user.save();
        }
      });

      let found = false;
      professor.subjects.forEach(function (sub) {
        if (sub._id === subject._id)
          found = true;
      });

      if (!found) {
        professor.subjects.push(subject);
        User.findOneAndUpdate({_id : professor._id}, professor, function (err, post) {
          if (err){
            return (err);
          }
        });
      }
    });
};

exports.getStudentsOfSubject = function(req, res) {

  Subject.findById(req.params.id, function (err, subject) {
    if (err) throw err;

    const sendUsers = [];
    Promise.all(subject.students.map (
      async student => {
        const query = User.findById(student);
        const res = await query.exec();

        if (res)
          sendUsers.push(res);
      }
    ))
      .catch( console.error )
      .then( result => {
        res.json(sendUsers);
      });
  })
};

exports.getAssignmentsOfSubject = function(req, res) {

  Assignment.find({subject: req.params.id}, function (err, assignment) {
    if (err) throw err;

    res.json(assignment);
  });
};

exports.addStudent = function(req, res) {
  let found = false;
  req.body.subjects.forEach(function (subject) {
      if(subject._id === req.params.id)
        found = true;
  });

  if (found) {
    res.status(409).send();
    return;
  }

  Subject.findOne({_id: req.params.id}, function (err, subject) {
    if (err) throw err;

    subject.students.push(req.body);
    subject.save();
    res.json(req.body);

    User.findOne({_id: req.body._id}, function (err, user) {
      if (err) throw err;

      user.subjects.push(subject);
      user.save();
    });
  });
};

exports.createFromFile = function(req, res) {
  Subject.findOne({_id: req.params.id}, function (err, subject) {
    if (err) throw err;

    Promise.all(req.body.map (
      async fileUser => {

        const query = User.findOne({email: fileUser.email});
        const user = await query.exec();

        if (!user) {
          let newUser = new User();
          newUser.email = fileUser.email;
          newUser.dni  = fileUser.dni;
          newUser.name = fileUser.name;
          newUser.setPassword(fileUser.dni);
          newUser.subjects = [subject];
          newUser.save();

          subject.students.push(newUser);
        } else {

          let found = false;
          user.subjects.forEach(function (sub) {
            if (sub._id.equals(subject._id))
              found = true;
          });

          if (!found) {
            subject.students.push(user);
            user.subjects.push(subject);
            user.save();
          }
        }
    }))
      .catch( console.error )
      .then( result => subject.save());
  });

  res.send();
};
