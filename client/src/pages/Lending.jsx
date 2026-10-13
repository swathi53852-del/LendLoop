
import {
  Package,
  Search,
  User,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Lending.css";

function Lending() {
  const [search, setSearch] = useState("");
  const [lentItems, setLentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET LOGGED-IN USER
  const getLoggedInUser = () => {
    try {
      const savedUser = localStorage.getItem("lendloopUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error("Invalid lendloopUser:", err);
      return null;
    }
  };

  // NORMALIZE MONGODB / USER IDS
  const getId = (value) => {
    if (value == null) return "";

    if (typeof value === "string" || typeof value === "number") {
      return String(value).trim();
    }

    if (typeof value === "object") {
      if (value.$oid) return String(value.$oid).trim();
      if (value._id != null) return getId(value._id);
      if (value.id != null) return getId(value.id);
    }

    return "";
  };

  // GET LOGGED-IN USER ID
  const getUserId = (user) => {
    if (!user) return "";

    return (
      getId(user._id) ||
      getId(user.id) ||
      getId(user.userId) ||
      getId(user.user?._id) ||
      getId(user.user?.id) ||
      getId(user.user?.userId)
    );
  };

  // GET OWNER ID
  // Supports populated owner objects and unpopulated MongoDB IDs.
  const getOwnerId = (request) => {
    const candidates = [
      request.item?.owner,
      request.item?.ownerId,
      request.item?.user,
      request.item?.userId,
      request.owner,
      request.ownerId,
      request.lender,
      request.lenderId,
    ];

    for (const candidate of candidates) {
      const id = getId(candidate);
      if (id) return id;
    }

    return "";
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

  // FETCH LENDING REQUESTS
  const fetchLendingRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const user = getLoggedInUser();

      if (!user) {
        setLentItems([]);
        setError("Please login to view your lending items.");
        return;
      }

      const userId = getUserId(user);

      if (!userId) {
        setLentItems([]);
        setError(
          "User ID is missing. Please logout and login again."
        );
        return;
      }

      console.log("========== LENDING PAGE ==========");
      console.log("Logged-in user:", user);
      console.log("Logged-in user ID:", userId);

      const response = await fetch(
        `/api/lending-requests/user/${encodeURIComponent(
          userId
        )}`
      );

      console.log("Lending API status:", response.status);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const requests = await response.json();

      if (!Array.isArray(requests)) {
        throw new Error("Backend did not return an array.");
      }

      console.log("All requests:", requests);

      // SHOW ONLY APPROVED REQUESTS FOR ITEMS OWNED BY THIS USER.
      // Do not remove this owner check: it protects account separation.
      const activeLending = requests.filter((request) => {
        const ownerId = getOwnerId(request);

        const status = String(request.status || "")
          .trim()
          .toLowerCase();

        const isOwner = ownerId === userId;
        const isApproved = status === "approved";

        console.log("Lending check:", {
          requestId: request._id,
          item: request.item?.name,
          itemOwner: request.item?.owner,
          requestOwner: request.owner,
          ownerId,
          currentUserId: userId,
          status,
          isOwner,
          isApproved,
        });

        return isOwner && isApproved;
      });

      console.log("ACTIVE LENDING:", activeLending);

      setLentItems(activeLending);
    } catch (err) {
      console.error("Lending fetch error:", err);
      setLentItems([]);
      setError(
        "Unable to load lending information. Please make sure the LendLoop server is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // LOAD DATA
  useEffect(() => {
    fetchLendingRequests();
  }, [fetchLendingRequests]);

  // SEARCH
  const searchText = search.toLowerCase().trim();

  const filteredItems = lentItems.filter((request) => {
    const itemName = String(
      request.item?.name || ""
    ).toLowerCase();

    const borrowerName = String(
      request.borrower?.name || ""
    ).toLowerCase();

    const borrowerEmail = String(
      request.borrower?.email || ""
    ).toLowerCase();

    return (
      itemName.includes(searchText) ||
      borrowerName.includes(searchText) ||
      borrowerEmail.includes(searchText)
    );
  });

  // PAGE UI
  return (
    <div className="lending-page">
      <Sidebar />

      <main className="lending-main">
        <div className="lending-header">
          <h1>Lending</h1>
          <p>Track the items you have lent to others.</p>
        </div>

        {/* SEARCH */}
        <div className="lending-search">
          <Search size={21} color="#94a3b8" />

          <input
            type="text"
            placeholder="Search by item or borrower..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="lending-error" role="alert">
            <span>{error}</span>

            <button
              onClick={fetchLendingRequests}
              disabled={loading}
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="lending-empty">
            <div className="empty-icon">
              <RefreshCw
                size={38}
                className="loading-icon"
              />
            </div>

            <h2>Loading lending information...</h2>
            <p>Please wait.</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="lending-empty">
            <div className="empty-icon">
              <Package
                size={40}
                color="#4f46e5"
                strokeWidth={1.8}
              />
            </div>

            <h2>No lent items</h2>

            <p>
              {search
                ? "No lent items match your search."
                : "You don't have any approved items currently lent to others."}
            </p>

            {!search && (
              <span className="active-count">
                Active lending items: {lentItems.length}
              </span>
            )}
          </div>
        )}

        {/* LENDING CARDS */}
        {!loading && filteredItems.length > 0 && (
          <div className="lending-grid">
            {filteredItems.map((request) => {
              const item =
                request.item && typeof request.item === "object"
                  ? request.item
                  : {};

              const borrower =
                request.borrower &&
                typeof request.borrower === "object"
                  ? request.borrower
                  : {};

              return (
                <div
                  className="lending-card"
                  key={request._id}
                >
                  {/* IMAGE */}
                  <div className="lending-image-wrapper">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name || "Item"}
                        className="lending-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement.classList.add(
                            "image-fallback"
                          );
                        }}
                      />
                    ) : (
                      <div className="image-fallback">
                        <Package
                          size={42}
                          color="#4f46e5"
                        />
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="lending-card-content">
                    <h3>{item.name || "Unknown Item"}</h3>

                    <span className="lent-badge">
                      ● Currently Lent
                    </span>

                    {item.description && (
                      <p className="item-description">
                        {item.description}
                      </p>
                    )}

                    {item.category && (
                      <span className="category-badge">
                        {item.category}
                      </span>
                    )}

                    {/* BORROWER */}
                    <div className="info-row">
                      <User size={17} />

                      <span>
                        Borrowed by{" "}
                        <strong>
                          {borrower.name ||
                            borrower.email ||
                            "Unknown user"}
                        </strong>
                      </span>
                    </div>

                    {/* BORROWED DATE */}
                    <div className="info-row">
                      <CalendarDays size={17} />

                      <span>
                        Borrowed:{" "}
                        {formatDate(request.borrowedDate)}
                      </span>
                    </div>

                    {/* RETURN DATE */}
                    <div className="info-row">
                      <CalendarDays size={17} />

                      <span>
                        Return date:{" "}
                        {formatDate(request.returnDate)}
                      </span>
                    </div>

                    {/* STATUS */}
                    <div className="status-row">
                      <span className="approved-text">
                        ✓ Approved
                      </span>

                      <span className="active-badge">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Lending;