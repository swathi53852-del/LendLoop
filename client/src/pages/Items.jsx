
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Package, Search, User, RefreshCw } from "lucide-react";

function Items() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [requestingId, setRequestingId] = useState(null);
    const [returnDate, setReturnDate] = useState({});

    // GET LOGGED-IN USER
    const getLoggedInUser = () => {
        const savedUser = localStorage.getItem("lendloopUser");

        if (!savedUser) return null;

        try {
            return JSON.parse(savedUser);
        } catch (error) {
            console.error("Invalid lendloopUser:", error);
            return null;
        }
    };

    // NORMALIZE ID TO STRING
    const normalizeId = (value) => {
        if (value == null) return "";

        if (typeof value === "object") {
            if (value.$oid) return String(value.$oid).trim();
            if (value._id != null) return normalizeId(value._id);
            if (value.id != null) return normalizeId(value.id);
            return "";
        }

        return String(value).trim();
    };

    // GET LOGGED-IN USER ID
    const getUserId = (user) => {
        if (!user) return "";

        return normalizeId(
            user._id ||
            user.id ||
            user.userId ||
            user.user?._id ||
            user.user?.id ||
            user.user?.userId
        );
    };

    // GET ITEM OWNER ID
    const getOwnerId = (item) => {
        if (!item || item.owner == null) return "";

        return normalizeId(item.owner);
    };

    // GET TODAY'S DATE IN LOCAL TIME
    const getTodayDate = () => {
        const today = new Date();

        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");
    };

    // SUBMIT BORROWING REQUEST
    const handleBorrowRequest = async (item) => {
        if (requestingId) return;

        try {
            const user = getLoggedInUser();
            const borrowerId = getUserId(user);
            const ownerId = getOwnerId(item);
            const selectedReturnDate = returnDate[item._id];

            if (!user || !borrowerId) {
                alert("Please login again before requesting an item.");
                return;
            }

            if (!item._id || !ownerId) {
                alert("Item or owner information is missing.");
                return;
            }

            if (borrowerId === ownerId) {
                alert("You cannot borrow your own item.");
                return;
            }

            if (
                selectedReturnDate &&
                selectedReturnDate < getTodayDate()
            ) {
                alert("Return date cannot be in the past.");
                return;
            }

            setRequestingId(item._id);

            const response = await fetch(
                "/api/lending-requests",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        item: item._id,
                        owner: ownerId,
                        borrower: borrowerId,
                        returnDate: selectedReturnDate || null
                    })
                }
            );

            let data;

            try {
                data = await response.json();
            } catch {
                throw new Error("The server returned an invalid response.");
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    `Request failed with status ${response.status}.`
                );
            }

            alert("Borrowing request submitted successfully!");

        } catch (error) {
            console.error("Borrow request error:", error);

            alert(
                error.message ||
                "Unable to submit borrowing request. Please try again."
            );
        } finally {
            setRequestingId(null);
        }
    };

    // FETCH AVAILABLE ITEMS
    const fetchItems = async () => {
        try {
            setLoading(true);
            setError("");

            const user = getLoggedInUser();

            if (!user) {
                setItems([]);
                setError("Please login to view available items.");
                return;
            }

            const currentUserId = getUserId(user);

            if (!currentUserId) {
                setItems([]);
                setError(
                    "Your user ID is missing. Please log out and log in again."
                );
                return;
            }

            console.log("========== ITEMS PAGE DEBUG ==========");
            console.log("Logged-in user:", user);
            console.log("ITEMS PAGE - CURRENT USER ID:", currentUserId);

            const response = await fetch(
                "/api/items"
            );

            console.log("ITEMS PAGE - API STATUS:", response.status);

            if (!response.ok) {
                throw new Error(
                    `Unable to load items. Server returned ${response.status}.`
                );
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Backend did not return an item array.");
            }

            // ITEM DIAGNOSTICS
            console.log("ITEMS PAGE - TOTAL ITEMS:", data.length);
            console.log("ITEMS PAGE - FIRST ITEM:", data[0]);
            console.log(
                "ITEMS PAGE - FIRST OWNER:",
                data[0]?.owner
            );

            // NEW: SHOW ALL ITEM STATUSES AND OWNER IDS IN CONSOLE
            console.table(
                data.map((item) => ({
                    name: item.name,
                    itemId: item._id,
                    status: item.status,
                    availability: item.availability,
                    isAvailable: item.isAvailable,
                    ownerId:
                        typeof item.owner === "object"
                            ? item.owner?._id || item.owner?.id
                            : item.owner,
                    currentUserId
                }))
            );

            // FILTER AVAILABLE ITEMS OWNED BY OTHER USERS
            const availableItems = data.filter((item) => {
                const ownerId = getOwnerId(item);

                const status = String(
                    item.status || "Available"
                ).trim().toLowerCase();

                const isAvailable = status === "available";
                const isNotMine =
                    ownerId !== "" && ownerId !== currentUserId;

                console.log("ITEMS PAGE - ITEM CHECK:", {
                    itemName: item.name,
                    itemId: item._id,
                    owner: item.owner,
                    ownerId,
                    currentUserId,
                    status,
                    isAvailable,
                    isNotMine
                });

                return isAvailable && isNotMine;
            });

            console.log(
                "ITEMS PAGE - AVAILABLE ITEMS FOR BORROWING:",
                availableItems
            );
            console.log(
                "ITEMS PAGE - AVAILABLE ITEM COUNT:",
                availableItems.length
            );
            console.log("======================================");

            setItems(availableItems);

        } catch (error) {
            console.error("Items page fetch error:", error);
            setItems([]);

            setError(
                error.message ||
                "Unable to load available items. Make sure the server is running."
            );
        } finally {
            setLoading(false);
        }
    };

    // LOAD ITEMS WHEN PAGE OPENS
    useEffect(() => {
        fetchItems();
    }, []);

    // SEARCH ITEMS
    const searchText = search.toLowerCase().trim();

    const filteredItems = items.filter((item) => {
        const name = String(item.name || "").toLowerCase();
        const category = String(item.category || "").toLowerCase();
        const description = String(item.description || "").toLowerCase();

        return (
            name.includes(searchText) ||
            category.includes(searchText) ||
            description.includes(searchText)
        );
    });

    // PAGE UI
    return (
        <div className="my-items-page">
            <Sidebar />

            <main className="my-items-content">
                <div className="my-items-header">
                    <div>
                        <h1>Available Items</h1>
                        <p>
                            Browse items available to borrow from other users.
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
                    <Search size={20} color="#94a3b8" />

                    <input
                        type="text"
                        placeholder="Search available items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                        role="alert"
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
                            onClick={fetchItems}
                            disabled={loading}
                            aria-label="Retry loading items"
                            style={{
                                marginLeft: "15px",
                                border: "none",
                                background: "transparent",
                                cursor: loading ? "not-allowed" : "pointer"
                            }}
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>
                )}

                {/* LOADING AND ITEMS */}
                {loading ? (
                    <div className="empty-items">
                        <RefreshCw size={40} />
                        <h2>Loading available items...</h2>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="empty-items">
                        <div className="empty-icon">
                            <Package size={42} />
                        </div>

                        <h2>No available items</h2>

                        <p>
                            {search
                                ? "No items match your search. Try another keyword."
                                : "No items from other users are available right now. Please check again later."}
                        </p>

                        {!error && (
                            <button
                                onClick={fetchItems}
                                style={{
                                    marginTop: "12px",
                                    padding: "10px 16px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background: "#4f46e5",
                                    color: "#ffffff",
                                    cursor: "pointer"
                                }}
                            >
                                <RefreshCw
                                    size={15}
                                    style={{
                                        marginRight: "6px",
                                        verticalAlign: "middle"
                                    }}
                                />
                                Refresh Items
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="items-grid">
                        {filteredItems.map((item) => {
                            const owner =
                                item.owner &&
                                typeof item.owner === "object"
                                    ? item.owner
                                    : {};

                            return (
                                <div className="item-card" key={item._id}>
                                    {/* IMAGE */}
                                    <div className="item-image-container">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name || "Item"}
                                                className="item-image"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="image-fallback"
                                                style={{ display: "flex" }}
                                            >
                                                <div className="item-icon">
                                                    <Package size={28} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <h2>{item.name || "Unnamed item"}</h2>

                                    {item.category && (
                                        <span className="item-category">
                                            {item.category}
                                        </span>
                                    )}

                                    <p className="item-description">
                                        {item.description ||
                                            "No description provided."}
                                    </p>

                                    <p className="item-condition">
                                        <strong>Condition:</strong>{" "}
                                        {item.condition || "Good"}
                                    </p>

                                    <p
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "7px"
                                        }}
                                    >
                                        <User size={17} />

                                        <span>
                                            Owned by{" "}
                                            <strong>
                                                {owner.name ||
                                                    owner.email ||
                                                    "Another user"}
                                            </strong>
                                        </span>
                                    </p>

                                    <div className="item-status">
                                        <span className="status-dot"></span>
                                        Available
                                    </div>

                                    {/* RETURN DATE */}
                                    <label
                                        htmlFor={`return-date-${item._id}`}
                                        style={{
                                            display: "block",
                                            marginTop: "12px"
                                        }}
                                    >
                                        Preferred return date (optional)
                                    </label>

                                    <input
                                        id={`return-date-${item._id}`}
                                        type="date"
                                        min={getTodayDate()}
                                        value={returnDate[item._id] || ""}
                                        onChange={(e) =>
                                            setReturnDate((previous) => ({
                                                ...previous,
                                                [item._id]: e.target.value
                                            }))
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "9px",
                                            marginTop: "6px",
                                            boxSizing: "border-box"
                                        }}
                                    />

                                    {/* BORROW REQUEST */}
                                    <button
                                        onClick={() =>
                                            handleBorrowRequest(item)
                                        }
                                        disabled={requestingId !== null}
                                        style={{
                                            width: "100%",
                                            marginTop: "15px",
                                            padding: "11px",
                                            border: "none",
                                            borderRadius: "8px",
                                            background:
                                                requestingId === item._id
                                                    ? "#a5b4fc"
                                                    : "#4f46e5",
                                            color: "white",
                                            fontSize: "15px",
                                            fontWeight: "600",
                                            cursor:
                                                requestingId !== null
                                                    ? "not-allowed"
                                                    : "pointer"
                                        }}
                                    >
                                        {requestingId === item._id
                                            ? "Submitting..."
                                            : "Request to Borrow"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Items;