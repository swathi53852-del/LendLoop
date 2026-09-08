import {
  Package,
  LogIn,
  UserPlus,
} from "lucide-react";

function Navbar() {
  return (
    <nav
      style={{
        height: "72px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 50px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* ================================
          LOGO
      ================================= */}

      <div
        onClick={() => {
          window.location.href = "/";
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "11px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "11px",
            background: "#4f46e5",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "22px",
          }}
        >
          L
        </div>

        <span
          style={{
            fontSize: "23px",
            fontWeight: "800",
            color: "#111827",
            letterSpacing: "-0.5px",
          }}
        >
          LendLoop
        </span>
      </div>

      {/* ================================
          NAVIGATION
      ================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 16px",
            border: "none",
            background: "transparent",
            color: "#475569",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          <LogIn size={17} />
          Login
        </button>

        <button
          onClick={() => {
            window.location.href = "/register";
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 17px",
            border: "none",
            background: "#4f46e5",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            borderRadius: "8px",
            boxShadow:
              "0 4px 12px rgba(79,70,229,0.20)",
          }}
        >
          <UserPlus size={17} />
          Get Started
        </button>
      </div>
    </nav>
  );
}

export default Navbar;