import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Users,
  RefreshCw,
  Package,
} from "lucide-react";

import Navbar from "../components/Navbar";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        color: "#111827",
      }}
    >
      <Navbar />

      {/* ================================
          HERO SECTION
      ================================= */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 30px 70px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        {/* LEFT CONTENT */}

        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#eef2ff",
              color: "#4f46e5",
              padding: "8px 14px",
              borderRadius: "30px",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "22px",
            }}
          >
            <RefreshCw size={16} />
            Community Lending Platform
          </div>

          <h1
            style={{
              fontSize: "58px",
              lineHeight: "1.08",
              margin: "0 0 22px",
              fontWeight: "800",
              letterSpacing: "-1.5px",
            }}
          >
            Borrow what you need.
            <br />

            <span
              style={{
                color: "#4f46e5",
              }}
            >
              Lend what you have.
            </span>
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#64748b",
              maxWidth: "620px",
              marginBottom: "32px",
            }}
          >
            LendLoop makes it easy to share useful items with people around
            you. Borrow items when you need them, lend items you don't use,
            and return them when you're done.
          </p>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => {
                window.location.href = "/register";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                background: "#4f46e5",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "14px 22px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(79,70,229,0.25)",
              }}
            >
              Get Started
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => {
                window.location.href = "/login";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                background: "#ffffff",
                color: "#334155",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "14px 22px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </div>
        </div>

        {/* RIGHT VISUAL */}

        <div
          style={{
            position: "relative",
          }}
        >
          {/* MAIN CARD */}

          <div
            style={{
              background: "#0f172a",
              borderRadius: "24px",
              padding: "30px",
              minHeight: "390px",
              boxShadow: "0 20px 50px rgba(15,23,42,0.18)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circle */}

            <div
              style={{
                position: "absolute",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background: "rgba(79,70,229,0.25)",
                top: "-80px",
                right: "-70px",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "35px",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#94a3b8",
                      margin: 0,
                      fontSize: "13px",
                    }}
                  >
                    LendLoop
                  </p>

                  <h2
                    style={{
                      color: "#ffffff",
                      margin: "5px 0 0",
                      fontSize: "24px",
                    }}
                  >
                    Item Sharing
                  </h2>
                </div>

                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                  }}
                >
                  <Package size={25} />
                </div>
              </div>

              {/* ITEM CARDS */}

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "18px",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "13px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: "#eef2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4f46e5",
                    }}
                  >
                    <ArrowUpRight size={22} />
                  </div>

                  <div>
                    <strong
                      style={{
                        display: "block",
                        color: "#111827",
                        fontSize: "15px",
                      }}
                    >
                      Laptop
                    </strong>

                    <span
                      style={{
                        color: "#64748b",
                        fontSize: "12px",
                      }}
                    >
                      Available for lending
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    background: "#dcfce7",
                    color: "#16a34a",
                    padding: "5px 9px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  Available
                </span>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "13px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: "#eef2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4f46e5",
                    }}
                  >
                    <ArrowDownLeft size={22} />
                  </div>

                  <div>
                    <strong
                      style={{
                        display: "block",
                        color: "#111827",
                        fontSize: "15px",
                      }}
                    >
                      Mathematics Book
                    </strong>

                    <span
                      style={{
                        color: "#64748b",
                        fontSize: "12px",
                      }}
                    >
                      Borrowed from another user
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    background: "#eef2ff",
                    color: "#4f46e5",
                    padding: "5px 9px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  Borrowed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================
          STATS
      ================================= */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "10px 30px 70px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {/* CARD 1 */}

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "#eef2ff",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "17px",
              }}
            >
              <Package size={25} />
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "18px",
              }}
            >
              Share Items
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.6",
                fontSize: "14px",
              }}
            >
              List items you are willing to lend to others.
            </p>
          </div>

          {/* CARD 2 */}

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "#eef2ff",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "17px",
              }}
            >
              <Users size={25} />
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "18px",
              }}
            >
              Connect
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.6",
                fontSize: "14px",
              }}
            >
              Connect with people who have the items you need.
            </p>
          </div>

          {/* CARD 3 */}

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "#eef2ff",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "17px",
              }}
            >
              <ShieldCheck size={25} />
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "18px",
              }}
            >
              Safe & Simple
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.6",
                fontSize: "14px",
              }}
            >
              Manage lending and borrowing through one simple platform.
            </p>
          </div>

          {/* CARD 4 */}

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "25px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "#eef2ff",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "17px",
              }}
            >
              <RefreshCw size={25} />
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "18px",
              }}
            >
              Easy Returns
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.6",
                fontSize: "14px",
              }}
            >
              Keep track of borrowed items and return them on time.
            </p>
          </div>
        </div>
      </section>

      {/* ================================
          HOW IT WORKS
      ================================= */}

      <section
        style={{
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
          padding: "70px 30px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "34px",
              margin: "0 0 10px",
              color: "#111827",
            }}
          >
            How LendLoop Works
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
              marginBottom: "45px",
            }}
          >
            Three simple steps to start sharing.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "30px",
            }}
          >
            <div>
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  color: "#ffffff",
                  margin: "0 auto 17px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                1
              </div>

              <h3>List an Item</h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Add an item you want to lend and provide its details.
              </p>
            </div>

            <div>
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  color: "#ffffff",
                  margin: "0 auto 17px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                2
              </div>

              <h3>Borrow</h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Find an available item and send a borrowing request.
              </p>
            </div>

            <div>
              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  color: "#ffffff",
                  margin: "0 auto 17px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                3
              </div>

              <h3>Return</h3>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                Return the item when you're finished using it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================
          FINAL CTA
      ================================= */}

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px 30px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            margin: "0 0 14px",
            color: "#111827",
          }}
        >
          Ready to start sharing?
        </h2>

        <p
          style={{
            color: "#64748b",
            fontSize: "17px",
            marginBottom: "28px",
          }}
        >
          Join LendLoop and make borrowing and lending easier.
        </p>

        <button
          onClick={() => {
            window.location.href = "/register";
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "9px",
            background: "#4f46e5",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Create Your Account
          <ArrowRight size={18} />
        </button>
      </section>

      {/* ================================
          FOOTER
      ================================= */}

      <footer
        style={{
          background: "#0f172a",
          color: "#94a3b8",
          textAlign: "center",
          padding: "25px",
          fontSize: "14px",
        }}
      >
        <strong
          style={{
            color: "#ffffff",
            fontSize: "16px",
          }}
        >
          LendLoop
        </strong>

        <div style={{ marginTop: "7px" }}>
          Borrow. Lend. Return. Simple.
        </div>

        <div style={{ marginTop: "12px" }}>
          © 2026 LendLoop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;