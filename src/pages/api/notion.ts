import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";

// Notion API 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { keywords } = req.query;

	try {
		if (!keywords) {
			const dbResponse = await notion.databases.retrieve({ database_id: databaseId });

			const keywordOptions = dbResponse.properties["키워드"].multi_select.options.map((option) => option.name);
			const queryResponse = await notion.databases.query({ database_id: databaseId });
			const keywordCountMap: Record<string, number> = keywordOptions.reduce((acc, tag) => {
				acc[tag] = 0;
				return acc;
			}, {});

			queryResponse.results.forEach((result: any) => {
				const tags = result.properties["키워드"].multi_select.map((tag: any) => tag.name);
				tags.forEach((tag: string) => {
					if (keywordCountMap[tag] !== undefined) {
						keywordCountMap[tag] += 1; // 해당 키워드 개수 증가
					}
				});
			});

			const keywordsWithCount = keywordOptions.map((tag: any) => ({
				name: tag,
				count: keywordCountMap[tag],
			}));

			return res.status(200).json({ keywords: keywordsWithCount });
		}

		const keywordArray = decodeURIComponent(keywords as string).split(",");

		const filters = keywordArray.map((keyword) => ({
			property: "키워드",
			multi_select: { contains: keyword.trim() },
		}));

		const response = await notion.databases.query({
			database_id: databaseId,
			filter: { or: filters },
		});

		if (response.results.length === 0) {
			return res.status(404).json({ error: "No results found" });
		}

		const results = response.results.map((result: any) => ({
			videoId: result.properties["link"].rich_text[0]?.text.content || "",
			title: result.properties["title"].title[0]?.text.content || "제목 없음",
		}));

		const validResults = results.filter((item) => item.videoId);

		if (validResults.length === 0) {
			return res.status(404).json({ error: "No valid video IDs found" });
		}

		const randomIndex = Math.floor(Math.random() * validResults.length);
		const randomResult = validResults[randomIndex];

		res.status(200).json(randomResult);
	} catch (error) {
		console.error("Notion API Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
