import { useState } from "react";
import YouTubeAudioPlayer from "@/components/YouTubeAudioPlayer";

export default function Home() {
	const [selectedGame, setSelectedGame] = useState<string | null>(null);

	return (
		<div className="container">
			{/* 🔥 Z-ZONE 오락실 제목 클릭 시 메인 화면으로 돌아감 */}
			<h1 className="title" onClick={() => setSelectedGame(null)}>
				Z1존 오락실
			</h1>

			{/* 🔥 게임 선택 버튼 (메뉴) */}
			{!selectedGame && (
				<div className="game-menu">
					<button onClick={() => setSelectedGame("music-game")}>🎵 음악 맞추기</button>
					<button onClick={() => setSelectedGame("coming-soon")}>🎮 Coming Soon</button>
				</div>
			)}

			{/* 🔥 선택한 게임 화면 표시 */}
			<div className="game-container">
				{selectedGame === "music-game" && <YouTubeAudioPlayer />}
				{selectedGame === "coming-soon" && <p>🚀 새로운 게임이 곧 추가됩니다!</p>}
			</div>

			{/* 🔥 스타일 추가 */}
			<style jsx>{`
				.container {
					text-align: center;
					padding: 20px;
				}

				.title {
					font-size: 32px;
					font-weight: bold;
					cursor: pointer;
					color: #0070f3;
					transition: color 0.2s ease-in-out;
				}

				.title:hover {
					color: #ff9800;
				}

				.game-menu {
					margin-top: 20px;
				}

				.game-menu button {
					margin: 10px;
					padding: 10px 20px;
					font-size: 18px;
					border: none;
					background: #0070f3;
					color: white;
					cursor: pointer;
					border-radius: 10px;
					transition: 0.2s;
				}

				.game-menu button:hover {
					background: #005bb5;
				}

				.game-container {
					margin-top: 20px;
				}
			`}</style>
		</div>
	);
}
