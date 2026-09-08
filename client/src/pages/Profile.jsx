import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Profile() {
  const [user, setUser] = useState(null);

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  // ==========================================
  // LOAD LOGGED-IN USER
  // ==========================================

  useEffect(() => {
    const savedUser = localStorage.getItem("lendloopUser");

    if (!savedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);

      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        location: parsedUser.location || "",
      });
    } catch (error) {
      console.error("Invalid lendloopUser:", error);
    }
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEdit = () => {
    setEditing(true);
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
    });

    setEditing(false);
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = () => {
    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
    };

    localStorage.setItem(
      "lendloopUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setEditing(false);
  };

  // ==========================================
  // PROFILE NOT FOUND
  // ==========================================

  if (!user) {
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
            padding: "50px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <User
              size={50}
              color="#4f46e5"
            />

            <h2
              style={{
                color: "#111827",
                marginTop: "15px",
              }}
            >
              Profile not available
            </h2>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Please login again to view your profile.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <main
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
          padding: "40px 50px",
          boxSizing: "border-box",
        }}
      >
        {/* ======================================
            HEADER
        ====================================== */}

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
            Profile
          </h1>

          <p
            style={{
              marginTop: "9px",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Manage your personal information.
          </p>
        </div>

        {/* ======================================
            PROFILE CARD
        ====================================== */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "18px",
            padding: "35px",
            maxWidth: "900px",
            boxShadow:
              "0 4px 14px rgba(0,0,0,0.04)",
          }}
        >
          {/* PROFILE TOP */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              paddingBottom: "30px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {/* USER */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {/* AVATAR */}

              <div
                style={{
                  width: "82px",
                  height: "82px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <User
                  size={42}
                  color="#4f46e5"
                  strokeWidth={1.8}
                />
              </div>

              {/* NAME */}

              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "25px",
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {user.name || "LendLoop User"}
                </h2>

                <p
                  style={{
                    margin: "7px 0 0",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  LendLoop Member
                </p>
              </div>
            </div>

            {/* BUTTONS */}

            {!editing ? (
              <button
                onClick={handleEdit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "none",
                  borderRadius: "9px",
                  background: "#4f46e5",
                  color: "#ffffff",
                  padding: "11px 18px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                <Edit3 size={17} />

                Edit Profile
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={handleCancel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "9px",
                    background: "#ffffff",
                    color: "#475569",
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  <X size={17} />

                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    border: "none",
                    borderRadius: "9px",
                    background: "#16a34a",
                    color: "#ffffff",
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  <Save size={17} />

                  Save
                </button>
              </div>
            )}
          </div>

          {/* ======================================
              PERSONAL INFORMATION
          ====================================== */}

          <div
            style={{
              marginTop: "30px",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px",
                color: "#111827",
                fontSize: "19px",
              }}
            >
              Personal Information
            </h3>

            {/* NAME */}

            {editing ? (
              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Full Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "9px",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ) : null}

            {/* EMAIL */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "17px 0",
                borderBottom:
                  "1px solid #f1f5f9",
              }}
            >
              <Mail
                size={21}
                color="#4f46e5"
              />

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#94a3b8",
                  }}
                >
                  Email
                </p>

                {editing ? (
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "9px 10px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "7px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#334155",
                    }}
                  >
                    {user.email || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* PHONE */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "17px 0",
                borderBottom:
                  "1px solid #f1f5f9",
              }}
            >
              <Phone
                size={21}
                color="#4f46e5"
              />

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#94a3b8",
                  }}
                >
                  Phone
                </p>

                {editing ? (
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="Enter phone number"
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "9px 10px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "7px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#334155",
                    }}
                  >
                    {user.phone || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* LOCATION */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "17px 0",
              }}
            >
              <MapPin
                size={21}
                color="#4f46e5"
              />

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#94a3b8",
                  }}
                >
                  Location
                </p>

                {editing ? (
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter location"
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "9px 10px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "7px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#334155",
                    }}
                  >
                    {user.location ||
                      "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ======================================
              ACCOUNT STATUS
          ====================================== */}

          <div
            style={{
              marginTop: "25px",
              padding: "16px 18px",
              background: "#f8fafc",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#94a3b8",
                }}
              >
                Account Status
              </p>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#334155",
                  fontWeight: "600",
                }}
              >
                Active
              </p>
            </div>

            <span
              style={{
                background: "#dcfce7",
                color: "#15803d",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              Active
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;