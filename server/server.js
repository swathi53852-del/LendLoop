require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
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

app.get("/api/users/test", (req, res) => {
    res.json({
        message: "User routes are working!"
    });
});

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

// ==========================================
// DATABASE
// ==========================================
const PORT = process.env.PORT || 5002;

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/lendloop";
const MONGO_URI = process.env.MONGO_URI || DEFAULT_MONGO_URI;

// ==========================================
// CONNECT TO MONGODB
// ==========================================

const sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

function startLocalMongoDB() {
    if (process.platform !== "win32" || process.env.MONGO_URI) {
        return false;
    }

    const binaryDirectory = path.join(
        os.homedir(),
        ".cache",
        "mongodb-binaries"
    );
    const mongodPath =
        process.env.MONGOD_PATH ||
        (fs.existsSync(binaryDirectory)
            ? fs.readdirSync(binaryDirectory)
                .filter((file) => /^mongod-x64-win32-.*\.exe$/i.test(file))
                .sort()
                .map((file) => path.join(binaryDirectory, file))
                .find((file) => fs.existsSync(file))
            : undefined);

    if (!mongodPath || !fs.existsSync(mongodPath)) {
        console.error(
            "Could not start local MongoDB: set MONGOD_PATH to mongod.exe or install MongoDB."
        );
        return false;
    }

    const localAppData =
        process.env.LOCALAPPDATA ||
        path.join(os.homedir(), "AppData", "Local");
    const mongoDirectory = path.join(localAppData, "LendLoop", "MongoDB");
    const dataDirectory = path.join(mongoDirectory, "data");
    const logDirectory = path.join(mongoDirectory, "logs");
    const logPath = path.join(logDirectory, "mongod.log");

    fs.mkdirSync(dataDirectory, { recursive: true });
    fs.mkdirSync(logDirectory, { recursive: true });

    const mongod = spawn(
        mongodPath,
        [
            "--dbpath", dataDirectory,
            "--bind_ip", "127.0.0.1",
            "--port", "27017",
            "--logpath", logPath,
            "--logappend"
        ],
        {
            detached: true,
            stdio: "ignore",
            windowsHide: true
        }
    );

    mongod.on("error", (error) => {
        console.error("Could not start local MongoDB:", error.message);
    });
    mongod.unref();

    console.log("Starting local MongoDB...");
    return true;
}

async function startServer() {
    const maxAttempts = 15;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            await mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 2000
            });
            console.log("MongoDB connected successfully");
            break;
        } catch (error) {
            if (attempt === 1 && MONGO_URI === DEFAULT_MONGO_URI) {
                startLocalMongoDB();
            }

            if (attempt === maxAttempts) {
                console.error(
                    `MongoDB connection failed after ${maxAttempts} attempts:`,
                    error.message
                );
                process.exitCode = 1;
                return;
            }

            console.warn(
                `MongoDB is not ready (attempt ${attempt}/${maxAttempts}); retrying in 2 seconds:`,
                error.message
            );
            await sleep(2000);
        }
    }

    app.listen(PORT, () => {
        console.log(`LendLoop server running on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start LendLoop server:", error);
    process.exitCode = 1;
});