const mongoose = require("mongoose");

const lendingRequestSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        borrower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Declined",
                "Returned"
            ],
            default: "Pending"
        },

        requestDate: {
            type: Date,
            default: Date.now
        },

        borrowedDate: {
            type: Date,
            default: null
        },

        returnDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "LendingRequest",
    lendingRequestSchema
);