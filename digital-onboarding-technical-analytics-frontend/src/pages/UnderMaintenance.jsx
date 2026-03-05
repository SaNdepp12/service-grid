import { useNavigate, useParams } from "react-router-dom";

export default function UnderMaintenance() {
  const navigate = useNavigate();
  const { type, name } = useParams();
  const resolvedType = type || "service";

  return (
    <div style={{ padding: "20px 0", maxWidth: "1000px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/")}
        className="hover-lift"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
          fontWeight: "600",
          color: "var(--text-muted)",
        }}
      >
        Back to Dashboard
      </button>

      <div
        style={{
          background: "var(--bg-card)",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "var(--shadow-color)",
        }}
      >
        <h1 style={{ fontSize: "28px", color: "var(--text-main)", marginBottom: "8px" }}>
          {decodeURIComponent(name || "Item")} - Drill-down
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px", textTransform: "capitalize" }}>
          Type: {resolvedType}
        </p>
        <h2 style={{ fontSize: "22px", color: "var(--text-main)", margin: 0 }}>Under Maintenance</h2>
      </div>
    </div>
  );
}
