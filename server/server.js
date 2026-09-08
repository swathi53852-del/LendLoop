const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
const lendingRequestRoutes = require("./routes/lendingRequestRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// IMAGES
// ==========================================

// Allow frontend to access images from server/images
app.use(
    "/images",
    express.static(path.join(__dirname, "images"))
);

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/items", itemRoutes);

app.use("/api/users", userRoutes);

app.use(
    "/api/lending-requests",
    lendingRequestRoutes
);

// ==========================================
// TEST ROUTES
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message: "LendLoop Server is running!"
    });
});

app.get("/api/users/test", (req, res) => {
    res.json({
        message: "User routes are working!"
    });
});

// ==========================================
// DATABASE
// ==========================================

const PORT = 5000;

const MONGO_URI =
    "mongodb://127.0.0.1:27017/lendloop";

// ==========================================
// CONNECT TO MONGODB
// ==========================================

mongoose
    .connect(MONGO_URI)
    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );

        // ======================================
        // START SERVER
        // ======================================

        app.listen(PORT, () => {

            console.log(
                `LendLoop server running on port ${PORT}`
            );

        });

    })
    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error.message
        );

    });