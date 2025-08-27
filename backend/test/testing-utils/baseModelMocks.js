const chai = require("chai");
const sinon = require("sinon");
const BaseModel = require("../../src/models/base.model");
const sinonChai = require("sinon-chai").default;

chai.use(sinonChai);

function setupBaseModelStubs() {
  const stubs = {};

  stubs.init = sinon.stub(BaseModel, "initialize");
  stubs.save = sinon.stub(BaseModel.prototype, "save").callsFake(function () {
    return this;
  });
  stubs.delete = sinon
    .stub(BaseModel.prototype, "delete")
    .callsFake(function () {
      return this;
    });
  stubs.deleteWhere = sinon.stub(BaseModel, "deleteWhere").resolves(null);
  stubs.findById = sinon.stub(BaseModel, "findById").resolves(null);
  stubs.findBy = sinon.stub(BaseModel, "findBy").resolves(null);
  stubs.all = sinon.stub(BaseModel, "all").resolves([]);
  stubs.findAllBy = sinon.stub(BaseModel, "findAllBy").resolves([]);

  return stubs;
}

module.exports = setupBaseModelStubs;
