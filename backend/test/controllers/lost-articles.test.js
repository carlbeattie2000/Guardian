const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai").default;
const ExpressMockRequest = require("../testing-utils/expressRequest");
const ExpressMockResponse = require("test/testing-utils/expressResponse");
const LostItemModel = require("src/models/lost-item.model");
const lostArticlesControler = require("src/controllers/lost-articles.controller");
const lostArticleService = require("src/services/lost-articles.service");
const PersonalDetailsModel = require("src/models/personal-details.model");
const personalDetailsService = require("src/services/personal-details.service");
const chaiAsPromised = require("chai-as-promised").default;

chai.use(sinonChai);
chai.use(chaiAsPromised);

const { expect } = chai;

describe("LostArticlesController", () => {
  /** @type {import("test/testing-utils/expressRequest").RequestMock} */
  let req;
  /** @type {import("test/testing-utils/expressResponse").ResponseMock} */
  let res;

  beforeEach(() => {
    req = ExpressMockRequest.new();
    res = ExpressMockResponse.new();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("create", () => {
    it("should create new lost article report", async () => {
      const lostArticle = new LostItemModel("Phone", "A phone description");
      const resPromise = Promise.resolve(lostArticle);
      const resBody = ExpressMockResponse.createJsonResponseBody(
        false,
        lostArticle,
      );

      req.body = {
        name: lostArticle.name,
        description: lostArticle.description,
      };
      req.user = 1;

      const createLostArticleReportStub = sinon
        .stub(lostArticleService, "create")
        .returns(resPromise);

      await lostArticlesControler.create(req, res);

      expect(createLostArticleReportStub)
        .to.be.calledOnceWithExactly(undefined, req.body, 1)
        .returned(resPromise);
      expect(res.body).to.be.deep.equal(resBody);
    });

    it("should propagate errors", async () => {
      req.body = {
        name: "",
        description: "",
      };
      req.user = 1;

      const createLostArticleReportStub = sinon
        .stub(lostArticleService, "create")
        .rejects();

      await expect(lostArticlesControler.create(req, res)).to.be.rejected;

      expect(createLostArticleReportStub).to.be.calledOnceWithExactly(
        undefined,
        req.body,
        1,
      );
    });
  });

  describe("getById", () => {
    it("should get lost article report", async () => {
      const lostArticle = new LostItemModel(
        "Phone",
        "A phone description",
        "",
        "",
        "",
        1,
      );
      const resPromise = Promise.resolve(lostArticle);
      const resBody = ExpressMockResponse.createJsonResponseBody(
        false,
        lostArticle,
      );

      req.params = {
        id: 1,
      };
      req.user = 1;

      const getLostArticleStub = sinon
        .stub(lostArticleService, "getById")
        .returns(resPromise);

      await lostArticlesControler.getById(req, res);

      expect(getLostArticleStub)
        .to.be.calledOnceWithExactly(1, 1)
        .returned(resPromise);
      expect(res.body).to.be.deep.equal(resBody);
    });

    it("should propagate errors", async () => {
      req.params = {
        id: 1,
      };
      req.user = 1;

      const getLostArticleStub = sinon
        .stub(lostArticleService, "getById")
        .rejects();

      await expect(lostArticlesControler.getById(req, res)).to.be.rejected;

      expect(getLostArticleStub).to.be.calledOnceWithExactly(1, 1);
    });
  });

  describe("getAll", () => {
    it("should get all", async () => {
      const lostArticles = [
        new LostItemModel("Phone", "A phone description"),
        new LostItemModel("Laptop", "A laptop description"),
      ];
      const resPromise = Promise.resolve(lostArticles);
      const resBody = ExpressMockResponse.createJsonResponseBody(
        false,
        lostArticles,
      );

      const getAllStub = sinon
        .stub(lostArticleService, "getAll")
        .returns(resPromise);

      await lostArticlesControler.getAll(req, res);

      expect(getAllStub).to.be.calledOnce;
      expect(res.body).to.be.deep.equal(resBody);
    });

    it("should propagate errors", async () => {
      const getAllStub = sinon.stub(lostArticleService, "getAll").rejects();

      await expect(lostArticlesControler.getAll(req, res)).to.be.rejected;
      expect(getAllStub).to.be.calledOnce;
    });
  });

  describe("createPersonalDetails", () => {
    it("should add personal details", async () => {
      const personalDetails = new PersonalDetailsModel("John", "Smith");
      const resPromise = Promise.resolve(personalDetails);
      const resBody = ExpressMockResponse.createJsonResponseBody(
        false,
        personalDetails,
      );

      req.body = {
        first_name: personalDetails.first_name,
        last_name: personalDetails.last_name,
      };
      req.params = {
        id: 1,
      };
      req.user = 1;

      sinon.stub(lostArticleService, "canModify").returns(true);

      const createPersoanlDetailsStub = sinon
        .stub(personalDetailsService, "createLostArticlePersonalDetails")
        .returns(resPromise);

      await lostArticlesControler.createPersonalDetails(req, res);

      expect(createPersoanlDetailsStub)
        .to.be.calledOnceWithExactly(req.body, 1)
        .returned(resPromise);

      expect(res.body).to.be.deep.equal(resBody);
    });

    it("should throw if user lacks permissions", async () => {
      req.body = {
        first_name: "",
        last_name: "",
      };
      req.params = {
        id: 1,
      };
      req.user = 1;

      sinon.stub(lostArticleService, "canModify").returns(false);

      const createPersoanlDetailsStub = sinon.stub(
        personalDetailsService,
        "createLostArticlePersonalDetails",
      );

      await expect(lostArticlesControler.createPersonalDetails(req, res)).to.be
        .rejected;

      expect(createPersoanlDetailsStub).to.not.be.calledOnceWithExactly(
        req.body,
        1,
      );
    });

    it("should propagate errors", async () => {
      req.body = {
        first_name: "",
        last_name: "",
      };
      req.params = {
        id: 1,
      };
      req.user = 1;

      sinon.stub(lostArticleService, "canModify").returns(true);

      const createPersoanlDetailsStub = sinon
        .stub(personalDetailsService, "createLostArticlePersonalDetails")
        .rejects();

      await expect(lostArticlesControler.createPersonalDetails(req, res)).to.be
        .rejected;

      expect(createPersoanlDetailsStub).to.be.calledOnceWithExactly(
        req.body,
        1,
      );
    });
  });
});
