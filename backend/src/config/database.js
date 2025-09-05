const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("node:util");
const { join } = require("node:path");

const databasePath =
  process.env.NODE_ENV === "test" ? ":memory:" : join(process.cwd(), "main.db");
const database = new sqlite3.Database(databasePath);

const run = (sql, params) => {
  return new Promise((resolve, reject) => {
    database.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};
const get = promisify(database.get.bind(database));
const all = promisify(database.all.bind(database));

let transactionQueue = Promise.resolve();

const withTransaction = async (callback) => {
  transactionQueue = transactionQueue
    .then(async () => {
      await run("BEGIN TRANSACTION");

      try {
        const result = await callback();
        await run("COMMIT");
        return result;
      } catch (error) {
        await run("ROLLBACK");
        throw error;
      }
    })
    .catch(async (error) => {
      transactionQueue = Promise.resolve();
      throw error;
    });

  return transactionQueue;
};

module.exports = {
  run,
  get,
  all,
  withTransaction,
};
