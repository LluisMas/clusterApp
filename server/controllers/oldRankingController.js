const mongoose = require('mongoose');
const oldranking = mongoose.model('oldranking');

exports.findAll = function(req, res) {
  oldranking.find({}, function (err, rankings) {
    res.json(rankings);
  })
};
