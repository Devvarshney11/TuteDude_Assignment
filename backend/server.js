const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import database connection
const db = require("./config/db.config");

// Import routes
const authRoutes = require("./routes/auth.routes");
const videoRoutes = require("./routes/video.routes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/video", videoRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Learning Vista API" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Database connection: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`
  );
});
