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

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const getLoggedInUser = () => {
    const savedUser = localStorage.getItem("lendloopUser");

    if (!savedUser) {
      console.log("No lendloopUser found.");
      return null;
    }

    try {
      const user = JSON.parse(savedUser);

      console.log("Logged-in user:", user);

      return user;
    } catch (error) {
      console.error("Invalid lendloopUser:", error);

      return null;
    }
  };

  // =====================================================
  // GET USER ID
  // Supports:
  // id
  // _id
  // userId
  // =====================================================

  const getUserId = (user) => {
    if (!user) {
      return "";
    }

    return String(
      user.id ||
        user._id ||
        user.userId ||
        ""
    ).trim();
  };

  // =====================================================
  // GET ID
  // Supports string or object
  // =====================================================

  const getId = (value) => {
    if (!value) {
      return "";
    }

    if (typeof value === "string") {
      return String(value).trim();
    }

    return String(
      value._id ||
        value.id ||
        ""
    ).trim();
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
  // FETCH BORROWING REQUESTS
  // =====================================================

  const fetchBorrowingRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getLoggedInUser();

      // -------------------------------------------------
      // USER NOT LOGGED IN
      // -------------------------------------------------

      if (!user) {
        setBorrowedItems([]);

        setError(
          "Please login to view your borrowed items."
        );

        return;
      }

      // -------------------------------------------------
      // GET USER ID
      // -------------------------------------------------

      const userId = getUserId(user);

      if (!userId) {
        setBorrowedItems([]);

        setError(
          "User information is missing. Please login again."
        );

        return;
      }

      console.log("====================================");
      console.log("BORROWING PAGE");
      console.log("Logged-in user:", user);
      console.log("Current user ID:", userId);
      console.log("====================================");

      // -------------------------------------------------
      // API REQUEST
      // -------------------------------------------------

      const response = await fetch(
        `http://localhost:5000/api/lending-requests/user/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Requests for current user:",
        data
      );

      // -------------------------------------------------
      // VALIDATE RESPONSE
      // -------------------------------------------------

      if (!Array.isArray(data)) {
        throw new Error(
          "Backend did not return an array."
        );
      }

      // =================================================
      // FIND USER'S BORROWING REQUESTS
      //
      // Current user must be the BORROWER.
      //
      // Show:
      // Approved
      // Returned
      //
      // Do NOT show:
      // Pending
      // Declined
      // =================================================

      const myBorrowing = data.filter(
        (request) => {
          const borrowerId = getId(
            request.borrower
          );

          const status = String(
            request.status || ""
          )
            .trim()
            .toLowerCase();

          const isBorrower =
            borrowerId === userId;

          const isValidStatus =
            status === "approved" ||
            status === "returned";

          console.log(
            "Checking borrowing request:",
            {
              requestId: request._id,

              item:
                request.item?.name ||
                "Unknown",

              borrowerId,

              currentUserId:
                userId,

              status,

              isBorrower,

              isValidStatus,
            }
          );

          return (
            isBorrower &&
            isValidStatus
          );
        }
      );

      console.log(
        "MY BORROWING ITEMS:",
        myBorrowing
      );

      setBorrowedItems(
        myBorrowing
      );

    } catch (error) {
      console.error(
        "Borrowing error:",
        error
      );

      setBorrowedItems([]);

      setError(
        "Unable to load borrowing information. Please make sure the LendLoop server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RETURN ITEM
  // =====================================================

  const handleReturn = async (requestId) => {
    try {
      setReturningId(requestId);
      setError("");

      console.log(
        "Returning request:",
        requestId
      );

      const response = await fetch(
        `http://localhost:5000/api/lending-requests/${requestId}/return`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "Return response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to return item."
        );
      }

      alert(
        "Item returned successfully!"
      );

      // -------------------------------------------------
      // Reload borrowing data
      // -------------------------------------------------

      await fetchBorrowingRequests();

    } catch (error) {
      console.error(
        "Return item error:",
        error
      );

      alert(
        error.message ||
          "Unable to return item."
      );
    } finally {
      setReturningId(null);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchBorrowingRequests();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const searchText =
    search.toLowerCase().trim();

  const filteredItems =
    borrowedItems.filter(
      (request) => {
        const itemName = String(
          request.item?.name || ""
        ).toLowerCase();

        const ownerName = String(
          request.owner?.name || ""
        ).toLowerCase();

        const ownerEmail = String(
          request.owner?.email || ""
        ).toLowerCase();

        return (
          itemName.includes(searchText) ||
          ownerName.includes(searchText) ||
          ownerEmail.includes(searchText)
        );
      }
    );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
          padding: "40px 50px",
          boxSizing: "border-box",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >

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

          <p
            style={{
              marginTop: "9px",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Track the items you have borrowed
            from others.
          </p>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            marginBottom: "25px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >

          <Search
            size={20}
            color="#94a3b8"
          />

          <input
            type="text"
            placeholder="Search borrowed items..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              padding: "0 12px",
              fontSize: "15px",
              color: "#111827",
              background: "transparent",
            }}
          />

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            style={{
              background: "#fff7ed",
              border:
                "1px solid #fed7aa",
              color: "#c2410c",
              padding: "15px 18px",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: "15px",
            }}
          >

            <span>
              {error}
            </span>

            <button
              onClick={
                fetchBorrowingRequests
              }
              style={{
                border: "none",
                background: "#ea580c",
                color: "#ffffff",
                padding:
                  "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems:
                  "center",
                gap: "6px",
              }}
            >

              <RefreshCw size={15} />

              Retry

            </button>

          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius: "16px",
              minHeight: "430px",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              textAlign: "center",
              boxShadow:
                "0 4px 14px rgba(0,0,0,0.03)",
            }}
          >

            <div>

              <Package
                size={48}
                color="#4f46e5"
                style={{
                  marginBottom: "12px",
                }}
              />

              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                }}
              >
                Loading borrowing information...
              </h2>

              <p
                style={{
                  color: "#64748b",
                  marginTop: "8px",
                }}
              >
                Please wait.
              </p>

            </div>

          </div>

        ) : filteredItems.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius: "16px",
              minHeight: "430px",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              textAlign: "center",
              boxShadow:
                "0 4px 14px rgba(0,0,0,0.03)",
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
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  margin:
                    "0 auto 20px",
                }}
              >

                <Package
                  size={38}
                  color="#4f46e5"
                  strokeWidth={1.8}
                />

              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                No borrowed items
              </h2>

              <p
                style={{
                  marginTop: "10px",
                  color: "#64748b",
                  fontSize: "16px",
                }}
              >
                {search
                  ? "No borrowed items match your search."
                  : "You haven't borrowed any approved items yet."}
              </p>

              {!search && (
                <p
                  style={{
                    marginTop: "8px",
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  Borrowing history:{" "}
                  {borrowedItems.length}
                </p>
              )}

            </div>

          </div>

        ) : (

          /* =================================================
             BORROWED ITEMS
          ================================================= */

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >

            {filteredItems.map(
              (request) => {

                const status =
                  String(
                    request.status || ""
                  )
                    .trim()
                    .toLowerCase();

                const isReturned =
                  status === "returned";

                return (

                  <div
                    key={request._id}
                    style={{
                      background:
                        "#ffffff",
                      border:
                        "1px solid #e5e7eb",
                      borderRadius:
                        "16px",
                      padding: "22px",
                      boxShadow:
                        "0 4px 14px rgba(0,0,0,0.04)",
                    }}
                  >

                    {/* ==================================
                        ITEM HEADER
                    ================================== */}

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "12px",
                        marginBottom:
                          "18px",
                      }}
                    >

                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius:
                            "12px",
                          background:
                            "#eef2ff",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >

                        <Package
                          size={27}
                          color="#4f46e5"
                        />

                      </div>

                      <div>

                        <h3
                          style={{
                            margin: 0,
                            fontSize: "19px",
                            color: "#111827",
                          }}
                        >
                          {request.item
                            ?.name ||
                            "Unknown Item"}
                        </h3>

                        <span
                          style={{
                            fontSize: "13px",
                            color:
                              isReturned
                                ? "#64748b"
                                : "#16a34a",
                            fontWeight:
                              "600",
                          }}
                        >
                          {isReturned
                            ? "Returned"
                            : "Borrowed"}
                        </span>

                      </div>

                    </div>

                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    {request.item
                      ?.description && (

                      <p
                        style={{
                          color:
                            "#64748b",
                          fontSize:
                            "14px",
                          lineHeight:
                            "1.5",
                          marginBottom:
                            "18px",
                        }}
                      >
                        {
                          request
                            .item
                            .description
                        }
                      </p>

                    )}

                    {/* ==================================
                        CATEGORY
                    ================================== */}

                    {request.item
                      ?.category && (

                      <div
                        style={{
                          display:
                            "inline-block",
                          background:
                            "#f1f5f9",
                          color:
                            "#475569",
                          padding:
                            "5px 10px",
                          borderRadius:
                            "20px",
                          fontSize:
                            "12px",
                          marginBottom:
                            "18px",
                        }}
                      >
                        {
                          request
                            .item
                            .category
                        }
                      </div>

                    )}

                    {/* ==================================
                        OWNER
                    ================================== */}

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        marginBottom:
                          "12px",
                        color:
                          "#64748b",
                      }}
                    >

                      <User size={17} />

                      <span>
                        Owner:{" "}

                        <strong
                          style={{
                            color:
                              "#334155",
                          }}
                        >
                          {request.owner
                            ?.name ||
                            request.owner
                              ?.email ||
                            "Unknown owner"}
                        </strong>
                      </span>

                    </div>

                    {/* ==================================
                        BORROWED DATE
                    ================================== */}

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        marginBottom:
                          "12px",
                        color:
                          "#64748b",
                      }}
                    >

                      <CalendarDays
                        size={17}
                      />

                      <span>
                        Borrowed:{" "}
                        {formatDate(
                          request
                            .borrowedDate
                        )}
                      </span>

                    </div>

                    {/* ==================================
                        RETURN DATE
                    ================================== */}

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        color:
                          "#64748b",
                      }}
                    >

                      <CalendarDays
                        size={17}
                      />

                      <span>
                        Return date:{" "}
                        {formatDate(
                          request
                            .returnDate
                        )}
                      </span>

                    </div>

                    {/* ==================================
                        STATUS
                    ================================== */}

                    <div
                      style={{
                        marginTop:
                          "18px",
                        paddingTop:
                          "15px",
                        borderTop:
                          "1px solid #e5e7eb",
                        color:
                          isReturned
                            ? "#64748b"
                            : "#16a34a",
                        fontWeight:
                          "600",
                      }}
                    >
                      {isReturned
                        ? "✓ Returned"
                        : "✓ Approved"}
                    </div>

                    {/* ==================================
                        RETURN BUTTON
                    ================================== */}

                    {!isReturned && (
                      <button
                        onClick={() =>
                          handleReturn(
                            request._id
                          )
                        }
                        disabled={
                          returningId ===
                          request._id
                        }
                        style={{
                          width: "100%",
                          marginTop:
                            "15px",
                          padding:
                            "11px 15px",
                          border: "none",
                          borderRadius:
                            "9px",
                          background:
                            returningId ===
                            request._id
                              ? "#94a3b8"
                              : "#4f46e5",
                          color:
                            "#ffffff",
                          fontSize:
                            "14px",
                          fontWeight:
                            "600",
                          cursor:
                            returningId ===
                            request._id
                              ? "not-allowed"
                              : "pointer",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          gap: "7px",
                        }}
                      >

                        <RotateCcw
                          size={17}
                        />

                        {returningId ===
                        request._id
                          ? "Returning..."
                          : "Return Item"}

                      </button>
                    )}

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

export default Borrowing;