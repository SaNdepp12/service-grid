import { useNavigate } from "react-router-dom";

export default function JourneysPage() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
            <button
                onClick={() => navigate("/")}
                className="hover-lift"
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "40px",
                    fontWeight: "600",
                    color: "var(--text-muted)",
                }}
            >
                ← Back to Dashboard
            </button>

            <div
                style={{
                    background: "var(--bg-card)",
                    padding: "60px",
                    borderRadius: "16px",
                    boxShadow: "var(--shadow-color)",
                }}
            >
                <h1 style={{ fontSize: "32px", color: "var(--text-main)", marginBottom: "16px" }}>
                    Journeys Page
                </h1>
                <div style={{ display: "inline-block", padding: "8px 16px", background: "var(--danger-bg)", color: "var(--danger-text)", borderRadius: "20px", fontWeight: "bold", fontSize: "14px", marginBottom: "24px" }}>
                    System Alert
                </div>
                <h2 style={{ fontSize: "24px", color: "var(--text-muted)", margin: 0, fontWeight: "500" }}>
                    This page is currently Under Maintenance.
                </h2>
                <p style={{ color: "var(--text-dim)", marginTop: "16px", lineHeight: "1.6" }}>
                    Our engineering team is actively upgrading the Business Journeys aggregation pipeline. Please check back later.
                </p>
            </div>
        </div>
    );
}
