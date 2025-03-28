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
//verification routes
import verifyRoutes from "./routes/verificationRoutes/userVerificationRoutes.js";

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
  origin: ["https://www.aussierulespro.com", "http://localhost:3000"], // specify allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed HTTP methods
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

// Custom Error Handler
// This is a custom middleware that catches any errors thrown in previous middlewares or routes
// and handles them (like sending a proper error response back to the client).
app.use(errorHandler);

// Connect app with the database
// This function connects the app to the database. It's usually where you'd set up your database connection.
// It's typically called after setting up routes and middlewares to ensure database is connected before handling any requests.
appwithDB(app);
