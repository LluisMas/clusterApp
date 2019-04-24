const mongoose = require('mongoose');
const Subject = mongoose.model('Subject');
const User = mongoose.model('User');

exports.findAll = function(req, res) {
  Subject.find({}, function(err, subjects) {
    res.json(subjects);
  });
};

exports.delete = function(req, res) {
  Subject.remove({_id: req.params.id})
    .then((docs) => {
      if(docs)
        res.status(200).send();
      else
        res.status(409).send();
    });
  console.log("deleting subject: " + req.params.id);
};

exports.update = function(req, res) {
  Subject.findOneAndUpdate({_id : req.params.id}, req.body, function (err, post) {
    if (err){
      return (err);
    }

    res.json(post);
  });
  console.log("updating user: " + req.params.id);
  console.log(req.body);
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
        correctUsers.push(res._id);
        sendUsers.push(student);
      }
      else
        incorrectUsers.push(student);
    }
  ))
    .catch( console.error)
    .then( result => {
      console.log('correct: ' + correctUsers);
      console.log('incorrect: ' + incorrectUsers);

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
    });
};

exports.getStudentsOfSubject = function(req, res) {

  console.log(req.params.id);
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
