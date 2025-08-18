const { join } = require("path");
const { mkdirSync, existsSync } = require("fs");
const { writeFile, readFile } = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

class FileStorage {
  static path = join(process.cwd(), "storage", "files");
  static imagesPath = join(this.path, "images");

  static acceptedImageFileTypes = ["image/jpeg", "image/png", "image/jpg"];
  static maxImageSizeMb = 10;
  static mimeTypeToExtensionMap = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/jpg": "jpg",
  };

  static initialize() {
    this.createDirIfNotExists(this.path);
  }

  /**
   * @param {string} path
   */
  static createDirIfNotExists(path) {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  }

  /**
   * @param {number} bytes
   */
  static bytesToMb(bytes) {
    if (bytes > 0) {
      return bytes / 1e6;
    }

    return 0;
  }

  static async validImageFile(file) {
    if (file.size > this.maxImageSizeMb) {
      return false;
    }

    if (!this.acceptedImageFileTypes.includes(file.mimetype)) {
      return false;
    }

    return true;
  }

  /**
   * @param {string} mimetype
   */
  static getFileExtensionFromMetadata(mimetype) {
    return "." + this.mimeTypeToExtensionMap[mimetype] || "";
  }

  static async saveImage(file) {
    if (!this.validImageFile(file)) {
      throw new Error("Invalid image file");
    }

    this.createDirIfNotExists(this.imagesPath);

    const fileSaveName =
      uuidv4() + this.getFileExtensionFromMetadata(file.mimetype);
    const path = join(this.imagesPath, fileSaveName);

    await writeFile(path, file.buffer);

    return fileSaveName;
  }

  /**
   * @param {string} imageName
   */
  static getImagePath(imageName) {
    return join(this.imagesPath, imageName);
  }
}

FileStorage.initialize();

module.exports = FileStorage;
