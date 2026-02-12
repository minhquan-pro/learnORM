require("dotenv").config();
require("module-alias/register");

const aiService = require("@/services/ai.service");

async function main() {
	const prompt = "Hãy giải cho tôi bài tập js có expected: console.log(3) // 6";
	const output = await aiService.chat(prompt);
	console.log(output);
}

main();
