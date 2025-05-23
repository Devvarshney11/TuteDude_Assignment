import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Configure axios
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Video API
export const videoApi = {
  // Get all videos
  getAllVideos: async () => {
    try {
      const response = await axios.get(`${API_URL}/video`);
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  },

  // Get video by ID
  getVideoById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/video/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching video ${id}:`, error);
      throw error;
    }
  },

  // Save watched interval
  saveWatchedInterval: async (videoId, startTime, endTime) => {
    try {
      const response = await axios.post(`${API_URL}/video/watch`, {
        videoId,
        startTime,
        endTime,
      });
      return response.data;
    } catch (error) {
      console.error("Error saving watched interval:", error);
      throw error;
    }
  },

  // Get video progress
  getVideoProgress: async (videoId) => {
    try {
      const response = await axios.get(`${API_URL}/video/progress`, {
        params: { videoId },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for video ${videoId}:`, error);
      throw error;
    }
  },
};
