const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4600;

const routes = require('./server/routes/routes');
app.use(express.static(path.join(__dirname, 'dist/clusterApp')));

app.use('/routes', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/clusterApp/index.html'))
});

app.listen(port, (req, res) => {
  console.log(`working on port ${port}`);
});
