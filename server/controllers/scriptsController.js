exports.submitJob = function(req, res) {
  const { spawn } = require('child_process');
  const pyProg = spawn('python', ['server/scripts/script.py', 'arg']);

  pyProg.stdout.on('data', function(data) {
    res.send(data);
  });
  pyProg.stderr.on('data', function(data) {
    res.send(data + 'Current dir: ' + __filename);
  });
};

exports.initAssignment = function (subject, assingment, ext) {
  const { spawn } = require('child_process');
  const pyProg = spawn('python', ['server/scripts/init.py', 'Assignment', subject, assingment, ext]);

  pyProg.stdout.on('data', function(data) {
    console.log('Data:' +  data);
  });
  pyProg.stderr.on('data', function(data) {
    console.log('Data:' +  data);
  });
};

exports.initSubject = function (subject) {
  const { spawn } = require('child_process');
  const pyProg = spawn('python', ['server/scripts/init.py', 'Subject', subject]);

  pyProg.stdout.on('data', function(data) {
    console.log('Data:' +  data);
  });
  pyProg.stderr.on('data', function(data) {
    console.log('Data:' +  data);
  });
};

exports.removeAssignment = function (assignment) {
  const { spawn } = require('child_process');
  spawn('python', ['server/scripts/destroy.py', 'Assignment', assignment]);
};

exports.removeSubject = function (subject) {
  const { spawn } = require('child_process');
  spawn('python', ['server/scripts/destroy.py', 'Subject', subject]);
};


exports.newSubmission = function (submission) {
  const { spawn } = require('child_process');
  spawn('python', ['server/scripts/newSubmission.py', submission]);
};
