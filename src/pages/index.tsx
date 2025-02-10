import { useState } from "react";
import YouTubeAudioPlayer from "@/components/YouTubeAudioPlayer";
import YouTubePlayer from "@/components/YouTubePlayer";
import PersonQuiz from "@/components/PersonQuiz";

export default function Home() {
	const [selectedGame, setSelectedGame] = useState<string | null>(null);
	const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

	const startMovieGame = () => {
		setSelectedVideo("xQ9skQV3-DU");
		setSelectedGame("movie-game");
	};

	return (
		<div className="container">
			<h1 className="title" onClick={() => setSelectedGame(null)}>
				Z1존 오락실 🎮
			</h1>

			{!selectedGame && (
				<div className="game-menu">
					<button onClick={() => setSelectedGame("music-game")}>🎵 음악 맞추기</button>
					<button onClick={startMovieGame}>🎥 명대사 퀴즈</button>
					<button onClick={() => setSelectedGame("person-quiz")}>🧑‍🎨 인물 퀴즈</button>
					<button onClick={() => setSelectedGame("coming-soon")}>Coming Soon</button>
				</div>
			)}

			<div className="game-container">
				{selectedGame === "music-game" && <YouTubeAudioPlayer />}
				{selectedGame === "movie-game" && selectedVideo && <YouTubePlayer videoId={selectedVideo} />}
				{selectedGame === "person-quiz" && <PersonQuiz />}
				{selectedGame === "coming-soon" && <p>🚀 새로운 게임이 곧 추가됩니다!</p>}
			</div>

			<style jsx>{`
				.container {
					text-align: center;
					padding: 20px;
				}

				.title {
					font-size: 32px;
					font-weight: bold;
					cursor: pointer;
					color: #ff9800;
					transition: color 0.2s ease-in-out;
				}

				.title:hover {
					color: #d2691e;
				}

				.game-menu {
					margin-top: 20px;
				}

				.game-menu button {
					margin: 10px;
					padding: 10px 20px;
					font-size: 18px;
					border: none;
					background: #ff9800;
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
