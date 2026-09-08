const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true
        },

        condition: {
            type: String,
            required: true,
            default: "Good"
        },

        status: {
            type: String,
            enum: ["Available", "Lent", "Borrowed", "Unavailable"],
            default: "Available"
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        isLendable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Item", itemSchema);