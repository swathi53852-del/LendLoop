const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");
const { getItemImage } = require("../services/imageService");

const router = express.Router();


// ==========================================
// ADD ITEM
// ==========================================

router.post("/", async (req, res) => {
    try {

        const {
            name,
            description,
            category,
            condition,
            owner,
            image,
            location,
            isLendable
        } = req.body;


        // ==========================================
        // VALIDATE REQUIRED FIELDS
        // ==========================================

        if (!name || !description || !category || !owner) {

            return res.status(400).json({
                message:
                    "Name, description, category and owner are required"
            });

        }


        // ==========================================
        // VALIDATE OWNER ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(owner)) {

            return res.status(400).json({
                message: "Invalid owner ID"
            });

        }


        // ==========================================
        // GET IMAGE AUTOMATICALLY
        // ==========================================

        let itemImage = image || "";

        if (!itemImage) {

            itemImage = await getItemImage(
                name.trim(),
                category
            );

        }


        // ==========================================
        // CREATE ITEM
        // ==========================================

        const item = new Item({

            name: name.trim(),

            description: description.trim(),

            category,

            condition: condition || "Good",

            owner,

            image: itemImage,

            location: location || "",

            isLendable:
                isLendable !== undefined
                    ? isLendable
                    : true

        });


        // ==========================================
        // SAVE ITEM
        // ==========================================

        const savedItem = await item.save();


        // ==========================================
        // GET OWNER DETAILS
        // ==========================================

        const populatedItem =
            await Item.findById(savedItem._id)
                .populate("owner", "name email");


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json(populatedItem);

    }

    catch (error) {

        console.error(
            "Add item error:",
            error
        );

        res.status(400).json({

            message: "Failed to add item",

            error: error.message

        });

    }
});


// ==========================================
// GET ALL ITEMS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const items =
            await Item.find()
                .populate("owner", "name email")
                .sort({ createdAt: -1 });


        res.status(200).json(items);

    }

    catch (error) {

        console.error(
            "Fetch items error:",
            error
        );

        res.status(500).json({

            message: "Failed to fetch items",

            error: error.message

        });

    }

});


// ==========================================
// GET ITEMS OF ONE USER
// ==========================================

router.get("/user/:userId", async (req, res) => {

    try {

        const { userId } = req.params;


        // ==========================================
        // VALIDATE USER ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(userId)) {

            return res.status(400).json({

                message: "Invalid user ID"

            });

        }


        // ==========================================
        // FIND USER ITEMS
        // ==========================================

        const items =
            await Item.find({
                owner: userId
            })
                .populate("owner", "name email")
                .sort({ createdAt: -1 });


        res.status(200).json(items);

    }

    catch (error) {

        console.error(
            "Fetch user items error:",
            error
        );

        res.status(500).json({

            message: "Failed to fetch user items",

            error: error.message

        });

    }

});


// ==========================================
// DELETE ITEM
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;


        // ==========================================
        // VALIDATE ITEM ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                message: "Invalid item ID"

            });

        }


        // ==========================================
        // DELETE ITEM
        // ==========================================

        const deletedItem =
            await Item.findByIdAndDelete(id);


        if (!deletedItem) {

            return res.status(404).json({

                message: "Item not found"

            });

        }


        res.status(200).json({

            message: "Item deleted successfully",

            item: deletedItem

        });

    }

    catch (error) {

        console.error(
            "Delete item error:",
            error
        );

        res.status(500).json({

            message: "Failed to delete item",

            error: error.message

        });

    }

});


module.exports = router;