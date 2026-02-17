require("dotenv").config();
require("module-alias/register");

const { Output } = require("ai");
const prisma = require("@/libs/prisma");
const { z } = require("zod");
const aiService = require("@/services/ai.service");

async function main() {
	const prompt = "Hãy giải cho tôi bài tập js có expected: console.log(3) // 6";
	const output = Output.array({
		element: z.object({
			title: z.string(),
			description: z.string(),
		}),
	});
	const response = await aiService.webSearch(prompt, output);
	const postIdeas = response.parse(response).elements;

	await prisma.postsIdea.createMany({
		data: postIdeas,
	});
}

main();
