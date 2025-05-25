import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { videoApi } from "../services/api";
import { Button, ProgressBar, ProgressCircle } from "../components/ui";

// Helper function to format seconds to MM:SS
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

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

  // State to track if we need to resume video position
  const [resumePosition, setResumePosition] = useState(null);

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

        // Store the resume position to be set when video metadata loads
        if (progressData.lastPosition > 0) {
          // Make sure we don't resume too close to the end
          // If we're within 5 seconds of the end, start 10 seconds earlier to give context
          // If we're at the very end, start from 10 seconds before the end
          let safePosition = progressData.lastPosition;

          if (videoData.durationSeconds - safePosition < 5) {
            // If we're near the end, go back a bit to give context
            safePosition = Math.max(0, videoData.durationSeconds - 10);
          }

          setResumePosition(safePosition);
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to load video. Please try again later.");
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  // Handle video metadata loaded event to set resume position
  const handleLoadedMetadata = () => {
    if (resumePosition !== null && videoRef.current) {
      try {
        videoRef.current.currentTime = resumePosition;
        setResumePosition(null); // Clear the resume position after setting it
      } catch (error) {
        console.error("Error setting video resume position:", error);
      }
    }
  };

  // Fallback effect to set resume position if loadedmetadata event doesn't fire
  useEffect(() => {
    if (resumePosition !== null && videoRef.current && video) {
      // Wait a bit for the video to be ready, then try to set the position
      const timeoutId = setTimeout(() => {
        if (resumePosition !== null && videoRef.current) {
          try {
            // Check if the video duration is available (indicates metadata is loaded)
            if (
              videoRef.current.duration &&
              !isNaN(videoRef.current.duration)
            ) {
              videoRef.current.currentTime = resumePosition;
              setResumePosition(null);
            }
          } catch (error) {
            console.error(
              "Error setting video resume position (fallback):",
              error
            );
          }
        }
      }, 1000); // Wait 1 second as fallback

      return () => clearTimeout(timeoutId);
    }
  }, [resumePosition, video]);

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

      // Verify that we're actually at the end of the video (within 5% of the end)
      const currentTime = videoRef.current.currentTime;
      const videoDuration = video.durationSeconds;
      const isReallyAtEnd = videoDuration - currentTime <= videoDuration * 0.05;

      if (isReallyAtEnd) {
        // Get the current progress to check how much of the video has been watched in total
        try {
          const progressData = await videoApi.getVideoProgress(parseInt(id));

          // Only mark as complete if we've watched at least 95% of the video based on tracked intervals
          // This prevents marking as complete when skipping to the end
          if (progressData.progressPercentage >= 95) {
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
          } else {
          }
        } catch (error) {
          // Error handling is done silently
        }
      } else {
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

          // Check if we're near the end of the video (within 5% of total duration)
          const isNearEnd =
            videoDuration - currentTime <= videoDuration * 0.05 &&
            currentTime / videoDuration >= 0.95;

          if (isNearEnd) {
            // If we're very close to the end, consider it as complete
            // This helps ensure the progress reaches 100% even if the ended event doesn't fire
            try {
              // Get the current progress from the API to check how much of the video has been watched in total
              const progressData = await videoApi.getVideoProgress(
                parseInt(id)
              );

              // Only mark as complete if we've watched at least 95% of the video based on tracked intervals
              // This prevents marking as complete when skipping to the end
              if (progressData.progressPercentage >= 95) {
                await videoApi.saveWatchedInterval(
                  parseInt(id),
                  0, // Start from beginning
                  videoDuration, // Full duration
                  true // Special flag indicating this is a completion marker
                );

                // Force progress to 100%
                setProgress(100);
              } else {
              }
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

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>

        <div className="bg-gray-200 rounded-lg h-96"></div>

        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <div className="flex items-center">
          <span className="mr-2">⚠️</span>
          <span>{error}</span>
        </div>
        <div className="mt-4">
          <Button onClick={() => navigate("/")} variant="primary">
            Back to Module
          </Button>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-10 animate-fadeIn">
        <div className="text-5xl mb-4">🎬</div>
        <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
        <p className="text-gray-600 mb-6">
          The requested video could not be found or may have been removed.
        </p>
        <Button onClick={() => navigate("/")} variant="primary">
          Back to Module
        </Button>
      </div>
    );
  }

  // Extract module name from title if it exists
  let moduleName = "Web Development Fundamentals";
  let videoTitle = video.title;
  if (video.title.includes(":")) {
    const parts = video.title.split(":");
    moduleName = parts[0].trim();
    videoTitle = parts.slice(1).join(":").trim();
  }

  return (
    <div className="animate-fadeIn">
      {/* Breadcrumb navigation */}
      <div className="mb-6 flex items-center text-sm text-gray-600">
        <Link to="/" className="hover:text-indigo-600">
          Courses
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{moduleName}</span>
        <span className="mx-2">›</span>
        <span className="text-gray-800 truncate">{videoTitle}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Video player */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h1 className="text-2xl font-bold text-gray-800">{videoTitle}</h1>
              <p className="text-gray-600 mt-1">
                Module: {moduleName} • Duration:{" "}
                {formatDuration(video.durationSeconds)}
              </p>
            </div>

            <div className="relative">
              {videoError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 p-8 text-center">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="font-bold mb-2">Video playback error</p>
                  <p className="mb-4">
                    The video could not be loaded. It may be unavailable or in
                    an unsupported format.
                  </p>
                  <Button onClick={() => navigate("/")} variant="primary">
                    Back to Module
                  </Button>
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
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={() => setVideoError(true)}
                >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          {/* Video description */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">About this lesson</h2>
            <p className="text-gray-700 mb-4">
              This video is part of the {moduleName} module. Watch this lesson
              to learn key concepts and techniques.
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-6 pt-4 border-t">
              <div className="flex items-center">
                <span className="mr-2">🕒</span>
                <span>{formatDuration(video.durationSeconds)}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📊</span>
                <span>{progress}% complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Progress and navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>

            {/* Progress circle */}
            <div className="flex justify-center mb-6">
              <ProgressCircle
                progress={progress}
                size="lg"
                variant="primary"
                animated={true}
                strokeWidth={10}
                className="animate-fadeIn"
              />
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <ProgressBar
                progress={progress}
                variant="gradient"
                size="lg"
                showPercentage={true}
                animated={true}
              />
            </div>

            {/* Navigation buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                fullWidth
                size="lg"
                className="hover:shadow-md transform hover:-translate-y-1"
              >
                <span className="mr-2">←</span> Back to Module
              </Button>

              {progress === 100 && (
                <div className="bg-green-100 text-green-800 p-3 rounded-md text-center animate-fadeIn">
                  <span className="font-medium">🎉 Lesson completed!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
