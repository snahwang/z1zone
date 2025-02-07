import { Client } from "@notionhq/client";
import { NextApiRequest, NextApiResponse } from "next";

// Notion API 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { keywords } = req.query; // ✅ 여러 개의 키워드를 가져옴

	try {
		// ✅ 키워드 목록 가져오기 (keyword가 없는 경우)
		if (!keywords) {
			const dbResponse = await notion.databases.retrieve({ database_id: databaseId });

			// 🔥 '키워드' 필드에서 모든 태그 가져오기
			const keywordOptions = dbResponse.properties["키워드"].multi_select.options.map((option) => option.name);

			// ✅ 모든 항목 조회 (태그별 개수 세기 위해)
			const queryResponse = await notion.databases.query({ database_id: databaseId });

			// 🔥 키워드별 개수 계산
			const keywordCountMap: Record<string, number> = keywordOptions.reduce((acc, tag) => {
				acc[tag] = 0; // 초기화
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

			// ✅ 키워드 + 개수 함께 반환
			const keywordsWithCount = keywordOptions.map((tag: any) => ({
				name: tag,
				count: keywordCountMap[tag],
			}));

			return res.status(200).json({ keywords: keywordsWithCount });
		}
		// ✅ 쉼표(,)로 구분된 키워드를 배열로 변환
		const keywordArray = decodeURIComponent(keywords as string).split(",");

		// ✅ 여러 개의 키워드를 OR 조건으로 필터링
		const filters = keywordArray.map((keyword) => ({
			property: "키워드",
			multi_select: { contains: keyword.trim() }, // ✅ 공백 제거 후 필터링
		}));

		const response = await notion.databases.query({
			database_id: databaseId,
			filter: { or: filters }, // ✅ OR 조건으로 여러 키워드 검색
		});

		if (response.results.length === 0) {
			return res.status(404).json({ error: "No results found" });
		}

		// ✅ 여러 개의 결과를 배열로 변환
		const results = response.results.map((result: any) => ({
			videoId: result.properties["link"].rich_text[0]?.text.content || "",
			title: result.properties["title"].title[0]?.text.content || "제목 없음",
		}));

		const validResults = results.filter((item) => item.videoId);

		if (validResults.length === 0) {
			return res.status(404).json({ error: "No valid video IDs found" });
		}

		// ✅ 랜덤으로 하나 선택
		const randomIndex = Math.floor(Math.random() * validResults.length);
		const randomResult = validResults[randomIndex];

		res.status(200).json(randomResult);
	} catch (error) {
		console.error("Notion API Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
