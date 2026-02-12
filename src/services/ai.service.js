const { generateText, gateway } = require("ai");
const fs = require("node:fs/promises");
const path = require("node:path");

const randomString = require("@/utils/randomString");

class AIService {
	constructor() {}

	async chat(prompt, model = "kwaipilot/kat-coder-pro-v1") {
		const { text } = await generateText({
			model,
			prompt,
		});
		return text;
	}

	async webSearch(prompt, model = "kwaipilot/kat-coder-pro-v1") {
		const { text } = await generateText({
			model,
			prompt,
			tools: {
				perplexity_search: gateway.tools.perplexitySearch(),
			},
		});

		return text;
	}

	stream() {}

	async generateImage(prompt, model = "google/gemini-3-pro-image") {
		const result = await generateText({
			model,
			prompt,
		});

		if (!result.files.length) {
			console.log("Error");
			return;
		}

		const { base64Data, mediaType } = result.files[0];
		const imageBuffer = Buffer.from(base64Data, "base64");
		const imageName = `${randomString(8)}.${mediaType.split("/").pop()}`;
		const imagePath = path.join(__dirname, "..", "..", "public", "images", "ai-generated", imageName);

		fs.writeFile(imagePath, imageBuffer, (error) => {
			if (err) {
				console.error("Error saving the image:", err);
			} else {
				console.log("The file was saved to:", filePath);
			}
		});
	}
}

module.exports = new AIService();
