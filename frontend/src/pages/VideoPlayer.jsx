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

        // Set video to start at last position if available
        if (progressData.lastPosition > 0 && videoRef.current) {
          // Make sure we don't resume too close to the end
          // If we're within 5 seconds of the end, start 10 seconds earlier to give context
          // If we're at the very end, start from 10 seconds before the end
          let safePosition = progressData.lastPosition;

          if (videoData.durationSeconds - safePosition < 5) {
            // If we're near the end, go back a bit to give context
            safePosition = Math.max(0, videoData.durationSeconds - 10);
          }

          // Set the current time after a short delay to ensure the video is ready
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.currentTime = safePosition;
            }
          }, 500);
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to load video. Please try again later.");
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  // Handle video play event
  const handlePlay = () => {
    setIsPlaying(true);

    const currentTime = videoRef.current.currentTime;

    // Start a new interval when video starts playing
    // Only if we don't already have one
    if (!currentInterval) {
      setCurrentInterval({
        startTime: currentTime,
        endTime: currentTime,
      });
    } else {
      // If we already have an interval (e.g., after a pause),
      // just update the end time to the current position
      setCurrentInterval({
        ...currentInterval,
        endTime: currentTime,
      });
    }
  };

  // Handle video pause event
  const handlePause = async () => {
    setIsPlaying(false);

    // Save the interval when video is paused
    if (currentInterval) {
      const currentTime = videoRef.current.currentTime;

      // Update the end time to the current position
      if (currentTime > currentInterval.startTime) {
        await saveInterval(currentInterval.startTime, currentTime);

        // Don't reset the interval - keep it for when play resumes
        // This helps maintain continuous progress tracking
        setCurrentInterval({
          startTime: currentInterval.startTime,
          endTime: currentTime,
        });
      } else {
        setCurrentInterval(null);
      }
    }
  };

  // Handle video seeking event
  const handleSeeked = async () => {
    const newPosition = videoRef.current.currentTime;

    // If we were playing before seeking
    if (isPlaying && currentInterval) {
      // Calculate how far we've jumped
      const jumpDistance = Math.abs(newPosition - currentInterval.endTime);

      // If the jump is significant (more than 2 seconds), consider it a seek operation
      if (jumpDistance > 2) {
        // Only save the previous interval if it's valid (at least 1 second)
        if (currentInterval.endTime - currentInterval.startTime >= 1) {
          await saveInterval(
            currentInterval.startTime,
            currentInterval.endTime
          );
        }

        // Start a new interval from the new position
        // This ensures we don't count the skipped section
        setCurrentInterval({
          startTime: newPosition,
          endTime: newPosition,
        });
      } else {
        // For small jumps (less than 2 seconds), just update the current interval
        // This handles normal playback and small adjustments
        setCurrentInterval({
          ...currentInterval,
          endTime: newPosition,
        });
      }
    } else if (!isPlaying) {
      // If we seek while paused, don't create an interval yet
      // We'll create it when play resumes
      setCurrentInterval(null);
    }
  };

  // Handle video ended event
  const handleEnded = async () => {
    setIsPlaying(false);

    // When the video ends, we want to ensure it counts as 100% watched
    // Save an interval from the start to the full duration of the video
    if (video && videoRef.current) {
      // First save the current interval if it exists
      if (currentInterval) {
        await saveInterval(
          currentInterval.startTime,
          videoRef.current.currentTime
        );
      }

      // Then create a special "completion" interval that covers the entire video
      // This ensures the progress reaches 100%
      try {
        // For completion, we'll use a special flag to indicate this is just for progress calculation
        // and shouldn't affect the resume position
        await videoApi.saveWatchedInterval(
          parseInt(id),
          0, // Start from the beginning
          video.durationSeconds, // End at the full duration
          true // Special flag indicating this is a completion marker
        );

        // Update progress to 100%
        setProgress(100);
      } catch (error) {
        // Error handling is done silently
      }

      setCurrentInterval(null);
    }
  };

  // Update current interval end time and progress while playing
  useEffect(() => {
    let intervalId;

    if (isPlaying && currentInterval && videoRef.current && video) {
      // Update more frequently for better accuracy and real-time progress
      intervalId = setInterval(async () => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          const videoDuration = video.durationSeconds;

          // Check if we're near the end of the video (within 1.5 seconds)
          const isNearEnd = videoDuration - currentTime <= 1.5;

          if (isNearEnd) {
            // If we're very close to the end, consider it as complete
            // This helps ensure the progress reaches 100% even if the ended event doesn't fire
            try {
              await videoApi.saveWatchedInterval(
                parseInt(id),
                0, // Start from beginning
                videoDuration, // Full duration
                true // Special flag indicating this is a completion marker
              );

              // Force progress to 100%
              setProgress(100);
            } catch (error) {
              // Error handling is done silently
            }
          }
          // Only update if the time has actually changed and we're not at the end
          else if (currentTime > currentInterval.endTime) {
            // Update the current interval
            setCurrentInterval((prev) => ({
              ...prev,
              endTime: currentTime,
            }));

            // Save the interval in real-time to update progress
            // We'll use a temporary interval for this to avoid modifying the current one
            const tempStartTime = currentInterval.startTime;
            const tempEndTime = currentTime;

            // Only send updates if we've watched at least 1 second
            if (tempEndTime - tempStartTime >= 1) {
              try {
                const result = await videoApi.saveWatchedInterval(
                  parseInt(id),
                  tempStartTime,
                  tempEndTime
                );

                // Update progress state in real-time
                setProgress(result.progressPercentage);
              } catch (error) {
                // Error handling is done silently
              }
            }
          }
        }
      }, 2000); // Update every 2 seconds for real-time progress (balance between accuracy and server load)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, currentInterval, id, video]);

  // Save interval to the server
  const saveInterval = async (startTime, endTime) => {
    try {
      // Validate the interval
      if (startTime === undefined || endTime === undefined) {
        return;
      }

      // Ensure startTime is not greater than endTime
      if (startTime > endTime) {
        return;
      }

      // Only save if the interval is valid (at least 1 second)
      if (endTime - startTime >= 1) {
        // Round to 2 decimal places to avoid floating point issues
        const roundedStartTime = Math.round(startTime * 100) / 100;
        const roundedEndTime = Math.round(endTime * 100) / 100;

        const result = await videoApi.saveWatchedInterval(
          parseInt(id),
          roundedStartTime,
          roundedEndTime
        );

        // Update progress state
        setProgress(result.progressPercentage);
      }
    } catch (error) {
      // Error handling is done silently
    }
  };

  // No longer need formatTime function since we're only showing percentage

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

        <div className="text-center text-sm text-gray-600">
          <span>{progress}% complete</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
