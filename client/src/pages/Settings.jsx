import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  User,
  Save
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb"
      }}
    >
      <Sidebar />

      <main
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
          padding: "40px 50px",
          boxSizing: "border-box"
        }}
      >

        {/* HEADER */}
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "700",
              color: "#111827"
            }}
          >
            Settings
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "15px"
            }}
          >
            Manage your LendLoop account and preferences.
          </p>
        </div>

        {/* SETTINGS CARD */}
        <div
          style={{
            maxWidth: "900px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "30px"
          }}
        >

          {/* ACCOUNT SETTINGS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "25px"
            }}
          >
            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <User size={23} color="#4f46e5" />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "19px",
                  color: "#111827"
                }}
              >
                Account Settings
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#94a3b8",
                  fontSize: "14px"
                }}
              >
                Manage your account preferences.
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              marginBottom: "25px"
            }}
          />

          {/* NOTIFICATIONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px 0",
              borderBottom: "1px solid #f1f5f9"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <Bell size={21} color="#4f46e5" />

              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    color: "#334155"
                  }}
                >
                  Notifications
                </h3>

                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: "13px",
                    color: "#94a3b8"
                  }}
                >
                  Receive notifications about borrowing and lending.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer"
              }}
            />
          </div>

          {/* EMAIL NOTIFICATIONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px 0",
              borderBottom: "1px solid #f1f5f9"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <Bell size={21} color="#4f46e5" />

              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    color: "#334155"
                  }}
                >
                  Email Notifications
                </h3>

                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: "13px",
                    color: "#94a3b8"
                  }}
                >
                  Receive important updates through email.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) =>
                setEmailNotifications(e.target.checked)
              }
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer"
              }}
            />
          </div>

          {/* PRIVACY */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "18px 0"
            }}
          >
            <Shield size={21} color="#4f46e5" />

            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  color: "#334155"
                }}
              >
                Privacy & Security
              </h3>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "13px",
                  color: "#94a3b8"
                }}
              >
                Your account information is kept secure.
              </p>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            style={{
              marginTop: "25px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "9px",
              background: "#4f46e5",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            <Save size={18} />
            Save Settings
          </button>

        </div>

      </main>
    </div>
  );
}

export default Settings;