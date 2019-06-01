const mongoose = require('mongoose');
const User = mongoose.model('User');
const Subject = mongoose.model('Subject');

exports.find = function(req, res) {
  User.findOne({_id: req.params.id}).populate('subjects').exec(function (err, user) {
    res.json(user);
  })
};

exports.changePass = function(req, res) {
  User.findOne({_id: req.params.id}, function (err, user) {
    user.setPassword(req.body.pass);
    user.changedPass = true;
    user.save();
    res.send();
  });
};

exports.findAll = function(req, res) {
  const id = JSON.parse(req.headers.user)._id;

  User.find({ $or: [{role: {$ne : 'Admin'}}, {_id : id} ]}).populate('subjects').exec(function(err, users) {
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

  User.find({_id: req.params.id}, function (err, users) {

    users.forEach(function (user) {
      user.subjects.forEach( function (subject) {
        console.log(subject);
        Subject.find({_id: subject}, function (sub) {
          console.log(sub);
        });
      });
    });

    User.remove({_id: req.params.id})
      .then((docs) => {
        if(docs)
          res.status(200).send();
        else
          res.status(409).send();
      });
  });

  console.log("deleting user: " + req.params.id);
};

exports.update = function(req, res) {
  User.findOneAndUpdate({_id : req.params.id}, req.body, function (err, post) {
    if (err){
      return (err);
    }

    res.json(post);
  });
  console.log("updating user: " + req.params.id);
};

exports.create = function(req, res) {
  const user = new User();
  user.email = req.body.email;
  user.name = req.body.name;
  user.dni = req.body.dni;
  if (req.body.subjects)
    user.subjects = req.body.subjects;

  console.log(user.subjects);

  user.setPassword(req.body.dni);
  User.findOne({email: user.email}, function (err, result) {
    if( err ) throw err;
    if (!result) {
      user.save(function (err, newUser) {
        if (err) throw err;

        res.send(newUser);

        if (req.body.subjects)
        {
          Subject.findOne({_id: user.subjects[0]}, function (err, subject) {
            subject.students.push(user);
            subject.save();
          });
        }
      });
    } else {
      res.send();
    }

  });
  console.log("Created user: " + user.email);
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

      if(cleanLine.length === 3){
        const user = new User();
        user.email = cleanLine[0].trim();
        user.dni = cleanLine[1].trim();
        user.name = cleanLine[2].trim();
        user.setPassword(cleanLine[1].trim());
        users.push(user);
      }
    }

    let usersResult = [];

    Promise.all(users.map(
      user => {
        User.findOne({email: user.email}, function (err, result) {
          if( err ) throw err;

          if (!result)
            user.save();
        });
      }
    ))
      .catch( console.error )
      .then( result => {

        result.forEach(user => {
          if (user)
          {
            let jsonUser = {};
            jsonUser.email = user.email;
            jsonUser.dni = user.dni;
            jsonUser._id = user._id;
            jsonUser.role = user.role;
            jsonUser.name = user.name;
            usersResult.push(jsonUser);
          }
        });

        return res.send({
          success: true,
          users: usersResult
        });
      } );
  }
};

