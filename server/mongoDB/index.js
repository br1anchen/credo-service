const mongoose = require('mongoose');

require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS
};

mongoose.connect(
  `mongodb://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}`,
  { useNewUrlParser: true }
);

mongoose.connection.once('open', () => {
  console.log('connected to database');
});
