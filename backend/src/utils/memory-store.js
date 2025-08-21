class MemoryStore {
  store = {};

  set(key, value) {
    this.store[key] = value;
  }

  get(key) {
    return this.store[key];
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key);
  }

  updateKey(key, updateFunction) {
    if (this.has(key)) {
      this.set(key, updateFunction(this.get(key)));
    }
  }
}

class MemoryStores {
  static stores = {};

  static get(name) {
    return this.stores[name];
  }

  static new(name) {
    const store = new MemoryStore();
    this.stores[name] = store;
    return store;
  }

  static has(name) {
    return Object.prototype.hasOwnProperty.call(this.stores, name);
  }
}

module.exports = { MemoryStore, MemoryStores };
