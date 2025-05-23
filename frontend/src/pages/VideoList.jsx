import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { videoApi } from "../services/api";
import {
  Button,
  Input,
  ProgressBar,
  ProgressCircle,
  Card,
  Badge,
} from "../components/ui";

// Helper function to group videos into modules
const groupVideosByModule = (videos) => {
  // This is a simple grouping by first word of title
  // In a real app, you'd have proper module data from the backend
  const modules = {};

  videos.forEach((video) => {
    // Extract module name from title (first word before ":")
    // If no ":" is found, use "Web Development Fundamentals" as default module
    let moduleName = "Web Development Fundamentals";
    if (video.title.includes(":")) {
      moduleName = video.title.split(":")[0].trim();
    }

    if (!modules[moduleName]) {
      modules[moduleName] = [];
    }

    modules[moduleName].push(video);
  });

  return modules;
};

// Helper function to calculate total duration of videos in a module
const calculateModuleDuration = (videos) => {
  return videos.reduce((total, video) => total + video.durationSeconds, 0);
};

// Helper function to format seconds to MM:SS
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Helper function to calculate module completion percentage
const calculateModuleCompletion = (videos, progressData) => {
  if (!videos.length) return 0;

  let totalPercentage = 0;
  videos.forEach((video) => {
    if (progressData[video.id]) {
      totalPercentage += progressData[video.id].progressPercentage;
    }
  });

  return Math.round(totalPercentage / videos.length);
};

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoProgress, setVideoProgress] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await videoApi.getAllVideos();
        setVideos(data);

        // Fetch progress for each video
        const progressData = {};
        for (const video of data) {
          const progress = await videoApi.getVideoProgress(video.id);
          progressData[video.id] = progress;
        }
        setVideoProgress(progressData);

        // Initialize all modules as expanded
        const modules = groupVideosByModule(data);
        const initialExpandedState = {};
        Object.keys(modules).forEach((module) => {
          initialExpandedState[module] = true;
        });
        setExpandedModules(initialExpandedState);

        setLoading(false);
      } catch (error) {
        setError("Failed to load videos. Please try again later.");
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const toggleModule = (moduleName) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  // Filter and sort videos
  const getFilteredVideos = () => {
    let filteredVideos = [...videos];

    // Apply search filter
    if (searchTerm) {
      filteredVideos = filteredVideos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "title-asc":
        filteredVideos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filteredVideos.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "duration-asc":
        filteredVideos.sort((a, b) => a.durationSeconds - b.durationSeconds);
        break;
      case "duration-desc":
        filteredVideos.sort((a, b) => b.durationSeconds - a.durationSeconds);
        break;
      case "progress":
        filteredVideos.sort((a, b) => {
          const progressA = videoProgress[a.id]?.progressPercentage || 0;
          const progressB = videoProgress[b.id]?.progressPercentage || 0;
          return progressB - progressA;
        });
        break;
      default:
        // Keep original order
        break;
    }

    return filteredVideos;
  };

  // Group filtered videos into modules
  const getModules = () => {
    return groupVideosByModule(getFilteredVideos());
  };

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-100 p-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
            <div className="p-4 space-y-4">
              {[1, 2].map((j) => (
                <div key={j} className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">📚</div>
        <h2 className="text-2xl font-bold mb-4">No Courses Available</h2>
        <p className="text-gray-600 mb-6">
          There are currently no courses available in your library.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => alert("Feature coming soon!")}
        >
          Browse Course Catalog
        </button>
      </div>
    );
  }

  const modules = getModules();
  const moduleCount = Object.keys(modules).length;
  const totalVideos = videos.length;

  // Calculate overall progress
  const overallProgress =
    totalVideos > 0
      ? Math.round(
          Object.values(videoProgress).reduce(
            (sum, progress) => sum + progress.progressPercentage,
            0
          ) / totalVideos
        )
      : 0;

  return (
    <div className="animate-fadeIn">
      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Learning Dashboard
            </h1>
            <p className="text-gray-600">
              {moduleCount} modules • {totalVideos} videos •{" "}
              {formatDuration(
                videos.reduce(
                  (total, video) => total + video.durationSeconds,
                  0
                )
              )}{" "}
              total duration
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-center">
            <ProgressCircle
              progress={overallProgress}
              size="sm"
              variant="primary"
              className="mb-1"
            />
            <span className="text-sm text-gray-600">Overall Progress</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <ProgressBar
            progress={overallProgress}
            variant="primary"
            size="md"
            animated={true}
          />
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-64">
          <Input
            id="search"
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="🔍"
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            className="form-input"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default Order</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="duration-asc">Duration (Shortest First)</option>
            <option value="duration-desc">Duration (Longest First)</option>
            <option value="progress">Progress (Highest First)</option>
          </select>
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-6">
        {Object.entries(modules).map(([moduleName, moduleVideos]) => {
          const isExpanded = expandedModules[moduleName];
          const moduleCompletion = calculateModuleCompletion(
            moduleVideos,
            videoProgress
          );
          const moduleDuration = calculateModuleDuration(moduleVideos);

          return (
            <Card key={moduleName} padding={false} className="overflow-hidden">
              {/* Module Header */}
              <div
                className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer border-b"
                onClick={() => toggleModule(moduleName)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      moduleCompletion === 100
                        ? "bg-green-100 text-green-800"
                        : moduleCompletion > 0
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {moduleCompletion === 100
                      ? "✓"
                      : moduleCompletion > 0
                      ? "▶"
                      : "📚"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{moduleName}</h3>
                    <p className="text-sm text-gray-600">
                      {moduleVideos.length} videos •{" "}
                      {formatDuration(moduleDuration)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-medium">
                      {moduleCompletion}% complete
                    </div>
                    <div className="w-24 mt-1">
                      <ProgressBar
                        progress={moduleCompletion}
                        variant={
                          moduleCompletion === 100 ? "success" : "accent"
                        }
                        size="sm"
                        animated={false}
                      />
                    </div>
                  </div>
                  <div className="text-gray-400">{isExpanded ? "▼" : "▶"}</div>
                </div>
              </div>

              {/* Module Content */}
              {isExpanded && (
                <div className="p-4 space-y-3 animate-fadeIn">
                  {moduleVideos.map((video) => {
                    const progress = videoProgress[video.id];
                    const isCompleted = progress?.progressPercentage === 100;
                    const isStarted = progress?.progressPercentage > 0;

                    return (
                      <div
                        key={video.id}
                        className="flex flex-col md:flex-row items-start md:items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              isCompleted
                                ? "bg-green-100 text-green-800"
                                : isStarted
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {isCompleted ? "✓" : "▶"}
                          </div>
                        </div>

                        <div className="flex-grow">
                          <h4 className="font-medium">
                            {video.title.includes(":")
                              ? video.title.split(":").slice(1).join(":").trim()
                              : video.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Duration: {formatDuration(video.durationSeconds)}
                          </p>

                          {progress && (
                            <div className="mt-2 flex items-center">
                              <div className="w-full mr-2">
                                <ProgressBar
                                  progress={progress.progressPercentage}
                                  variant={isCompleted ? "success" : "accent"}
                                  size="sm"
                                  animated={false}
                                />
                              </div>
                              <span className="text-xs text-gray-600 whitespace-nowrap">
                                {progress.progressPercentage}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 md:mt-0 w-full md:w-auto">
                          <Button
                            as={Link}
                            to={`/video/${video.id}`}
                            variant={
                              isCompleted
                                ? "success"
                                : isStarted
                                ? "accent"
                                : "primary"
                            }
                            size="sm"
                            className="block text-center md:w-auto"
                          >
                            {isCompleted
                              ? "Review"
                              : progress?.lastPosition > 0
                              ? "Continue"
                              : "Start"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VideoList;
