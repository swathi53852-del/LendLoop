import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./MyItems.css";

import {
    Plus,
    Package,
    Trash2,
    X
} from "lucide-react";

function MyItems() {

    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        condition: "Good"
    });


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const getLoggedInUser = () => {

        const savedUser =
            localStorage.getItem("lendloopUser");

        if (!savedUser) {
            console.log("No lendloopUser found");
            return null;
        }

        try {

            const user = JSON.parse(savedUser);

            console.log("Logged-in user:", user);

            return user;

        } catch (error) {

            console.error(
                "Invalid lendloopUser:",
                error
            );

            return null;
        }
    };


    // =====================================================
    // GET USER ID
    // Handles _id, id, userId and nested user
    // =====================================================

    const getUserId = (user) => {

        if (!user) {
            return "";
        }

        const id =
            user._id ||
            user.id ||
            user.userId ||
            user.user?._id ||
            user.user?.id ||
            user.user?.userId ||
            "";

        return String(id).trim();
    };


    // =====================================================
    // GET OWNER ID FROM ITEM
    // Handles owner as string OR object
    // =====================================================

    const getOwnerId = (item) => {

        if (!item || !item.owner) {
            return "";
        }

        if (typeof item.owner === "string") {
            return item.owner.trim();
        }

        return String(
            item.owner._id ||
            item.owner.id ||
            item.owner.userId ||
            ""
        ).trim();
    };


    // =====================================================
    // FETCH MY ITEMS
    // =====================================================

    const fetchItems = async () => {

        try {

            setLoading(true);

            const user = getLoggedInUser();

            if (!user) {

                console.log(
                    "No logged-in user."
                );

                setItems([]);

                return;
            }


            const currentUserId =
                getUserId(user);


            console.log(
                "Current user ID:",
                currentUserId
            );


            if (!currentUserId) {

                console.error(
                    "User ID is missing."
                );

                setItems([]);

                return;
            }


            // =============================================
            // GET ALL ITEMS FROM SERVER
            // =============================================

            const response = await fetch(
                "/api/items"
            );


            console.log(
                "Items API status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "ALL ITEMS FROM SERVER:",
                data
            );


            if (!Array.isArray(data)) {

                throw new Error(
                    "Backend did not return an array."
                );

            }


            // =============================================
            // FILTER ONLY CURRENT USER'S ITEMS
            // =============================================

            const myItems =
                data.filter((item) => {

                    const ownerId =
                        getOwnerId(item);


                    const isMine =
                        ownerId === currentUserId;


                    console.log(
                        "Item check:",
                        {
                            itemName: item.name,
                            ownerId: ownerId,
                            currentUserId:
                                currentUserId,
                            isMine: isMine
                        }
                    );


                    return isMine;

                });


            console.log(
                "MY ITEMS:",
                myItems
            );


            setItems(myItems);


        } catch (error) {

            console.error(
                "Error fetching items:",
                error
            );

            setItems([]);

            alert(
                "Unable to load items. Make sure the LendLoop server is running."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD ITEMS WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        fetchItems();

    }, []);


    // =====================================================
    // HANDLE FORM INPUT
    // =====================================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });

    };


    // =====================================================
    // ADD ITEM
    // =====================================================

    const handleAddItem = async (e) => {

        e.preventDefault();


        const user =
            getLoggedInUser();


        if (!user) {

            alert(
                "Please login before adding an item."
            );

            return;
        }


        const currentUserId =
            getUserId(user);


        console.log(
            "Adding item for user:",
            currentUserId
        );


        if (!currentUserId) {

            alert(
                "User ID is missing. Please logout and login again."
            );

            return;
        }


        if (!formData.name.trim()) {

            alert(
                "Please enter an item name."
            );

            return;
        }


        if (!formData.description.trim()) {

            alert(
                "Please enter a description."
            );

            return;
        }


        try {

            setAdding(true);


            const response =
                await fetch(
                    "/api/items",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name:
                                formData.name.trim(),

                            category:
                                formData.category ||
                                "Other",

                            description:
                                formData.description.trim(),

                            condition:
                                formData.condition,

                            // IMPORTANT
                            // Save the actual logged-in user's ID
                            owner:
                                currentUserId

                        })
                    }
                );


            const data =
                await response.json();


            console.log(
                "ADD ITEM RESPONSE:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to add item"
                );

            }


            // =============================================
            // ADD NEW ITEM TO SCREEN
            // =============================================

            setItems((previousItems) => [

                data,

                ...previousItems

            ]);


            // =============================================
            // CLEAR FORM
            // =============================================

            setFormData({

                name: "",

                category: "",

                description: "",

                condition: "Good"

            });


            setShowForm(false);


            alert(
                "Item added successfully!"
            );


        } catch (error) {

            console.error(
                "Error adding item:",
                error
            );

            alert(
                error.message ||
                "Unable to add item."
            );


        } finally {

            setAdding(false);

        }

    };


    // =====================================================
    // DELETE ITEM
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this item?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response =
                await fetch(
                    `/api/items/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete item"
                );

            }


            setItems(
                (previousItems) =>
                    previousItems.filter(
                        (item) =>
                            item._id !== id
                    )
            );


        } catch (error) {

            console.error(
                "Error deleting item:",
                error
            );

            alert(
                "Unable to delete item."
            );

        }

    };


    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = (e) => {

        e.currentTarget.style.display =
            "none";


        const fallback =
            e.currentTarget.parentElement
                .querySelector(
                    ".image-fallback"
                );


        if (fallback) {

            fallback.style.display =
                "flex";

        }

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="my-items-page">

            <Sidebar />


            <main className="my-items-content">


                {/* HEADER */}

                <div className="my-items-header">

                    <div>

                        <h1>
                            My Items
                        </h1>

                        <p>
                            Manage the items you own
                            and make available for lending.
                        </p>

                    </div>


                    <button
                        className="add-item-button"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >

                        <Plus size={20} />

                        Add Item

                    </button>

                </div>


                {/* ADD ITEM FORM */}

                {showForm && (

                    <div className="item-form-container">

                        <div className="item-form-header">

                            <div>

                                <h2>
                                    Add New Item
                                </h2>

                                <p>
                                    Add an item that you own.
                                </p>

                            </div>


                            <button
                                className="close-button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >

                                <X size={22} />

                            </button>

                        </div>


                        <form
                            onSubmit={handleAddItem}
                        >


                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Item Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Laptop"
                                    disabled={adding}
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={adding}
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    <option value="Electronics">
                                        Electronics
                                    </option>

                                    <option value="Books">
                                        Books
                                    </option>

                                    <option value="Furniture">
                                        Furniture
                                    </option>

                                    <option value="Sports">
                                        Sports
                                    </option>

                                    <option value="Tools">
                                        Tools
                                    </option>

                                    <option value="Clothing">
                                        Clothing
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Describe your item..."
                                    rows="4"
                                    disabled={adding}
                                />

                            </div>


                            {/* CONDITION */}

                            <div className="form-group">

                                <label>
                                    Condition
                                </label>

                                <select
                                    name="condition"
                                    value={
                                        formData.condition
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={adding}
                                >

                                    <option value="New">
                                        New
                                    </option>

                                    <option value="Like New">
                                        Like New
                                    </option>

                                    <option value="Good">
                                        Good
                                    </option>

                                    <option value="Fair">
                                        Fair
                                    </option>

                                </select>

                            </div>


                            {/* BUTTONS */}

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                    disabled={adding}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={adding}
                                >

                                    {adding
                                        ? "Adding..."
                                        : "Add Item"}

                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div className="empty-items">

                        <h2>
                            Loading items...
                        </h2>

                    </div>

                ) : items.length === 0 ? (

                    /* EMPTY */

                    <div className="empty-items">

                        <div className="empty-icon">

                            <Package size={42} />

                        </div>

                        <h2>
                            No items yet
                        </h2>

                        <p>
                            Add your first item
                            to start lending.
                        </p>

                        <button
                            className="empty-add-button"
                            onClick={() =>
                                setShowForm(true)
                            }
                        >

                            <Plus size={19} />

                            Add Your First Item

                        </button>

                    </div>

                ) : (

                    /* ITEMS */

                    <div className="items-grid">

                        {items.map((item) => (

                            <div
                                className="item-card"
                                key={item._id}
                            >


                                {/* IMAGE */}

                                <div className="item-image-container">

                                    {item.image ? (

                                        <img
                                            src={item.image}
                                            alt={
                                                item.name
                                            }
                                            className="item-image"
                                            onError={
                                                handleImageError
                                            }
                                        />

                                    ) : null}


                                    <div
                                        className="image-fallback"
                                        style={{
                                            display:
                                                item.image
                                                    ? "none"
                                                    : "flex"
                                        }}
                                    >

                                        <div className="item-icon">

                                            <Package
                                                size={28}
                                            />

                                        </div>

                                    </div>


                                    {/* DELETE */}

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(
                                                item._id
                                            )
                                        }
                                    >

                                        <Trash2
                                            size={19}
                                        />

                                    </button>

                                </div>


                                {/* DETAILS */}

                                <h2>
                                    {item.name}
                                </h2>


                                <span className="item-category">

                                    {item.category}

                                </span>


                                <p className="item-description">

                                    {item.description ||
                                        "No description provided."}

                                </p>


                                <p className="item-condition">

                                    <strong>
                                        Condition:
                                    </strong>{" "}

                                    {item.condition}

                                </p>


                                <div className="item-status">

                                    <span className="status-dot"></span>

                                    {item.status ||
                                        "Available"}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>

    );

}

export default MyItems;