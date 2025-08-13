const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const { join } = require('path');

const database = new sqlite3.Database(join(process.cwd(), 'main.db'));

const run = promisify(database.run.bind(database));

module.exports = {
  run
}
