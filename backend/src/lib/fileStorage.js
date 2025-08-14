const { join } = require('path');
const { mkdirSync, existsSync } = require('fs');
const { writeFile, readFile } = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

// TODO: Can't use public dir, it's unrestricted, save private images, and send them to client when needed
// If you look at this, ignore it for now, images that should be protected should not be handled like this
class FileStorage {
  static path = join(process.cwd(), 'public', 'files');
  static imagesPath = join(this.path, 'images');

  static initialize() {
    new this().createDirIfNotExists(this.path);
  }

  createDirIfNotExists(path) {
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  }

  async saveImage(contents, ext) {
    this.createDirIfNotExists(FileStorage.imagesPath);

    const fileSaveName = uuidv4();
    const path = join(FileStorage.imagesPath, fileSaveName + ext);

    await writeFile(path, contents);

    return path;
  }

  async getImage(path) {
    if (existsSync(path)) {
      return readFile(path, 'base64');
    }
  }
}

FileStorage.initialize();

module.exports = FileStorage;
