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
