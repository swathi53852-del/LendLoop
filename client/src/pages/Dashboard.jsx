
import { useEffect, useState } from "react";
import {
  Package,
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Clock3,
  Plus,
  Search,
  Bell,
  RefreshCw,
  LogOut,
  Activity,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    available: 0,
    lending: 0,
    borrowing: 0,
    pending: 0,
  });

  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET LOGGED-IN USER
  const getLoggedInUser = () => {
    const savedUser = localStorage.getItem("lendloopUser");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid logged-in user:", error);
      return null;
    }
  };

  // GET ID FROM STRING OR OBJECT
  const getId = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "object") {
      return String(
        value._id ||
        value.id ||
        value.userId ||
        value.$oid ||
        ""
      );
    }

    return "";
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("lendloopUser");
    window.location.href = "/login";
  };

  // LOAD DASHBOARD
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getLoggedInUser();

      if (!user) {
        throw new Error("Logged-in user not found");
      }

      const userId = getId(
        user.id ||
        user._id ||
        user.userId ||
        user.user
      );

      if (!userId) {
        throw new Error("User ID not found");
      }

      console.log("Logged-in user:", user);
      console.log("Logged-in user ID:", userId);

      // GET ALL ITEMS
      const itemsResponse = await fetch(
        "/api/items"
      );

      if (!itemsResponse.ok) {
        throw new Error(
          `Items API returned ${itemsResponse.status}`
        );
      }

      const items = await itemsResponse.json();

      if (!Array.isArray(items)) {
        throw new Error("Items API did not return an array");
      }

      // GET MY ITEMS
      const myItems = items.filter((item) => {
        const ownerId = getId(item.owner);

        return ownerId === userId;
      });

      // AVAILABLE ITEMS
      const available = myItems.filter((item) => {
        return (
          String(item.status || "")
            .trim()
            .toLowerCase() === "available"
        );
      }).length;

      // GET LENDING REQUESTS
      let requests = [];

      const requestsResponse = await fetch(
        "/api/lending-requests"
      );

      if (!requestsResponse.ok) {
        throw new Error(
          `Lending requests API returned ${requestsResponse.status}`
        );
      }

      const requestData = await requestsResponse.json();

      if (!Array.isArray(requestData)) {
        throw new Error(
          "Lending requests API did not return an array"
        );
      }

      requests = requestData;

      console.log(
        "Requests for dashboard:",
        requests.map((request) => ({
          item: request.item?.name,
          owner: getId(request.owner),
          borrower: getId(request.borrower),
          status: request.status,
        }))
      );

      // LENDING ITEMS
      // Count approved requests belonging to this item's owner.
      // The backend marks an item as Lent when a request is approved.
      const lendingRequests = requests.filter((request) => {
        const ownerId = getId(request.owner);

        const status = String(request.status || "")
          .trim()
          .toLowerCase();

        return (
          ownerId === userId &&
          status === "approved"
        );
      });

      const lending = lendingRequests.length;

      // BORROWING ITEMS
      const borrowingRequests = requests.filter((request) => {
        const borrowerId = getId(request.borrower);

        const status = String(request.status || "")
          .trim()
          .toLowerCase();

        return (
          borrowerId === userId &&
          status === "approved"
        );
      });

      const borrowing = borrowingRequests.length;

      // PENDING REQUESTS
      const pendingRequests = requests.filter((request) => {
        const status = String(request.status || "")
          .trim()
          .toLowerCase();

        return status === "pending";
      });

      // RECENT ITEMS
      const sortedItems = [...myItems]
        .sort((a, b) => {
          return (
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
          );
        })
        .slice(0, 4);

      setRecentItems(sortedItems);

      // UPDATE DASHBOARD STATISTICS
      setStats({
        totalItems: myItems.length,
        available,
        lending,
        borrowing,
        pending: pendingRequests.length,
      });

    } catch (error) {
      console.error("DASHBOARD ERROR:", error);

      setError(
        "Unable to load dashboard information. Please make sure the LendLoop server is running and you are logged in."
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD PAGE
  useEffect(() => {
    loadDashboard();
  }, []);

  // USER
  const user = getLoggedInUser();

  const userName =
    user?.name ||
    user?.fullName ||
    user?.user?.name ||
    "User";

  // DASHBOARD CARDS
  const cards = [
    {
      title: "My Items",
      value: stats.totalItems,
      description: "Items you have added",
      icon: <Package size={25} />,
      className: "purple",
    },
    {
      title: "Available",
      value: stats.available,
      description: "Items ready to lend",
      icon: <CheckCircle size={25} />,
      className: "green",
    },
    {
      title: "Lent Items",
      value: stats.lending,
      description: "Items currently lent",
      icon: <ArrowUpRight size={25} />,
      className: "blue",
    },
    {
      title: "Borrowed",
      value: stats.borrowing,
      description: "Items you are borrowing",
      icon: <ArrowDownLeft size={25} />,
      className: "orange",
    },
  ];

  // PAGE
  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        {/* TOP BAR */}
        <div className="dashboard-topbar">
          <div className="topbar-spacer"></div>

          <div className="topbar-right">
            <button
              className="notification-button"
              title="Notifications"
            >
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="user-mini">
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{userName}</strong>
                <span>LendLoop Member</span>
              </div>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* WELCOME */}
        <section className="welcome-section">
          <div>
            <p className="welcome-small">
              Welcome back 👋
            </p>

            <h1>Hello, {userName}!</h1>

            <p className="welcome-description">
              Here's what's happening with your
              LendLoop account today.
            </p>
          </div>

          <Link
            to="/items"
            className="browse-button"
          >
            <Search size={19} />
            Browse Items
          </Link>
        </section>

        {/* ERROR */}
        {error && (
          <div className="dashboard-error">
            <span>{error}</span>

            <button onClick={loadDashboard}>
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="dashboard-loading">
            <Package size={42} />

            <h2>Loading your dashboard...</h2>

            <p>
              Connecting to your LendLoop account.
            </p>
          </div>
        ) : (
          <>
            {/* STATISTICS */}
            <section className="stats-grid">
              {cards.map((card) => (
                <div
                  className="stat-card"
                  key={card.title}
                >
                  <div
                    className={`stat-icon ${card.className}`}
                  >
                    {card.icon}
                  </div>

                  <div className="stat-content">
                    <span className="stat-title">
                      {card.title}
                    </span>

                    <strong>{card.value}</strong>

                    <span className="stat-description">
                      {card.description}
                    </span>
                  </div>
                </div>
              ))}
            </section>

            {/* LOWER SECTION */}
            <section className="dashboard-lower">
              {/* RECENT ITEMS */}
              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>Recent Items</h2>

                    <p>
                      Your latest items on LendLoop
                    </p>
                  </div>

                  <Link to="/items">
                    View all
                    <ArrowRight size={16} />
                  </Link>
                </div>

                {recentItems.length === 0 ? (
                  <div className="empty-state">
                    <Package size={38} />

                    <h3>No items yet</h3>

                    <p>
                      Add your first item to start
                      using LendLoop.
                    </p>

                    <Link
                      to="/items"
                      className="add-item-button"
                    >
                      <Plus size={17} />
                      Add Item
                    </Link>
                  </div>
                ) : (
                  <div className="recent-items">
                    {recentItems.map((item) => (
                      <div
                        className="recent-item"
                        key={item._id}
                      >
                        <div className="item-image">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                            />
                          ) : (
                            <Package size={25} />
                          )}
                        </div>

                        <div className="item-info">
                          <h3>{item.name}</h3>
                          <p>
                            {item.category || "Other"}
                          </p>
                        </div>

                        <span
                          className={`status-badge ${
                            String(
                              item.status || "Available"
                            )
                              .toLowerCase()
                              .replace(" ", "-")
                          }`}
                        >
                          {item.status || "Available"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* QUICK ACTIONS */}
              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>Quick Actions</h2>

                    <p>
                      Manage your LendLoop activity
                    </p>
                  </div>

                  <Activity size={21} />
                </div>

                <div className="quick-actions">
                  <Link
                    to="/items"
                    className="quick-action"
                  >
                    <div className="quick-icon purple">
                      <Plus size={21} />
                    </div>

                    <div>
                      <strong>Add an Item</strong>

                      <span>
                        Share an item with others
                      </span>
                    </div>

                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/items"
                    className="quick-action"
                  >
                    <div className="quick-icon blue">
                      <Search size={21} />
                    </div>

                    <div>
                      <strong>Find Items</strong>

                      <span>
                        Browse available items
                      </span>
                    </div>

                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/requests"
                    className="quick-action"
                  >
                    <div className="quick-icon orange">
                      <Clock3 size={21} />
                    </div>

                    <div>
                      <strong>Requests</strong>

                      <span>
                        {stats.pending} pending request
                        {stats.pending !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </section>

            {/* BOTTOM INFO */}
            <section className="dashboard-tip">
              <div className="tip-icon">
                <CheckCircle size={23} />
              </div>

              <div>
                <strong>
                  Keep your items updated
                </strong>

                <p>
                  Mark items as available or lent so
                  other LendLoop members always see
                  accurate information.
                </p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;