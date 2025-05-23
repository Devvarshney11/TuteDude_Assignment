import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { videoApi } from "../services/api";

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const [videoError, setVideoError] = useState(false);

  // Track the current interval being watched
  const [currentInterval, setCurrentInterval] = useState(null);

  // Track if the video is currently playing
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch video data and progress
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);

        // Fetch video details
        const videoData = await videoApi.getVideoById(parseInt(id));
        setVideo(videoData);

        // Fetch video progress
        const progressData = await videoApi.getVideoProgress(parseInt(id));
        setProgress(progressData.progressPercentage);
        setWatchedTime(progressData.uniqueSecondsWatched);

        // Set video to start at last position if available
        if (progressData.lastPosition > 0 && videoRef.current) {
          videoRef.current.currentTime = progressData.lastPosition;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching video data:", error);
        setError("Failed to load video. Please try again later.");
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  // Handle video play event
  const handlePlay = () => {
    setIsPlaying(true);

    // Start a new interval when video starts playing
    setCurrentInterval({
      startTime: videoRef.current.currentTime,
      endTime: videoRef.current.currentTime,
    });
  };

  // Handle video pause event
  const handlePause = async () => {
    setIsPlaying(false);

    // Save the interval when video is paused
    if (currentInterval) {
      await saveInterval(
        currentInterval.startTime,
        videoRef.current.currentTime
      );
      setCurrentInterval(null);
    }
  };

  // Handle video seeking event
  const handleSeeked = async () => {
    // If video was playing and we seek, save the previous interval and start a new one
    if (isPlaying && currentInterval) {
      await saveInterval(currentInterval.startTime, currentInterval.endTime);

      // Start a new interval from the new position
      setCurrentInterval({
        startTime: videoRef.current.currentTime,
        endTime: videoRef.current.currentTime,
      });
    }
  };

  // Handle video ended event
  const handleEnded = async () => {
    setIsPlaying(false);

    // Save the final interval
    if (currentInterval) {
      await saveInterval(
        currentInterval.startTime,
        videoRef.current.currentTime
      );
      setCurrentInterval(null);
    }
  };

  // Update current interval end time while playing
  useEffect(() => {
    let intervalId;

    if (isPlaying && currentInterval) {
      intervalId = setInterval(() => {
        setCurrentInterval((prev) => ({
          ...prev,
          endTime: videoRef.current.currentTime,
        }));
      }, 1000); // Update every second
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, currentInterval]);

  // Save interval to the server
  const saveInterval = async (startTime, endTime) => {
    try {
      // Only save if the interval is valid (at least 1 second)
      if (endTime - startTime >= 1) {
        const result = await videoApi.saveWatchedInterval(
          parseInt(id),
          startTime,
          endTime
        );

        // Update progress state
        setProgress(result.progressPercentage);
        setWatchedTime(result.uniqueSecondsWatched);
      }
    } catch (error) {
      console.error("Error saving interval:", error);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
        <p className="text-gray-600 mb-4">
          The requested video could not be found.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Back to Videos
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          &larr; Back to Videos
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {videoError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 text-center">
            <p className="font-bold mb-2">Video playback error</p>
            <p>
              The video could not be loaded. It may be unavailable or in an
              unsupported format.
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="w-full"
            controls
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={handleSeeked}
            onEnded={handleEnded}
            onError={() => setVideoError(true)}
          >
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2">Progress</h2>

        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Watched: {formatTime(watchedTime)} /{" "}
            {formatTime(video.durationSeconds)}
          </span>
          <span>{progress}% complete</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
