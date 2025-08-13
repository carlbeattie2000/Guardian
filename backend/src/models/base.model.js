const { run, get } = require("../config/database");

function validWhereClauseArray(fields, values) {
  const fieldsIsArray = Array.isArray(fields);
  const valuesIsArray = Array.isArray(values);

  if (!fieldsIsArray || !valuesIsArray || fields.length !== values.length) {
    throw new Error('Invalid Where Clauses Array');
  }

  return true;
}

function pruneObject(object, expectedKeys) {
  return Object.fromEntries(
    Object.keys(object)
      .filter(key =>
        expectedKeys.includes(key) &&
        object[key] !== undefined &&
        object[key] !== null)
      .map((key) => [key, object[key]])
  );
}

class BaseModel {
  static table = "";
  static schema = "";
  static initialized = false;

  id = -1;

  static async initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    await run(this.schema);
  }

  async save() {
    const isInsert = this.id === -1 || this.id === undefined || this.id === null;

    const keys = Object.keys(this);
    const validKeys = keys.filter(key => {
      return this[key] !== -1 && this[key] !== undefined && this[key] !== null;
    });

    const values = validKeys.map((key) => this[key]);

    const insertQuery = `INSERT INTO ${this.constructor.table} (${validKeys.join(', ')}) VALUES (${validKeys.map(() => "?").join(', ')})`;
    const updateQuery = `UPDATE ${this.constructor.table} SET ${validKeys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;

    if (isInsert) {
      const result = await run(insertQuery, values);
      const savedResult = await get(`SELECT * FROM ${this.constructor.table} WHERE rowid = ?`, [result.lastID]);
      const prunedResult = pruneObject(savedResult, keys);
      Object.assign(this, prunedResult);
      return this;
    }

    values.push(this.id);
    await run(updateQuery, values);
    return this;
  }

  static async findById(id) {
    const query = `SELECT * FROM ${this.table} WHERE id = ?`;
    const result = await get(query, id);

    if (!result) {
      return null;
    }

    const instance = new this();
    const keys = Object.keys(instance);
    const prunedResult = pruneObject(result, keys);
    Object.assign(instance, prunedResult);
    return instance;
  }

  static async findBy(fields, values) {
    let query = `SELECT * FROM ${this.table} WHERE `;
    const instance = new this();
    const keys = Object.keys(instance);

    if (Array.isArray(fields) || Array.isArray(values)) {
      validWhereClauseArray(fields, values);

      query += `${fields.map((field) => `${field} = ?`).join(' AND ')} LIMIT 1`;
      const result = await get(query, values);

      if (!result) {
        return null;
      }

      Object.assign(instance, pruneObject(result, keys));
      return instance;
    }

    query += `${fields} = ? LIMIT 1`;
    const result = await get(query, values);

    if (!result) {
      return null;
    }

    Object.assign(instance, pruneObject(result, keys));
    return instance;
  }
}

module.exports = BaseModel;
