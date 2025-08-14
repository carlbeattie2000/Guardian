const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const { join } = require('path');

const database = new sqlite3.Database(join(process.cwd(), 'main.db'));

const run = (sql, params) => {
  return new Promise((resolve, reject) => {
    database.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};
const get = promisify(database.get.bind(database));

module.exports = {
  run,
  get
}
