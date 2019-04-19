const mongoose = require('mongoose');
const Subject = mongoose.model('Subject');

exports.findAll = function(req, res) {
  Subject.find({}, function(err, subjects) {
    res.json(subjects);
  });
};
