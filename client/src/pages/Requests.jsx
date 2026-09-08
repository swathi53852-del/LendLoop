import {
  Bell,
  Search,
  User,
  CalendarDays,
  Check,
  X,
  RefreshCw,
  Package
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function Requests() {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getLoggedInUser = () => {
    const savedUser = localStorage.getItem("lendloopUser");

    if (!savedUser) {
      console.log("No lendloopUser found.");
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid lendloopUser:", error);
      return null;
    }
  };

  // ==========================================
  // GET USER ID
  // Supports id / _id / userId
  // ==========================================

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

  // ==========================================
  // GET ID FROM OBJECT OR STRING
  // ==========================================

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

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "No return date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No return date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // ==========================================
  // FETCH REQUESTS
  // ==========================================

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const user = getLoggedInUser();
      const userId = getUserId(user);

      console.log("==============================");
      console.log("REQUESTS PAGE");
      console.log("Logged-in user:", user);
      console.log("Current user ID:", userId);
      console.log("==============================");

      if (!userId) {
        setRequests([]);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/lending-requests/user/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Requests returned by backend:", data);

      if (!Array.isArray(data)) {
        throw new Error(
          "Backend did not return an array."
        );
      }

      // ==========================================
      // ONLY REQUESTS WHERE CURRENT USER IS OWNER
      // ==========================================

      const ownerRequests = data.filter((request) => {
        const ownerId = getId(request.owner);

        const isOwner =
          ownerId === userId;

        console.log(
          "Checking request:",
          {
            requestId: request._id,
            item: request.item?.name,
            ownerId,
            currentUserId: userId,
            status: request.status,
            isOwner
          }
        );

        return isOwner;
      });

      console.log(
        "OWNER REQUESTS:",
        ownerRequests
      );

      setRequests(ownerRequests);

    } catch (error) {
      console.error(
        "Error fetching requests:",
        error
      );

      setRequests([]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD REQUESTS
  // ==========================================

  useEffect(() => {
    fetchRequests();
  }, []);

  // ==========================================
  // ACCEPT REQUEST
  // ==========================================

  const handleAccept = async (requestId) => {
    try {
      setActionLoading(requestId);

      const response = await fetch(
        `http://localhost:5000/api/lending-requests/${requestId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      console.log(
        "Approve response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to approve request"
        );
      }

      alert(
        "Request accepted successfully!"
      );

      await fetchRequests();

    } catch (error) {
      console.error(
        "Accept request error:",
        error
      );

      alert(
        error.message ||
        "Unable to accept request."
      );

    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // DECLINE REQUEST
  // ==========================================

  const handleDecline = async (requestId) => {
    try {
      setActionLoading(requestId);

      const response = await fetch(
        `http://localhost:5000/api/lending-requests/${requestId}/decline`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      console.log(
        "Decline response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to decline request"
        );
      }

      alert(
        "Request declined successfully."
      );

      await fetchRequests();

    } catch (error) {
      console.error(
        "Decline request error:",
        error
      );

      alert(
        error.message ||
        "Unable to decline request."
      );

    } finally {
      setActionLoading("");
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const searchText =
    search.toLowerCase().trim();

  const filteredRequests =
    requests.filter((request) => {
      const itemName =
        String(
          request.item?.name || ""
        ).toLowerCase();

      const borrowerName =
        String(
          request.borrower?.name || ""
        ).toLowerCase();

      const borrowerEmail =
        String(
          request.borrower?.email || ""
        ).toLowerCase();

      const status =
        String(
          request.status || ""
        ).toLowerCase();

      return (
        itemName.includes(searchText) ||
        borrowerName.includes(searchText) ||
        borrowerEmail.includes(searchText) ||
        status.includes(searchText)
      );
    });

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    const normalizedStatus =
      String(status || "")
        .trim()
        .toLowerCase();

    if (normalizedStatus === "pending") {
      return {
        color: "#d97706",
        background: "#fffbeb",
        border: "1px solid #fde68a"
      };
    }

    if (normalizedStatus === "approved") {
      return {
        color: "#15803d",
        background: "#f0fdf4",
        border: "1px solid #bbf7d0"
      };
    }

    if (normalizedStatus === "declined") {
      return {
        color: "#dc2626",
        background: "#fef2f2",
        border: "1px solid #fecaca"
      };
    }

    if (normalizedStatus === "returned") {
      return {
        color: "#2563eb",
        background: "#eff6ff",
        border: "1px solid #bfdbfe"
      };
    }

    return {
      color: "#64748b",
      background: "#f8fafc",
      border: "1px solid #e2e8f0"
    };
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb"
      }}
    >

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
          padding: "40px 50px",
          boxSizing: "border-box"
        }}
      >

        {/* ======================================
            HEADER
        ====================================== */}

        <div
          style={{
            marginBottom: "30px"
          }}
        >

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "700",
              color: "#111827"
            }}
          >
            Requests
          </h1>

          <p
            style={{
              marginTop: "9px",
              color: "#64748b",
              fontSize: "16px"
            }}
          >
            Manage requests from users who want
            to borrow your items.
          </p>

        </div>

        {/* ======================================
            SEARCH
        ====================================== */}

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
              "0 2px 8px rgba(0,0,0,0.03)"
          }}
        >

          <Search
            size={20}
            color="#94a3b8"
          />

          <input
            type="text"
            placeholder="Search requests..."
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
              background: "transparent",
              color: "#111827"
            }}
          />

        </div>

        {/* ======================================
            REQUEST COUNT
        ====================================== */}

        {!loading &&
          requests.length > 0 && (
            <div
              style={{
                marginBottom: "20px",
                color: "#64748b",
                fontSize: "14px"
              }}
            >
              Showing{" "}
              <strong
                style={{
                  color: "#111827"
                }}
              >
                {filteredRequests.length}
              </strong>{" "}
              request
              {filteredRequests.length !== 1
                ? "s"
                : ""}
            </div>
          )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading ? (

          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius: "16px",
              minHeight: "430px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxShadow:
                "0 4px 14px rgba(0,0,0,0.03)"
            }}
          >

            <div>

              <RefreshCw
                size={42}
                color="#4f46e5"
                style={{
                  marginBottom: "15px"
                }}
              />

              <h2
                style={{
                  margin: 0,
                  color: "#111827"
                }}
              >
                Loading requests...
              </h2>

              <p
                style={{
                  color: "#64748b",
                  marginTop: "8px"
                }}
              >
                Please wait.
              </p>

            </div>

          </div>

        ) : filteredRequests.length === 0 ? (

          /* ======================================
             EMPTY STATE
          ====================================== */

          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e7eb",
              borderRadius: "16px",
              minHeight: "430px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxShadow:
                "0 4px 14px rgba(0,0,0,0.03)"
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
                  margin:
                    "0 auto 20px"
                }}
              >

                <Bell
                  size={38}
                  color="#4f46e5"
                  strokeWidth={1.8}
                />

              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "26px",
                  color: "#111827"
                }}
              >
                No requests yet
              </h2>

              <p
                style={{
                  marginTop: "10px",
                  color: "#64748b",
                  fontSize: "16px"
                }}
              >
                {search
                  ? "No requests match your search."
                  : "You don't have any borrowing requests yet."}
              </p>

            </div>

          </div>

        ) : (

          /* ======================================
             REQUEST CARDS
          ====================================== */

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px"
            }}
          >

            {filteredRequests.map(
              (request) => {

                const status =
                  String(
                    request.status || ""
                  )
                    .trim()
                    .toLowerCase();

                const statusStyle =
                  getStatusStyle(
                    request.status
                  );

                const isActionLoading =
                  actionLoading ===
                  request._id;

                return (
                  <div
                    key={request._id}
                    style={{
                      background:
                        "#ffffff",
                      border:
                        "1px solid #e5e7eb",
                      borderRadius: "16px",
                      padding: "22px",
                      boxShadow:
                        "0 4px 14px rgba(0,0,0,0.04)"
                    }}
                  >

                    {/* ITEM HEADER */}

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "12px",
                        marginBottom:
                          "20px"
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
                            "center"
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
                            fontSize:
                              "19px",
                            fontWeight:
                              "600",
                            color:
                              "#111827"
                          }}
                        >
                          {request.item?.name ||
                            "Unknown Item"}
                        </h3>

                        <span
                          style={{
                            color:
                              "#64748b",
                            fontSize:
                              "13px"
                          }}
                        >
                          Borrowing request
                        </span>

                      </div>

                    </div>

                    {/* DESCRIPTION */}

                    {request.item
                      ?.description && (
                      <p
                        style={{
                          margin:
                            "0 0 18px",
                          color:
                            "#64748b",
                          fontSize:
                            "14px",
                          lineHeight:
                            "1.5"
                        }}
                      >
                        {
                          request.item
                            .description
                        }
                      </p>
                    )}

                    {/* BORROWER */}

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        marginBottom:
                          "13px",
                        color:
                          "#64748b"
                      }}
                    >

                      <User size={17} />

                      <span>
                        Requested by{" "}

                        <strong
                          style={{
                            color:
                              "#334155"
                          }}
                        >
                          {request
                            .borrower
                            ?.name ||
                            request
                              .borrower
                              ?.email ||
                            "Unknown user"}
                        </strong>
                      </span>

                    </div>

                    {/* EMAIL */}

                    {request.borrower
                      ?.email && (
                      <div
                        style={{
                          marginBottom:
                            "13px",
                          fontSize:
                            "13px",
                          color:
                            "#94a3b8"
                        }}
                      >
                        {request
                          .borrower
                          .email}
                      </div>
                    )}

                    {/* RETURN DATE */}

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        marginBottom:
                          "18px",
                        color:
                          "#64748b"
                      }}
                    >

                      <CalendarDays
                        size={17}
                      />

                      <span>
                        Return date:{" "}
                        <strong
                          style={{
                            color:
                              "#334155"
                          }}
                        >
                          {formatDate(
                            request.returnDate
                          )}
                        </strong>
                      </span>

                    </div>

                    {/* STATUS */}

                    <div
                      style={{
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        padding:
                          "7px 12px",
                        borderRadius:
                          "20px",
                        fontSize:
                          "13px",
                        fontWeight:
                          "600",
                        marginBottom:
                          "18px",
                        ...statusStyle
                      }}
                    >

                      {status ===
                        "pending" &&
                        "● Pending"}

                      {status ===
                        "approved" &&
                        "✓ Approved"}

                      {status ===
                        "declined" &&
                        "✕ Declined"}

                      {status ===
                        "returned" &&
                        "↩ Returned"}

                    </div>

                    {/* ACTION BUTTONS */}

                    {status ===
                      "pending" && (

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "10px"
                        }}
                      >

                        {/* ACCEPT */}

                        <button
                          onClick={() =>
                            handleAccept(
                              request._id
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          style={{
                            flex: 1,
                            padding:
                              "11px",
                            border:
                              "none",
                            borderRadius:
                              "8px",
                            background:
                              isActionLoading
                                ? "#86efac"
                                : "#16a34a",
                            color:
                              "#ffffff",
                            fontWeight:
                              "600",
                            cursor:
                              isActionLoading
                                ? "not-allowed"
                                : "pointer",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            gap: "6px"
                          }}
                        >

                          <Check
                            size={16}
                          />

                          {isActionLoading
                            ? "Processing..."
                            : "Accept"}

                        </button>

                        {/* DECLINE */}

                        <button
                          onClick={() =>
                            handleDecline(
                              request._id
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          style={{
                            flex: 1,
                            padding:
                              "11px",
                            border:
                              "1px solid #fecaca",
                            borderRadius:
                              "8px",
                            background:
                              "#ffffff",
                            color:
                              "#dc2626",
                            fontWeight:
                              "600",
                            cursor:
                              isActionLoading
                                ? "not-allowed"
                                : "pointer",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            gap: "6px"
                          }}
                        >

                          <X size={16} />

                          Decline

                        </button>

                      </div>
                    )}

                    {/* APPROVED MESSAGE */}

                    {status ===
                      "approved" && (
                      <div
                        style={{
                          paddingTop:
                            "15px",
                          borderTop:
                            "1px solid #e5e7eb",
                          color:
                            "#16a34a",
                          fontWeight:
                            "600"
                        }}
                      >
                        ✓ Item is currently lent
                      </div>
                    )}

                    {/* RETURNED MESSAGE */}

                    {status ===
                      "returned" && (
                      <div
                        style={{
                          paddingTop:
                            "15px",
                          borderTop:
                            "1px solid #e5e7eb",
                          color:
                            "#2563eb",
                          fontWeight:
                            "600"
                        }}
                      >
                        ↩ Item has been returned
                      </div>
                    )}

                    {/* DECLINED MESSAGE */}

                    {status ===
                      "declined" && (
                      <div
                        style={{
                          paddingTop:
                            "15px",
                          borderTop:
                            "1px solid #e5e7eb",
                          color:
                            "#dc2626",
                          fontWeight:
                            "600"
                        }}
                      >
                        ✕ Request was declined
                      </div>
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

export default Requests;