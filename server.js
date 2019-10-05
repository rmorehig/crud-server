const express = require('express');

require('dotenv').config();

const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

var db = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'docker',
    database: 'crud-database'
  }
});

const main = require('./controllers/main');

const app = express();

const whitelist = ['http://localhost:3001'];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', (req, res) => res.send('hello world'));
app.get('/crud', (req, res) => main.getTableData(req, res, db));
app.post('/crud', (req, res) => main.postTableData(req, res, db));
app.put('/crud', (req, res) => main.putTableData(req, res, db));
app.delete('/crud', (req, res) => main.deleteTableData(req, res, db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
});
