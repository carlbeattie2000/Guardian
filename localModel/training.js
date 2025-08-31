const { readFile, writeFile } = require("node:fs/promises");
require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const MLR = require("ml-regression-multivariate-linear"); // Default import, not destructured

(async () => {
	const trainingData = JSON.parse(
		(await readFile("./training-data.json", "utf8")).toString(),
	);

	const texts = trainingData.map((item) => item.text);
	const priorities = trainingData.map((item) => item.priority);

	const model = await use.load();
	const embeddings = await model.embed(texts);
	const embeddingArray = await embeddings.array();
	embeddings.dispose();

	const priorities2D = priorities.map((p) => [p]); // [[0.3], [0.9], [0.4], [1], [0.1]]

	console.log("Creating MLR with shapes:");
	console.log("X:", embeddingArray.length, "x", embeddingArray[0].length);
	console.log("Y:", priorities2D.length, "x", priorities2D[0].length);

	const regression = new MLR(embeddingArray, priorities2D);

	// Test prediction
	const testText = "He has pizza";
	const testEmbedding = await model.embed([testText]);
	const testArray = await testEmbedding.array();
	testEmbedding.dispose();

	const prediction = regression.predict(testArray[0]); // Single embedding, not array
	const priorityScore = prediction[0]; // Extract from 2D result

	console.log("Priority score:", priorityScore);

	await writeFile("./trained-model.json", JSON.stringify(regression.toJSON()));
})().catch(console.error);
