
const express = require("express");
const cors = require("cors");

const internshipRoutes = require("./src/routes/internships");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} - ${req.method} ${req.url}`
    );
    next();
});

// Homepage
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Internship API is running"
    });
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        message: "Internship API is healthy",
        timestamp: new Date().toISOString()
    });
});

// Internship API routes
app.use("/api/internships", internshipRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.status && err.status < 500
            ? err.message
            : "Internal server error"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
