const sinon = require("sinon");
const dialogflow = require("@google-cloud/dialogflow");

sinon.stub(dialogflow, "SessionsClient").returns({
  projectAgentSessionPath: sinon.stub().returns("mock-path"),
  detectIntent: sinon.stub().resolves([
    {
      queryResult: {
        intent: { displayName: "test.intent" },
        fulfillmentText: "Mock response",
      },
    },
  ]),
});
