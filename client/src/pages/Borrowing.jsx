
import {
  Package,
  Search,
  User,
  CalendarDays,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Borrowing() {
  const [search, setSearch] = useState("");
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState(null);

  // GET LOGGED-IN USER
  const getLoggedInUser = () => {
    try {
      const savedUser = localStorage.getItem("lendloopUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Invalid lendloopUser:", error);
      return null;
    }
  };

  // NORMALIZE IDS
  const getId = (value) => {
    if (value == null) return "";

    if (typeof value === "object") {
      if (value.$oid) return String(value.$oid).trim();
      if (value._id != null) return getId(value._id);
      if (value.id != null) return getId(value.id);
      return "";
    }

    return String(value).trim();
  };

  // GET CURRENT USER ID
  const getUserId = (user) => {
    if (!user) return "";

    return getId(
      user._id ||
      user.id ||
      user.userId ||
      user.user?._id ||
      user.user?.id ||
      user.user?.userId
    );
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // FETCH BORROWING REQUESTS
  const fetchBorrowingRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getLoggedInUser();
      const userId = getUserId(user);

      if (!user || !userId) {
        setBorrowedItems([]);
        setError("Please log in again to view your borrowed items.");
        return;
      }

      console.log("BORROWING PAGE - CURRENT USER:", userId);

      const response = await fetch(
        `/api/lending-requests/user/${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}.`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server did not return a list of requests.");
      }

      console.log("BORROWING PAGE - REQUEST COUNT:", data.length);

      // Only show requests where the logged-in user is the borrower.
      // Show approved and returned borrowing history.
      const myBorrowing = data.filter((request) => {
        const borrowerId = getId(request.borrower);
        const status = String(request.status || "")
          .trim()
          .toLowerCase();

        const isBorrower = borrowerId === userId;
        const isValidStatus =
          status === "approved" ||
          status === "accepted" ||
          status === "returned";

        console.log("BORROWING REQUEST CHECK:", {
          item: request.item?.name || "Unknown item",
          borrowerId,
          currentUserId: userId,
          ownerId: getId(request.owner),
          status,
          isBorrower,
          isValidStatus,
        });

        return isBorrower && isValidStatus;
      });

      console.log("BORROWING PAGE - MATCHED ITEMS:", myBorrowing);

      setBorrowedItems(myBorrowing);
    } catch (error) {
      console.error("Borrowing page error:", error);
      setBorrowedItems([]);
      setError(
        error.message ||
        "Unable to load borrowing information. Please check that the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // RETURN ITEM
  const handleReturn = async (requestId) => {
    try {
      setReturningId(requestId);
      setError("");

      const response = await fetch(
        `/api/lending-requests/${requestId}/return`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to return item.");
      }

      alert("Item returned successfully!");
      await fetchBorrowingRequests();
    } catch (error) {
      console.error("Return item error:", error);
      alert(error.message || "Unable to return item.");
    } finally {
      setReturningId(null);
    }
  };

  // LOAD DATA
  useEffect(() => {
    fetchBorrowingRequests();
  }, []);

  // SEARCH
  const searchText = search.toLowerCase().trim();

  const filteredItems = borrowedItems.filter((request) => {
    const itemName = String(request.item?.name || "").toLowerCase();
    const ownerName = String(request.owner?.name || "").toLowerCase();
    const ownerEmail = String(request.owner?.email || "").toLowerCase();

    return (
      itemName.includes(searchText) ||
      ownerName.includes(searchText) ||
      ownerEmail.includes(searchText)
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <Sidebar />

      <main
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
          padding: "40px 50px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            Borrowing
          </h1>

          <p style={{ marginTop: "9px", color: "#64748b", fontSize: "16px" }}>
            Track the items you have borrowed from others.
          </p>
        </div>

        {/* SEARCH */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            marginBottom: "25px",
          }}
        >
          <Search size={20} color="#94a3b8" />

          <input
            type="text"
            placeholder="Search borrowed items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              padding: "0 12px",
              fontSize: "15px",
              background: "transparent",
            }}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              color: "#c2410c",
              padding: "15px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
            }}
          >
            <span>{error}</span>

            <button
              onClick={fetchBorrowingRequests}
              disabled={loading}
              style={{
                border: "none",
                background: "#ea580c",
                color: "#fff",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              minHeight: "350px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div>
              <RefreshCw
                size={40}
                color="#4f46e5"
                style={{ marginBottom: "12px" }}
              />
              <h2>Loading borrowing information...</h2>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          /* EMPTY STATE */
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              minHeight: "350px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "25px",
              boxSizing: "border-box",
            }}
          >
            <div>
              <div
                style={{
                  width: "76px",
                  height: "76px",
                  borderRadius: "50%",
                  background: "#eef2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Package size={38} color="#4f46e5" />
              </div>

              <h2 style={{ margin: 0, color: "#111827", fontSize: "26px" }}>
                No borrowed items
              </h2>

              <p style={{ marginTop: "10px", color: "#64748b" }}>
                {search
                  ? "No borrowed items match your search."
                  : "You have no approved borrowing requests yet."}
              </p>

              {!search && (
                <button
                  onClick={fetchBorrowingRequests}
                  style={{
                    marginTop: "10px",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#4f46e5",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw
                    size={15}
                    style={{ marginRight: "6px", verticalAlign: "middle" }}
                  />
                  Refresh
                </button>
              )}
            </div>
          </div>
        ) : (
          /* BORROWED ITEMS */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredItems.map((request) => {
              const status = String(request.status || "")
                .trim()
                .toLowerCase();

              const isReturned = status === "returned";

              return (
                <div
                  key={request._id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "22px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "12px",
                        background: "#eef2ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Package size={27} color="#4f46e5" />
                    </div>

                    <div>
                      <h3 style={{ margin: 0, fontSize: "19px", color: "#111827" }}>
                        {request.item?.name || "Unknown Item"}
                      </h3>

                      <span
                        style={{
                          fontSize: "13px",
                          color: isReturned ? "#64748b" : "#16a34a",
                          fontWeight: "600",
                        }}
                      >
                        {isReturned ? "Returned" : "Borrowed"}
                      </span>
                    </div>
                  </div>

                  {request.item?.description && (
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        marginBottom: "18px",
                      }}
                    >
                      {request.item.description}
                    </p>
                  )}

                  {request.item?.category && (
                    <div
                      style={{
                        display: "inline-block",
                        background: "#f1f5f9",
                        color: "#475569",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        marginBottom: "18px",
                      }}
                    >
                      {request.item.category}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      color: "#64748b",
                    }}
                  >
                    <User size={17} />
                    <span>
                      Owner:{" "}
                      <strong style={{ color: "#334155" }}>
                        {request.owner?.name ||
                          request.owner?.email ||
                          "Unknown owner"}
                      </strong>
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      color: "#64748b",
                    }}
                  >
                    <CalendarDays size={17} />
                    <span>Borrowed: {formatDate(request.borrowedDate)}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#64748b",
                    }}
                  >
                    <CalendarDays size={17} />
                    <span>Return date: {formatDate(request.returnDate)}</span>
                  </div>

                  <div
                    style={{
                      marginTop: "18px",
                      paddingTop: "15px",
                      borderTop: "1px solid #e5e7eb",
                      color: isReturned ? "#64748b" : "#16a34a",
                      fontWeight: "600",
                    }}
                  >
                    {isReturned ? "✓ Returned" : "✓ Approved"}
                  </div>

                  {!isReturned && (
                    <button
                      onClick={() => handleReturn(request._id)}
                      disabled={returningId === request._id}
                      style={{
                        width: "100%",
                        marginTop: "15px",
                        padding: "11px 15px",
                        border: "none",
                        borderRadius: "9px",
                        background:
                          returningId === request._id ? "#94a3b8" : "#4f46e5",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor:
                          returningId === request._id ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                      }}
                    >
                      <RotateCcw size={17} />
                      {returningId === request._id
                        ? "Returning..."
                        : "Return Item"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Borrowing;