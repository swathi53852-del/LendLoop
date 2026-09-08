import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
    Package,
    Search,
    User,
    RefreshCw
} from "lucide-react";

function Items() {

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    const getLoggedInUser = () => {

        const savedUser =
            localStorage.getItem("lendloopUser");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch (error) {
            console.error(
                "Invalid lendloopUser:",
                error
            );

            return null;
        }
    };


    // ==========================================
    // GET USER ID
    // ==========================================

    const getUserId = (user) => {

        if (!user) {
            return "";
        }

        return String(
            user._id ||
            user.id ||
            user.userId ||
            user.user?._id ||
            user.user?.id ||
            user.user?.userId ||
            ""
        ).trim();
    };


    // ==========================================
    // GET OWNER ID
    // ==========================================

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


    // ==========================================
    // FETCH AVAILABLE ITEMS
    // ==========================================

    const fetchItems = async () => {

        try {

            setLoading(true);
            setError("");

            const user =
                getLoggedInUser();

            if (!user) {

                setError(
                    "Please login to view available items."
                );

                setItems([]);

                return;
            }

            const currentUserId =
                getUserId(user);

            console.log(
                "Items page - logged-in user:",
                user
            );

            console.log(
                "Items page - user ID:",
                currentUserId
            );


            const response = await fetch(
                "http://localhost:5000/api/items"
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
                "ALL ITEMS:",
                data
            );


            if (!Array.isArray(data)) {

                throw new Error(
                    "Backend did not return an array."
                );

            }


            // ==========================================
            // SHOW AVAILABLE ITEMS
            // EXCLUDE MY OWN ITEMS
            // ==========================================

            const availableItems =
                data.filter((item) => {

                    const ownerId =
                        getOwnerId(item);

                    const status =
                        String(
                            item.status || "Available"
                        )
                            .trim()
                            .toLowerCase();

                    const isAvailable =
                        status === "available";

                    const isNotMine =
                        ownerId !== currentUserId;


                    console.log(
                        "Available item check:",
                        {
                            name: item.name,
                            ownerId,
                            currentUserId,
                            status,
                            isAvailable,
                            isNotMine
                        }
                    );


                    return (
                        isAvailable &&
                        isNotMine
                    );

                });


            console.log(
                "AVAILABLE ITEMS FOR BORROWING:",
                availableItems
            );


            setItems(availableItems);


        } catch (error) {

            console.error(
                "Fetch available items error:",
                error
            );

            setItems([]);

            setError(
                "Unable to load available items. Make sure the LendLoop server is running."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD PAGE
    // ==========================================

    useEffect(() => {

        fetchItems();

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    const searchText =
        search.toLowerCase().trim();


    const filteredItems =
        items.filter((item) => {

            const name =
                String(
                    item.name || ""
                ).toLowerCase();

            const category =
                String(
                    item.category || ""
                ).toLowerCase();

            const description =
                String(
                    item.description || ""
                ).toLowerCase();

            return (
                name.includes(searchText) ||
                category.includes(searchText) ||
                description.includes(searchText)
            );

        });


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div
            className="my-items-page"
        >

            <Sidebar />


            <main
                className="my-items-content"
            >

                {/* HEADER */}

                <div
                    className="my-items-header"
                >

                    <div>

                        <h1>
                            Available Items
                        </h1>

                        <p>
                            Browse items available
                            to borrow from other users.
                        </p>

                    </div>

                </div>


                {/* SEARCH */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        marginBottom: "25px"
                    }}
                >

                    <Search
                        size={20}
                        color="#94a3b8"
                    />

                    <input
                        type="text"
                        placeholder="Search available items..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        style={{
                            border: "none",
                            outline: "none",
                            width: "100%",
                            fontSize: "15px"
                        }}
                    />

                </div>


                {/* ERROR */}

                {error && (

                    <div
                        style={{
                            padding: "15px",
                            marginBottom: "20px",
                            background: "#fef2f2",
                            color: "#b91c1c",
                            borderRadius: "10px"
                        }}
                    >

                        {error}

                        <button
                            onClick={
                                fetchItems
                            }
                            style={{
                                marginLeft: "15px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer"
                            }}
                        >

                            <RefreshCw
                                size={16}
                            />

                        </button>

                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div
                        className="empty-items"
                    >

                        <RefreshCw
                            size={40}
                        />

                        <h2>
                            Loading available items...
                        </h2>

                    </div>

                ) : filteredItems.length === 0 ? (

                    /* EMPTY */

                    <div
                        className="empty-items"
                    >

                        <div
                            className="empty-icon"
                        >

                            <Package
                                size={42}
                            />

                        </div>

                        <h2>
                            No available items
                        </h2>

                        <p>
                            {search
                                ? "No items match your search."
                                : "There are currently no items available from other users."
                            }
                        </p>

                    </div>

                ) : (

                    /* ITEMS */

                    <div
                        className="items-grid"
                    >

                        {filteredItems.map(
                            (item) => {

                                const owner =
                                    item.owner || {};

                                return (

                                    <div
                                        className="item-card"
                                        key={item._id}
                                    >

                                        {/* IMAGE */}

                                        <div
                                            className="item-image-container"
                                        >

                                            {item.image ? (

                                                <img
                                                    src={item.image}
                                                    alt={
                                                        item.name
                                                    }
                                                    className="item-image"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    className="image-fallback"
                                                    style={{
                                                        display: "flex"
                                                    }}
                                                >

                                                    <div
                                                        className="item-icon"
                                                    >

                                                        <Package
                                                            size={28}
                                                        />

                                                    </div>

                                                </div>

                                            )}

                                        </div>


                                        {/* NAME */}

                                        <h2>
                                            {item.name}
                                        </h2>


                                        {/* CATEGORY */}

                                        {item.category && (

                                            <span
                                                className="item-category"
                                            >
                                                {item.category}
                                            </span>

                                        )}


                                        {/* DESCRIPTION */}

                                        <p
                                            className="item-description"
                                        >

                                            {item.description ||
                                                "No description provided."
                                            }

                                        </p>


                                        {/* CONDITION */}

                                        <p
                                            className="item-condition"
                                        >

                                            <strong>
                                                Condition:
                                            </strong>{" "}

                                            {item.condition ||
                                                "Good"
                                            }

                                        </p>


                                        {/* OWNER */}

                                        <p
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "7px"
                                            }}
                                        >

                                            <User
                                                size={17}
                                            />

                                            <span>
                                                Owned by{" "}
                                                <strong>
                                                    {owner.name ||
                                                        owner.email ||
                                                        "Another user"
                                                    }
                                                </strong>
                                            </span>

                                        </p>


                                        {/* STATUS */}

                                        <div
                                            className="item-status"
                                        >

                                            <span
                                                className="status-dot"
                                            ></span>

                                            Available

                                        </div>


                                        {/* REQUEST BUTTON */}

                                        <button
                                            style={{
                                                width: "100%",
                                                marginTop: "15px",
                                                padding: "11px",
                                                border: "none",
                                                borderRadius: "8px",
                                                background: "#4f46e5",
                                                color: "white",
                                                fontSize: "15px",
                                                fontWeight: "600",
                                                cursor: "pointer"
                                            }}
                                            onClick={() =>
                                                alert(
                                                    "Next step: Borrow request"
                                                )
                                            }
                                        >

                                            Request to Borrow

                                        </button>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </main>

        </div>

    );

}

export default Items;