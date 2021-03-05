const { Client } = require('pg');
const fs = require('fs');

const ENV = fs.readFileSync(process.cwd() + '/.env', 'utf8');

const CREDENTIALS = ENV.split('\n').reduce((accum, el) => {
  const [key, value] = el.split('=');
  accum[key] = value;
  return accum;
}, {});

const client = new Client(CREDENTIALS);

client.connect().then(() => console.log('Connected to db...'));

module.exports = client;
