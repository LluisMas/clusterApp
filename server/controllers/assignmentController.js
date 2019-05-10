const mongoose = require('mongoose');
const Assignment = mongoose.model('Assignment');

exports.findAll = function(req, res) {
  Assignment.find({}).populate('subject').exec(function (err, assignment) {
    res.json(assignment);
  })
};

exports.find = function(req, res) {
  Assignment.findOne({_id: req.params.id})
    .populate('subject')
    .exec(function (err, assignment) {
      res.json(assignment);
    });
};

exports.delete = function(req, res) {
  Assignment.remove({_id: req.params.id})
    .then((docs) => {
      if(docs)
        res.status(200).send();
      else
        res.status(409).send();
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
