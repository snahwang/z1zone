import { useState } from "react";

const PersonQuiz = () => {
	const people = [
		{ imageUrl: "https://github.com/user-attachments/assets/e3593e7e-9a3a-47d2-a45e-17a5e81bdad4", name: "황정민" },
		{ imageUrl: "https://github.com/user-attachments/assets/cc0e733b-4642-4564-9482-452d233ab273", name: "조니뎁" },
		{ imageUrl: "https://github.com/user-attachments/assets/3ec0db88-9a8a-45f1-84c1-dfd45ea8e7c4", name: "플라톤" },
		{ imageUrl: "https://github.com/user-attachments/assets/c7c48f26-a40d-4117-8373-51d9e1d6f462", name: "동동이(아따맘마)" },
		{ imageUrl: "https://github.com/user-attachments/assets/2b82e7c4-908d-432b-8304-1cc9e5e53295", name: "싸이" },
		{ imageUrl: "https://github.com/user-attachments/assets/f0e31cb6-e6fd-49a6-9a06-6c40177c3ced", name: "리오넬 메시" },
		{ imageUrl: "https://github.com/user-attachments/assets/985e64e7-890e-4a3e-9368-846f1c67c02c", name: "안성우" },
		{ imageUrl: "https://github.com/user-attachments/assets/fc9467c4-84d6-40d5-9157-7a1e4d0de63e", name: "고길동(둘리)" },
		{ imageUrl: "https://github.com/user-attachments/assets/8b47ef63-93a0-4b93-b678-b0b87042be56", name: "김고은" },
		{ imageUrl: "https://github.com/user-attachments/assets/82c2876f-ed00-401c-9b74-8c765827ddb4", name: "덱스" },
		{ imageUrl: "https://github.com/user-attachments/assets/ea2fb0e2-8ced-42d9-8fa7-968d76b965ef", name: "에디슨" },
		{ imageUrl: "https://github.com/user-attachments/assets/ef487dd5-4f23-4a85-8f75-340bbbc7a2b5", name: "레오나르도 다빈치" },
		{ imageUrl: "https://github.com/user-attachments/assets/0b34edc4-8420-4b7f-adde-42017f9d8e9a", name: "스티브잡스" },
		{ imageUrl: "https://github.com/user-attachments/assets/1547db77-1a90-4f7d-b834-0323c65584d8", name: "이승엽" },
		{ imageUrl: "https://github.com/user-attachments/assets/95f4cd72-14f1-4553-b915-fffdc5904a72", name: "최현석" },
	];

	const [currentIndex, setCurrentIndex] = useState(0);
	const [revealLevel, setRevealLevel] = useState(20);
	const [isAnswerShown, setIsAnswerShown] = useState(false);
	const [randomRevealPosition, setRandomRevealPosition] = useState<"top" | "bottom" | "middle">("bottom");

	const revealMore = () => {
		setRevealLevel((prev) => Math.min(prev + 20, 100));
	};

	const showAnswer = () => {
		setRevealLevel(100);
		setIsAnswerShown(true);
	};

	const getRandomPosition = () => {
		const positions = ["top", "bottom", "middle"] as const;
		return positions[Math.floor(Math.random() * positions.length)];
	};

	const nextQuestion = () => {
		setCurrentIndex((prev) => (prev + 1) % people.length); // ✅ 리스트 순환
		setRevealLevel(20);
		setIsAnswerShown(false);
		setRandomRevealPosition(getRandomPosition());
	};

	const getClipPath = () => {
		switch (randomRevealPosition) {
			case "top":
				return `inset(${100 - revealLevel}% 0 0 0)`; // 위에서 아래로 공개
			case "bottom":
				return `inset(0 0 ${100 - revealLevel}% 0)`; // 아래에서 위로 공개
			case "middle":
				return `inset(${(100 - revealLevel) / 2}% 0 ${(100 - revealLevel) / 2}% 0)`; // 중간에서 점진적 공개
			default:
				return `inset(0 0 ${100 - revealLevel}% 0)`; // 기본값 (아래에서 위로 공개)
		}
	};

	return (
		<div className="quiz-container">
			<div className="image-wrapper">
				<img
					src={people[currentIndex].imageUrl}
					alt="Guess Who?"
					className="quiz-image"
					style={{
						clipPath: getClipPath(),
					}}
				/>
			</div>

			{isAnswerShown && <h2 className="answer-name">{people[currentIndex].name}</h2>}

			<div className="button-container">
				{!isAnswerShown && <button onClick={revealMore}>🔍 힌트 더보기</button>}
				<button onClick={showAnswer}>✅ 정답보기</button>
				<button onClick={nextQuestion}>➡️ 다음 문제</button>
			</div>

			<style jsx>{`
				.quiz-container {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					text-align: center;
					padding: 20px;
				}

				.image-wrapper {
					width: 300px;
					height: 400px;
					overflow: hidden;
					background: gray;
					border-radius: 10px;
				}

				.quiz-image {
					width: 100%;
					height: auto;
					transition: clip-path 0.5s ease-in-out;
				}

				.button-container {
					margin-top: 20px;
				}

				button {
					margin: 5px;
					padding: 10px 15px;
					font-size: 16px;
					border: none;
					background: #0070f3;
					color: white;
					cursor: pointer;
					border-radius: 10px;
					transition: 0.2s;
				}

				button:hover {
					background: #005bb5;
				}
			`}</style>
		</div>
	);
};

export default PersonQuiz;
