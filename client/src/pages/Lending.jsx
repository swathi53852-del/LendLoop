import {
  Package,
  Search,
  User,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Lending.css";

function Lending() {
  const [search, setSearch] = useState("");
  const [lentItems, setLentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const getLoggedInUser = () => {
    const savedUser = localStorage.getItem("lendloopUser");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid lendloopUser:", error);
      return null;
    }
  };

  // =====================================================
  // GET USER ID
  // =====================================================

  const getUserId = (user) => {
    if (!user) return "";

    return String(
      user._id ||
        user.id ||
        user.userId ||
        user.user?._id ||
        user.user?.id ||
        ""
    ).trim();
  };

  // =====================================================
  // GET ID
  // =====================================================

  const getId = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value.trim();
    }

    return String(value._id || value.id || "").trim();
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

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

  // =====================================================
  // FETCH LENDING REQUESTS
  // =====================================================

  const fetchLendingRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getLoggedInUser();

      console.log("================================");
      console.log("LENDING PAGE");
      console.log("Logged-in user:", user);
      console.log("================================");

      if (!user) {
        setLentItems([]);
        setError("Please login to view your lending items.");
        return;
      }

      const userId = getUserId(user);

      console.log("Logged-in user ID:", userId);

      if (!userId) {
        setLentItems([]);
        setError(
          "User ID is missing. Please logout and login again."
        );
        return;
      }

      // =================================================
      // GET REQUESTS INVOLVING THIS USER
      // =================================================

      const response = await fetch(
        `http://localhost:5000/api/lending-requests/user/${userId}`
      );

      console.log("Lending API status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Lending API error:", errorText);

        throw new Error(`Server returned ${response.status}`);
      }

      const requests = await response.json();

      console.log("All requests:", requests);

      if (!Array.isArray(requests)) {
        throw new Error("Backend did not return an array.");
      }

      // =================================================
      // FILTER OWNER + APPROVED
      // =================================================

      const activeLending = requests.filter((request) => {
        const ownerId = getId(request.owner);

        const status = String(request.status || "")
          .trim()
          .toLowerCase();

        const currentUserId = String(userId).trim();

        const isOwner = ownerId === currentUserId;

        const isApproved = status === "approved";

        console.log("Lending check:", {
          requestId: request._id,
          item: request.item?.name,
          ownerId,
          currentUserId,
          status,
          isOwner,
          isApproved,
        });

        return isOwner && isApproved;
      });

      console.log("ACTIVE LENDING:", activeLending);

      setLentItems(activeLending);
    } catch (error) {
      console.error("Lending fetch error:", error);

      setLentItems([]);

      setError(
        "Unable to load lending information. Please make sure the LendLoop server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchLendingRequests();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

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

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="lending-page">

      <Sidebar />

      <main className="lending-main">

        {/* HEADER */}

        <div className="lending-header">
          <h1>Lending</h1>

          <p>
            Track the items you have lent to others.
          </p>
        </div>

        {/* SEARCH */}

        <div className="lending-search">

          <Search
            size={21}
            color="#94a3b8"
          />

          <input
            type="text"
            placeholder="Search by item or borrower..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* ERROR */}

        {error && (
          <div className="lending-error">

            <span>{error}</span>

            <button onClick={fetchLendingRequests}>

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

            <h2>
              Loading lending information...
            </h2>

            <p>
              Please wait.
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading && filteredItems.length === 0 && (
          <div className="lending-empty">

            <div className="empty-icon">

              <Package
                size={40}
                color="#4f46e5"
                strokeWidth={1.8}
              />

            </div>

            <h2>
              No lent items
            </h2>

            <p>
              {search
                ? "No lent items match your search."
                : "You don't have any items currently lent to others."}
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

              const item = request.item || {};
              const borrower = request.borrower || {};

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

                    <h3>
                      {item.name || "Unknown Item"}
                    </h3>

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
                        {formatDate(
                          request.borrowedDate
                        )}
                      </span>

                    </div>

                    {/* RETURN DATE */}

                    <div className="info-row">

                      <CalendarDays size={17} />

                      <span>
                        Return date:{" "}
                        {formatDate(
                          request.returnDate
                        )}
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