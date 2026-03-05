import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

function HealthDonut({ data }) {
    const getResponsive = () => {
        if (typeof window === "undefined") {
            return {
                size: 228,
                title: 32,
                subtitle: 14,
                headerTopInset: 6,
                headerLeftInset: 4,
                rowText: 16,
                legendMinWidth: 300,
                cardPadding: "8px 15px",
                cardMinHeight: 334,
                legendPadding: "14px 16px",
                centerValue: 38,
                centerPercent: 22,
                centerLabel: 14
            };
        }
        if (window.innerWidth <= 480) {
            return {
                size: 182,
                title: 22,
                subtitle: 12,
                headerTopInset: 4,
                headerLeftInset: 2,
                rowText: 13,
                legendMinWidth: 220,
                cardPadding: "8px 15px",
                cardMinHeight: "auto",
                legendPadding: "12px 14px",
                centerValue: 26,
                centerPercent: 15,
                centerLabel: 12
            };
        }
        if (window.innerWidth <= 768) {
            return {
                size: 196,
                title: 26,
                subtitle: 13,
                headerTopInset: 4,
                headerLeftInset: 2,
                rowText: 14,
                legendMinWidth: 250,
                cardPadding: "8px 15px",
                cardMinHeight: "auto",
                legendPadding: "12px 14px",
                centerValue: 30,
                centerPercent: 17,
                centerLabel: 13
            };
        }
        if (window.innerWidth <= 1200) {
            return {
                size: 212,
                title: 29,
                subtitle: 14,
                headerTopInset: 5,
                headerLeftInset: 3,
                rowText: 15,
                legendMinWidth: 280,
                cardPadding: "8px 15px",
                cardMinHeight: 318,
                legendPadding: "13px 15px",
                centerValue: 34,
                centerPercent: 20,
                centerLabel: 14
            };
        }
        return {
            size: 228,
            title: 32,
            subtitle: 14,
            headerTopInset: 6,
            headerLeftInset: 4,
            rowText: 16,
            legendMinWidth: 300,
            cardPadding: "8px 15px",
            cardMinHeight: 334,
            legendPadding: "14px 16px",
            centerValue: 38,
            centerPercent: 22,
            centerLabel: 14
        };
    };

    const [responsive, setResponsive] = useState(getResponsive);

    useEffect(() => {
        const onResize = () => setResponsive(getResponsive());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    if (!data) return null;

    const chartData = [
        { name: "Stable", value: data.stableJourneys },
        { name: "Degraded", value: data.degradedJourneys },
        { name: "Critical", value: data.criticalJourneys }
    ];

    return (
        <div
            style={{
                background: "var(--bg-card)",
                padding: responsive.cardPadding,
                borderRadius: "14px",
                border: "1px solid var(--border-subtle)",
                boxShadow: "var(--shadow-color)",
                minHeight: responsive.cardMinHeight,
                flex: 1
            }}
        >
            <h2 style={{ marginBottom: "6px", marginTop: `${responsive.headerTopInset}px`, marginLeft: `${responsive.headerLeftInset}px`, fontSize: `${responsive.title}px`, fontWeight: 800, lineHeight: 1.12, color: "var(--text-main)" }}>
                Journey Health Overview
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px", marginLeft: `${responsive.headerLeftInset}px`, fontSize: `${responsive.subtitle}px` }}>
                Technology Operations View
            </p>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "24px"
                }}
            >

                {/* LEFT - DONUT */}
                <div style={{ position: "relative" }}>
                    <PieChart width={responsive.size} height={responsive.size}>
                        <defs>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.15" />
                            </filter>
                        </defs>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={Math.round(responsive.size * 0.33)}
                            outerRadius={Math.round(responsive.size * 0.41)}
                            paddingAngle={3}
                            cornerRadius={12}
                            dataKey="value"
                            stroke="none"
                            style={{ filter: "url(#shadow)" }}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index]} />
                            ))}
                        </Pie>
                    </PieChart>

                    {/* HEALTH INSIDE DONUT */}
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            width: "100%",
                        }}
                    >
                        <h2 style={{ margin: "0 0 2px 0", color: "#10b981", fontWeight: "900", fontSize: `${responsive.centerValue}px`, letterSpacing: "-1px" }}>
                            {data.healthPercentage} <span style={{ fontSize: `${responsive.centerPercent}px` }}>%</span>
                        </h2>
                        <p style={{ margin: 0, color: "#10b981", fontWeight: "500", fontSize: `${responsive.centerLabel}px`, letterSpacing: "0.2px", lineHeight: 1.1 }}>Health</p>
                    </div>
                </div>

                {/* Right SIDE BOX */}
                <div
                    style={{
                        background: "var(--bg-card-inner)",
                        padding: responsive.legendPadding,
                        borderRadius: "8px",
                        minWidth: `${responsive.legendMinWidth}px`
                    }}
                >
                    <p style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "25px", fontSize: `${responsive.rowText}px`, whiteSpace: "nowrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, minWidth: 0 }}>
                            <span
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    backgroundColor: "#22c55e",
                                    borderRadius: "50%"
                                }}
                            ></span>
                            <b style={{ color: "var(--text-main)" }}>Stable Journeys</b>
                        </span>
                        <span style={{ color: "#22c55e", fontWeight: 500, fontSize: `${responsive.rowText}px`, minWidth: "18px", textAlign: "right", flexShrink: 0 }}>
                            {data.stableJourneys}
                        </span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 350, gap: "16px", marginBottom: "25px", fontSize: `${responsive.rowText}px`, whiteSpace: "nowrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, minWidth: 0 }}>
                            <span
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    backgroundColor: "#f59e0b",
                                    borderRadius: "50%"
                                }}
                            ></span>
                            <b style={{ color: "var(--text-main)" }}>Degraded Journeys</b>
                        </span>
                        <span style={{ color: "#f59e0b", fontWeight: 500, fontSize: `${responsive.rowText}px`, minWidth: "18px", textAlign: "right", flexShrink: 0 }}>
                            {data.degradedJourneys}
                        </span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", fontSize: `${responsive.rowText}px`, whiteSpace: "nowrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, minWidth: 0 }}>
                            <span
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    backgroundColor: "#ef4444",
                                    borderRadius: "50%"
                                }}
                            ></span>
                            <b style={{ color: "var(--text-main)" }}>Critical Journeys</b>
                        </span>
                        <span style={{ color: "#ef4444", fontWeight: 500, fontSize: `${responsive.rowText}px`, minWidth: "18px", textAlign: "right", flexShrink: 0 }}>
                            {data.criticalJourneys}
                        </span>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default HealthDonut;
