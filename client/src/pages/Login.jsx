
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      // Save logged-in user
      localStorage.setItem(
        "lendloopUser",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Unable to connect to the server. Please make sure the LendLoop server is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left Section */}
      <div className="login-left">

        <div className="brand">
          <div className="brand-icon">L</div>
          <span>LendLoop</span>
        </div>

        <div className="welcome-content">

          <h1>
            Share. Borrow.
            <br />
            <span>Connect.</span>
          </h1>

          <p>
            LendLoop makes it easy to lend and borrow items
            within your trusted community.
          </p>

          <div className="feature-list">

            <div className="feature">
              <span>✓</span>
              <p>Manage your items easily</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>Track lending and borrowing</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>Build a trusted community</p>
            </div>

          </div>

        </div>

      </div>


      {/* Right Section */}
      <div className="login-right">

        <div className="login-card">

          <div className="mobile-brand">
            <div className="brand-icon">L</div>
            <span>LendLoop</span>
          </div>

          <h2>Welcome Back!</h2>

          <p className="login-subtitle">
            Login to continue to your LendLoop account
          </p>


          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

            </div>


            {/* Password */}
            <div className="input-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <a href="#forgot">
                  Forgot Password?
                </a>

              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

            </div>


            {/* Remember Me */}
            <div className="remember-row">

              <label>

                <input
                  type="checkbox"
                  disabled={loading}
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>


          <div className="divider">
            <span>OR</span>
          </div>


          <p className="register-text">

            Don't have an account?{" "}

            <Link to="/register">
              Create an account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;

