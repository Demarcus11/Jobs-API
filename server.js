import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import express from "express";
import path from "path";
import * as url from "url";
import { notFoundMiddleware } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import { router as jobsRouter } from "./routes/jobs.js";
import { router as authRouter } from "./routes/auth.js";
import { connectDB } from "./db/connect.js";
import { auth as authenicateUser } from "./middleware/authentication.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Import environment variables
dotenv.config();

// Initialize server
const server = express();

server.set("trust proxy", 1);
server.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// Enable the server to process POST requests that contain JSON
server.use(express.json());

// Secruity middleware
server.use(helmet());
server.use(cors());
server.use(xss());

// Route that checks if sevrer is running
server.get("/", (req, res) => {
  res.status(200).send("jobs api");
});

// Static files routes from public folder
server.use(express.static(path.join(__dirname, "public")));

// API root routes
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/jobs", authenicateUser, jobsRouter);

// Error middleware functions
server.use(notFoundMiddleware);
server.use(errorHandlerMiddleware);

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/`));
  } catch (error) {
    console.log(error);
  }
};

start();
