import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaRedo, FaQuestionCircle, FaTimes } from "react-icons/fa";

declare global {
	interface Window {
		onYouTubeIframeAPIReady: () => void;
		YT: any;
	}
}

const YouTubeAudioPlayer = () => {
	const [videoId, setVideoId] = useState<string | null>(null);
	const [title, setTitle] = useState<string | null>(null);
	const [keywords, setKeywords] = useState<{ name: string; count: number }[]>([]);
	const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]); // ✅ 다중 선택 가능하도록 배열 사용
	const [duration, setDuration] = useState(10);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isApiLoaded, setIsApiLoaded] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [countdown, setCountdown] = useState<number | null>(null);
	const playerTimeout = useRef<NodeJS.Timeout | null>(null);
	const playerRef = useRef<any>(null);

	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!window.YT) {
			const script = document.createElement("script");
			script.src = "https://www.youtube.com/iframe_api";
			script.async = true;
			document.body.appendChild(script);
		}

		window.onYouTubeIframeAPIReady = () => {
			console.log("YouTube API Ready");
			setIsApiLoaded(true);
		};

		fetch("/api/notion")
			.then((res) => res.json())
			.then((data) => {
				if (data.keywords) {
					setKeywords(data.keywords);
				}
			})
			.catch((err) => console.error("Failed to fetch keywords:", err));
	}, []);

	const toggleKeyword = (keyword: string) => {
		setSelectedKeywords((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]));
	};

	const restartAudio = () => {
		if (!videoId || !isApiLoaded || !playerRef.current) return;

		if (playerTimeout.current) clearTimeout(playerTimeout.current);

		playerRef.current.seekTo(0, true); // 처음부터 시작
		playerRef.current.playVideo(); // 재생
		setIsPlaying(true);

		playerTimeout.current = setTimeout(() => stopAudio(), duration * 1000);
	};

	const createYouTubePlayer = (videoId: string) => {
		if (!isApiLoaded || !containerRef.current) return;

		if (playerRef.current) {
			playerRef.current.destroy();
			playerRef.current = null;
		}

		const iframe = document.createElement("div");
		iframe.id = "youtube-player";
		containerRef.current.innerHTML = "";
		containerRef.current.appendChild(iframe);

		playerRef.current = new window.YT.Player("youtube-player", {
			height: "0",
			width: "0",
			videoId: videoId,
			playerVars: {
				autoplay: 1,
				controls: 0,
				origin: window.location.origin,
			},
			events: {
				onReady: (event: any) => {
					event.target.unMute();
					event.target.playVideo();
					setIsPlaying(true);
					if (playerTimeout.current) clearTimeout(playerTimeout.current);
					playerTimeout.current = setTimeout(() => stopAudio(), duration * 1000);
				},
			},
		});

		setVideoId(videoId);
	};

	const fetchYouTubeLink = async () => {
		if (!isApiLoaded) {
			alert("유튜브 API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
			return;
		}
		if (selectedKeywords.length === 0) {
			alert("먼저 키워드를 선택하세요!");
			return;
		}

		const queryParams = `keywords=${encodeURIComponent(selectedKeywords.join(","))}`;
		const response = await fetch(`/api/notion?${queryParams}`);
		const data = await response.json();

		if (data.videoId) {
			setTitle(data.title);
			setCountdown(3);

			let count = 3;
			const countdownInterval = setInterval(() => {
				count -= 1;
				setCountdown(count);
				if (count === 0) {
					clearInterval(countdownInterval);
					setCountdown(null);
					createYouTubePlayer(data.videoId);
				}
			}, 1000);
		} else {
			alert("해당 키워드에 해당하는 영상이 없습니다.");
		}
	};

	const showAnswer = async () => {
		if (!videoId) {
			alert("먼저 노래를 재생하세요!");
			return;
		}

		setIsModalOpen(true);
	};

	const stopAudio = () => {
		if (playerRef.current) {
			playerRef.current.pauseVideo();
			setIsPlaying(false);
		}
	};

	return (
		<div className="container">
			<h2>음악 퀴즈</h2>

			<div className="keyword-container">
				{keywords.map(({ name, count }) => (
					<button key={name} className={`keyword-button ${selectedKeywords.includes(name) ? "selected" : ""}`} onClick={() => toggleKeyword(name)}>
						<span>{name}</span>
						<br />
						<span className="count">({count})</span>
					</button>
				))}
			</div>

			<div className="input-container">
				<input type="number" placeholder="재생 시간 (초)" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />초 까지 재생
			</div>

			<div className="button-container">
				<button className="icon-button play" onClick={fetchYouTubeLink} disabled={!isApiLoaded || countdown !== null}>
					<FaPlay size={32} />
				</button>
				<button className="icon-button pause" onClick={stopAudio} disabled={!isPlaying}>
					<FaPause size={32} />
				</button>
				<button className="icon-button restart" onClick={restartAudio} disabled={!videoId}>
					<FaRedo size={32} />
				</button>
				<button className="icon-button answer" onClick={showAnswer} disabled={!videoId}>
					<FaQuestionCircle size={32} />
				</button>
			</div>

			{countdown !== null && (
				<div className="countdown-overlay">
					<h1>{countdown}</h1>
				</div>
			)}

			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal">
						<h2>🎵 정답</h2>
						<p>{title}</p>
						<button className="close-button" onClick={() => setIsModalOpen(false)}>
							<FaTimes />
						</button>
					</div>
				</div>
			)}

			<div ref={containerRef}></div>

			<style jsx>{`
				.container {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 100vh;
					text-align: center;
				}
				.input-container {
					margin: 15px 0;
				}

				input {
					padding: 10px;
					font-size: 16px;
					border: 1px solid #ccc;
					border-radius: 5px;
					text-align: center;
				}

				.countdown-overlay {
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					font-size: 80px;
					font-weight: bold;
					color: white;
					background: rgba(0, 0, 0, 0.7);
					padding: 20px;
					border-radius: 10px;
					text-align: center;
				}

				.modal-overlay {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.6);
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.modal {
					background: white;
					padding: 20px;
					border-radius: 10px;
					text-align: center;
					position: relative;
				}

				.close-button {
					position: absolute;
					top: 10px;
					right: 10px;
					background: none;
					border: none;
					font-size: 20px;
					cursor: pointer;
				}

				.button-container {
					display: flex;
					justify-content: center;
					gap: 15px;
					margin-top: 15px;
				}
				.keyword-container {
					display: flex;
					flex-wrap: wrap;
					gap: 10px;
					justify-content: center;
					margin-top: 20px;
				}

				.keyword-button {
					padding: 10px 16px;
					font-size: 16px;
					border: none;
					background: #ff9800;
					color: white;
					cursor: pointer;
					border-radius: 20px;
					transition: 0.2s;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					min-width: 80px;
				}

				.keyword-button:hover {
					background: #005bb5;
				}

				.keyword-button.selected {
					background: #d2691e !important;
					color: white;
					font-weight: bold;
				}

				.count {
					font-size: 14px;
					font-weight: bold;
					opacity: 0.8;
				}
			`}</style>
		</div>
	);
};

export default YouTubeAudioPlayer;
