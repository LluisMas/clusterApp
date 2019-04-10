const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.findAll = function(req, res) {
  User.find({}, function(err, users) {
    const userMap = [];

    users.forEach(function(user) {
      userMap.push(user);
    });

    res.json(userMap);
  });
};

exports.delete = function(req, res) {
  User.remove({_id: req.params.id})
    .then((docs) => {
      if(docs)
        res.status(200).send();
      else
        res.status(409).send();
    });
  console.log("deleting " + req.params.id);
};

exports.update = function(req, res) {
  User.findOneAndUpdate(req.params.id, req.body, function (err, post) {
    if (err){
      return next(err);
    }
    res.json(post);
  });
  console.log("updating " + req.params.id);
};
