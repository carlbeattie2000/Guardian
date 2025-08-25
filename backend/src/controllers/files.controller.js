const filesService = require("../services/files.service");
const HttpResponse = require("../utils/http-response-helper");

class FilesController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async get(req, res) {
    const { token } = req.query;
    const filePath = filesService.getFileNameFromToken(token);
    res.sendFile(filePath);
  }
}

const filesController = new FilesController();

module.exports = filesController;
