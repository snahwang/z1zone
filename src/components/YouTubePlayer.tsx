import React from "react";

interface YouTubePlayerProps {
	videoId: string; // ✅ 유튜브 영상 ID
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
	return (
		<div className="player-container">
			<iframe
				width="100%"
				height="100%"
				src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`}
				title="YouTube video player"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			></iframe>

			<style jsx>{`
				.player-container {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100vh; /* 전체 화면 */
					background: black;
				}

				iframe {
					max-width: 80%;
					max-height: 80vh;
					border-radius: 10px;
				}
			`}</style>
		</div>
	);
};

export default YouTubePlayer;
