import express from "express";

import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";

const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Health-check route
app.get("/", (req, res) => {
    res.json({
        message: "HireHub backend is working",
    });
});

// Test route
app.get("/test", (req, res) => {
    res.json({
        message: "Test route is working",
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Candidate profile routes
app.use("/api/candidate", candidateRoutes);

export default app;

