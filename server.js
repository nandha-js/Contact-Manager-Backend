// server.js
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ---------------- Security & Performance ----------------
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = (process.env.CORS_ORIGIN || "*").split(",").map(o => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many requests" }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ---------------- Routes ----------------
app.use("/api/contacts", require("./routes/contactRoutes"));
app.get("/health", (req, res) => res.json({ status: "UP" }));

// ---------------- Production ----------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "client", "build");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => res.sendFile(path.join(frontendPath, "index.html")));
}

// ---------------- Error Handling ----------------
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
