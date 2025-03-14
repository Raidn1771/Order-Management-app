const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
// db connection
require('./db');

const routes = require('./routes');
app.use('/api', routes);
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'page Not Found' });
});

app.listen(3000, () => {
  console.log('app is running');
});
