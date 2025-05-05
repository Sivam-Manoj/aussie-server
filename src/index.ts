import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { appwithDB } from "./config/appWithDB.js";
//import routes and route handlers
import errorHandler from "./middleware/error/ErrorHandler.js"; //import error handler middleware
//routes
import playerRoutes from "./routes/playerRoutes/playerRoutes.js"; // player routes
import userRoutes from "./routes/userRoutes/userRoutes.js"; //user routes
import adminRoutes from "./routes/adminRoutes/adminRoutes.js"; // admin routes
//verification routes
import verifyRoutes from "./routes/verificationRoutes/userVerificationRoutes.js";
import path from "path";
import inSeasonRoutes from "./routes/seasonsRoutes/in-seasonRoutes.js";
import preSeasonRoutes from "./routes/seasonsRoutes/pre-seasonRoutes.js";
import postSeasonRoutes from "./routes/seasonsRoutes/post-seasonRoutes.js";
import offSeasonRoutes from "./routes/seasonsRoutes/off-seasonRoutes.js";
// Configure dotenv to retrieve keys from .env file
// This makes sure that environment variables in the `.env` file are loaded into the process.
configDotenv();

// Initialize app (express application)
// `express()` creates an Express app instance which is used to define routes and middlewares.
const app = express();

//cookie parser for manage cookies
app.use(cookieParser());

// Middleware to parse JSON
// This middleware is essential for handling incoming requests that have JSON payloads.
app.use(express.json());

// Middleware to parse URL-encoded data
// Handles form submissions (from clients like web browsers) in a way that the data is passed in a format suitable for the app (using `req.body`).
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing (CORS)
// CORS allows resources to be shared between different domains, which is important for APIs to be accessed from different origins.
const corsOptions = {
  origin: ["http://localhost:3302", "http://localhost:3000"], // specify allowed origins
  credentials: true, // allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

// Verification routes (API endpoints)
// Here, we are defining the `/security` base route and telling Express to route incoming req toverifyRoutes  file.
app.use("/security", verifyRoutes);

// Player routes (API endpoints)
// Here, we are defining the `/player` base route and telling Express to route all requests to `playerRoutes` file.
app.use("/player", playerRoutes);

//User routes(API endpoints)
// Here, we are defining the `/user` base route and telling Express to route all requests to `UserRoutes` file.
app.use("/user", userRoutes);

// Admin routes (API endpoints)
// Here, we are defining the `/admin` base route and telling Express to route all requests to `adminRoutes` file.
app.use("/admin", adminRoutes);

// Pre-season routes (API endpoints)
// Here, we are defining the `/pre-season` base route and telling Express to route all requests to `pre-seasonRoutes` file.
app.use("/pre-season", preSeasonRoutes);

// In-season routes (API endpoints)
// Here, we are defining the `/in-season` base route and telling Express to route all requests to `in-seasonRoutes` file.
app.use("/in-season", inSeasonRoutes);

// Post-season routes (API endpoints)
// Here, we are defining the `/post-season` base route and telling Express to route all requests to `post-seasonRoutes` file.
app.use("/post-season", postSeasonRoutes);

// Off-season routes (API endpoints)
// Here, we are defining the `/off-season` base route and telling Express to route all requests to `off-seasonRoutes` file.
app.use("/off-season", offSeasonRoutes);

app.use("/api/calendar", inSeasonRoutes); // Calendar routes (API endpoints)
app.use("/api/calendar", preSeasonRoutes); // Calendar routes (API endpoints)
app.use("/api/calendar", postSeasonRoutes); // Calendar routes (API endpoints)
app.use("/api/calendar", offSeasonRoutes); // Calendar routes (API endpoints)
// Use process.cwd() to get the absolute path to the root of the project
const rootPath = process.cwd(); // This will point to the project root

// Path to the "views" folder and "index.html" file (relative to the project root)
const viewsPath = path.join(rootPath, "views"); // This will correctly resolve the views folder

const indexPath = path.join(viewsPath, "index.html");

// Serve static files from the "views" folder
app.use(express.static(viewsPath)); // Serve static files from views

// Catch-all route for all other routes, send index.html
app.get("*", (_req, res) => {
  res.sendFile(indexPath); // Send the absolute path to the file
});

// Custom Error Handler
// This is a custom middleware that catches any errors thrown in previous middlewares or routes
// and handles them (like sending a proper error response back to the client).
app.use(errorHandler);


// Connect app with the database
// This function connects the app to the database. It's usually where you'd set up your database connection.
// It's typically called after setting up routes and middlewares to ensure database is connected before handling any requests.
appwithDB(app);
