const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.findAll = function(req, res) {
  const id = JSON.parse(req.headers.user)._id;

  User.find({ $or: [{role: {$ne : 'Admin'}}, {_id : id} ]}, function(err, users) {
    const userMap = [];

    users.forEach(function(user) {
      var u = JSON.parse(JSON.stringify(user));
      delete u["salt"];
      userMap.push(u);
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
  User.findOneAndUpdate({_id : req.params.id}, req.body, function (err, post) {
    if (err){
      return (err);
    }

    res.json(post);
  });
  console.log("updating " + req.params.id);
  console.log(req.body);
};

exports.create = function(req, res) {
  const user = new User();
  user.email = req.body.email;
  user.setPassword(req.body.dni);
  user.save(function (err, newUser) {
    if (err) throw err;

    res.send(newUser);
  });

  console.log("Created user");
};

exports.createFromFile = function(req, res) {
  if (!req.file) {
    console.log("Archivo no recibido");
    return res.send({
      success: false
    });
  } else {
    var text = String(req.file.buffer);
    var lines = text.match(/^.*([\n\r]+|$)/gm);

    let users = [];

    for (let index = 0; index < lines.length; index++) {

      let cleanLine = lines[index].trim().split(';');

      if(cleanLine.length === 2){
        const user = new User();
        user.email = cleanLine[0];
        user.dni = cleanLine[1];
        user.setPassword(cleanLine[1]);
        users.push(user);
      }
    }

    let usersResult = [];

    Promise.all(users.map(
      user => user.save()
    ))
      .catch( console.error )
      .then( result => {

        result.forEach(user => {
          let jsonUser = {};
          jsonUser.email = user.email;
          jsonUser.dni = user.dni;
          jsonUser._id = user._id;
          usersResult.push(jsonUser);
        });

        return res.send({
          success: true,
          users: usersResult
        });
      } );
  }
};

