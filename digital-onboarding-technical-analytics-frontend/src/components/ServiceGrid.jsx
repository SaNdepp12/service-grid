import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceGrid.css";

const ServiceGrid = ({ services = [] }) => {
  const navigate = useNavigate();

  const handleServiceClick = useCallback(
    (serviceId) => {
      navigate(`/techops/service/${encodeURIComponent(serviceId)}`);
    },
    [navigate]
  );

  return (
    <div style={{ marginTop: 0 }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 800,
          marginBottom: "25px",
          color: "var(--text-main)",
        }}
      >
        Service Grid ({services.length} Services)
      </h2>

      <div className="serviceGridTiles">
        {services.map((s) => (
          <div
            key={s.id}
            className="hover-lift"
            onClick={() => handleServiceClick(s.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleServiceClick(s.id);
              }
            }}
            role="button"
            tabIndex={0}
            style={{
              background: getBgColor(s.status),
              border: `1px solid ${getBorderColor(s.status)}`,
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              aspectRatio: "1.5",
              boxShadow: "var(--shadow-color)",
              cursor: "pointer",
              userSelect: "none",
              outline: "none",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 900,
                color: getTextColor(s.status),
              }}
            >
              {s.id}
            </span>

            <span
              style={{
                fontSize: "10px",
                color: "var(--text-muted)",
                marginTop: "6px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
              title={s.name}
            >
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getBgColor = (status) => {
  if (status === "Critical") return "var(--bg-critical)";
  if (status === "Warning") return "var(--bg-warning)";
  return "var(--bg-success)";
};

const getBorderColor = (status) => {
  if (status === "Critical") return "var(--border-critical)";
  if (status === "Warning") return "var(--border-warning)";
  return "var(--border-success)";
};

const getTextColor = (status) => {
  if (status === "Critical") return "var(--text-critical)";
  if (status === "Warning") return "var(--text-warning)";
  return "var(--text-success)";
};

export default ServiceGrid;
