const express = require("express");
const mongoose = require("mongoose");

const LendingRequest = require("../models/LendingRequest");
const Item = require("../models/Item");

const router = express.Router();


// ==========================================
// CREATE LENDING REQUEST
// POST /api/lending-requests
// ==========================================

router.post("/", async (req, res) => {
    try {
        const {
            item,
            owner,
            borrower,
            returnDate
        } = req.body;

        if (!item || !owner || !borrower) {
            return res.status(400).json({
                message: "Item, owner and borrower are required"
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(item) ||
            !mongoose.Types.ObjectId.isValid(owner) ||
            !mongoose.Types.ObjectId.isValid(borrower)
        ) {
            return res.status(400).json({
                message: "Invalid item, owner or borrower ID"
            });
        }

        // Check item exists
        const existingItem = await Item.findById(item);

        if (!existingItem) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        // Prevent owner from borrowing own item
        if (String(existingItem.owner) !== String(owner)) {
            return res.status(400).json({
                message: "Owner does not match item owner"
            });
        }

        if (String(owner) === String(borrower)) {
            return res.status(400).json({
                message: "You cannot request your own item"
            });
        }

        // Check item availability
        if (existingItem.status !== "Available") {
            return res.status(400).json({
                message: "Item is not available"
            });
        }

        // Prevent duplicate pending request
        const existingRequest = await LendingRequest.findOne({
            item,
            borrower,
            status: "Pending"
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "You already requested this item"
            });
        }

        const request = new LendingRequest({
            item,
            owner,
            borrower,
            status: "Pending",
            returnDate: returnDate || null
        });

        const savedRequest = await request.save();

        const populatedRequest =
            await LendingRequest.findById(savedRequest._id)
                .populate("item", "name description category condition status image location")
                .populate("owner", "name email")
                .populate("borrower", "name email");

        res.status(201).json(populatedRequest);

    } catch (error) {
        console.error("Create lending request error:", error);

        res.status(500).json({
            message: "Failed to create lending request",
            error: error.message
        });
    }
});


// ==========================================
// GET ALL LENDING REQUESTS
// GET /api/lending-requests
// ==========================================

router.get("/", async (req, res) => {
    try {

        const requests = await LendingRequest.find()
            .populate(
                "item",
                "name description category condition status image location owner"
            )
            .populate("owner", "name email")
            .populate("borrower", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(requests);

    } catch (error) {
        console.error("Fetch lending requests error:", error);

        res.status(500).json({
            message: "Failed to fetch lending requests",
            error: error.message
        });
    }
});


// ==========================================
// GET REQUESTS INVOLVING ONE USER
// GET /api/lending-requests/user/:userId
// ==========================================

router.get("/user/:userId", async (req, res) => {
    try {

        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const requests = await LendingRequest.find({
            $or: [
                { owner: userId },
                { borrower: userId }
            ]
        })
            .populate(
                "item",
                "name description category condition status image location owner"
            )
            .populate("owner", "name email")
            .populate("borrower", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(requests);

    } catch (error) {
        console.error("Fetch user lending requests error:", error);

        res.status(500).json({
            message: "Failed to fetch user lending requests",
            error: error.message
        });
    }
});


// ==========================================
// APPROVE REQUEST
// PUT /api/lending-requests/:id/approve
// ==========================================

router.put("/:id/approve", async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid request ID"
            });
        }

        const request = await LendingRequest.findById(id);

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({
                message: `Request is already ${request.status}`
            });
        }

        const item = await Item.findById(request.item);

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (item.status !== "Available") {
            return res.status(400).json({
                message: "Item is no longer available"
            });
        }

        // Approve request
        request.status = "Approved";
        request.borrowedDate = new Date();

        await request.save();

        // Change item status
        item.status = "Lent";

        await item.save();

        const populatedRequest =
            await LendingRequest.findById(request._id)
                .populate(
                    "item",
                    "name description category condition status image location owner"
                )
                .populate("owner", "name email")
                .populate("borrower", "name email");

        res.status(200).json({
            message: "Request approved successfully",
            request: populatedRequest
        });

    } catch (error) {
        console.error("Approve request error:", error);

        res.status(500).json({
            message: "Failed to approve request",
            error: error.message
        });
    }
});


// ==========================================
// DECLINE REQUEST
// PUT /api/lending-requests/:id/decline
// ==========================================

router.put("/:id/decline", async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid request ID"
            });
        }

        const request = await LendingRequest.findById(id);

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({
                message: `Request is already ${request.status}`
            });
        }

        request.status = "Declined";

        await request.save();

        const populatedRequest =
            await LendingRequest.findById(request._id)
                .populate(
                    "item",
                    "name description category condition status image location owner"
                )
                .populate("owner", "name email")
                .populate("borrower", "name email");

        res.status(200).json({
            message: "Request declined successfully",
            request: populatedRequest
        });

    } catch (error) {
        console.error("Decline request error:", error);

        res.status(500).json({
            message: "Failed to decline request",
            error: error.message
        });
    }
});


// ==========================================
// RETURN ITEM
// PUT /api/lending-requests/:id/return
// ==========================================

router.put("/:id/return", async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid request ID"
            });
        }

        const request = await LendingRequest.findById(id);

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        if (request.status !== "Approved") {
            return res.status(400).json({
                message: "Only approved items can be returned"
            });
        }

        request.status = "Returned";

        await request.save();

        const item = await Item.findById(request.item);

        if (item) {
            item.status = "Available";
            await item.save();
        }

        const populatedRequest =
            await LendingRequest.findById(request._id)
                .populate(
                    "item",
                    "name description category condition status image location owner"
                )
                .populate("owner", "name email")
                .populate("borrower", "name email");

        res.status(200).json({
            message: "Item returned successfully",
            request: populatedRequest
        });

    } catch (error) {
        console.error("Return item error:", error);

        res.status(500).json({
            message: "Failed to return item",
            error: error.message
        });
    }
});


module.exports = router;