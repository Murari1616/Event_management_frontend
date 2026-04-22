const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const routes = require("./src/routes/routeManager.js");
const connectDB = require("./src/config/databaseConnection.js");
const globalErrorHandler = require("./src/utils/globalErrorHandler.js");
const cluster = require("cluster");
const catchAsync = require("./src/utils/catchAsync.js");
const AppError = require("./src/utils/appError.js");
const os = require("os");
const { initSocket } = require("./src/utils/socketSetup.js");

dotenv.config();

// Helper to check for environment variables
const checkEnvVar = (envVar) => {
  if (!process.env[envVar]) {
    console.error(
      `${envVar} is not defined. Please check your environment variables.`,
    );
    process.exit(1);
  }
};

// Check required environment variables
checkEnvVar("NODE_ENV");
checkEnvVar(`${process.env.NODE_ENV?.toUpperCase()}_PORT`);

const app = express();

// -------------------------------
// CORS Configuration
// -------------------------------
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "DELETE", "POST", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// -------------------------------
// Security Middleware (Helmet)
// -------------------------------
app.use(helmet());

// -------------------------------
// Logging Middleware (Morgan)
// -------------------------------
app.use(morgan("dev"));

// -------------------------------
// Body Parsing Middleware
// -------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------
// Health Check Route
// -------------------------------
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.get("/wake-up", (req, res) => {
  res.status(200).json({
    message: "🚀 Server is awake and running!",
    time: new Date().toISOString(),
  });
});

// -------------------------------
// API Routes
// -------------------------------
app.use(routes);

// -------------------------------
// 404 - Route Not Found Handler
// -------------------------------
app.use(
  "*",
  catchAsync(async (req) => {
    console.error(`Received request for ${req.originalUrl}`);
    throw new AppError("Can't find this route on this server", 404);
  }),
);

// -------------------------------
// Global Error Handler
// -------------------------------
app.use(globalErrorHandler);

// -------------------------------
// Start Server with DB Connection
// -------------------------------
const startServer = async (port) => {
  try {
    await connectDB(); // Ensure DB connection before starting server
    const server = http.createServer(app);
    initSocket(server);
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1); // Exit if DB connection fails
  }
};

// -------------------------------
// Cluster Setup for Production
// -------------------------------
if (process.env.NODE_ENV === "production" && cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for worker exit events
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Optionally restart the worker if it dies
  });
} else {
  // Default server start (no clustering for development)
  const NODE_ENV = process.env.NODE_ENV;
  const port = Number(process.env[`${NODE_ENV?.toUpperCase()}_PORT`] || 5001); // Default to 5001 if not defined
  startServer(port); // Start the server
}
