const express = require("express");
const videoController = require("../controllers/video.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/video - Get all videos
router.get("/", videoController.getAllVideos);

// GET /api/video/progress?videoId=... - Get video progress
router.get("/progress", videoController.getVideoProgress);

// POST /api/video/watch - Save watched interval
router.post("/watch", videoController.saveWatchedInterval);

// GET /api/video/:id - Get video by ID
router.get("/:id", videoController.getVideoById);

module.exports = router;
