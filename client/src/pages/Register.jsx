import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        "Unable to connect to the server. Please make sure the LendLoop server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Left Section */}
      <div className="register-left">

        <div className="register-brand">
          <div className="register-brand-icon">L</div>
          <span>LendLoop</span>
        </div>

        <div className="register-welcome">

          <h1>
            Join the
            <br />
            <span>LendLoop Community</span>
          </h1>

          <p>
            Create an account and start lending and borrowing
            useful items with people you trust.
          </p>

          <div className="register-features">

            <div>
              <span>✓</span>
              <p>Share your unused items</p>
            </div>

            <div>
              <span>✓</span>
              <p>Borrow what you need</p>
            </div>

            <div>
              <span>✓</span>
              <p>Track your lending activity</p>
            </div>

          </div>

        </div>

      </div>


      {/* Right Section */}
      <div className="register-right">

        <div className="register-card">

          <div className="register-mobile-brand">
            <div className="register-brand-icon">L</div>
            <span>LendLoop</span>
          </div>

          <h2>Create Account</h2>

          <p className="register-subtitle">
            Join LendLoop and start sharing today
          </p>


          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <div className="register-input-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            </div>


            {/* Email */}
            <div className="register-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>


            {/* Password */}
            <div className="register-input-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>


            {/* Confirm Password */}
            <div className="register-input-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

            </div>


            {/* Terms */}
            <label className="terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the terms and conditions
              </span>

            </label>


            {/* Register Button */}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          <div className="register-divider">
            <span>OR</span>
          </div>


          <p className="login-link">
            Already have an account?{" "}
            <Link to="/login">
              Login here
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;