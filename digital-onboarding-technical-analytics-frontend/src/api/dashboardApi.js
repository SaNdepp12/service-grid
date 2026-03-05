// dashboardApi.js
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const fetchDashboard = async (windowHours = 24) => {
  try {
    // Attempt real backend fetch
    const response = await fetch(`${API_BASE}/api/v1/dashboard?window_hours=${windowHours}`);
    if (response.ok) {
      const bData = await response.json();

      const journeyHealth = bData.journey_health || {
        stable: 0,
        degraded: 0,
        critical: 0,
        percentage: 100.0
      };

      const kpis = {
        totalRequests: { value: bData.summary?.total_requests || 0, deltaPct: 0, compareLabel: "vs Yesterday" },
        p95Latency: { value: bData.summary?.p95_latency || 0, deltaMs: 0, compareLabel: "improvement" },
        error5xx: { value: bData.summary?.error_rate_5xx || 0, deltaPct: 0, compareLabel: "from baseline" },
        error4xx: { value: bData.summary?.error_rate_4xx || 0, deltaPct: 0, compareLabel: "improved" }
      };

      const knownCategories = {
        "Gold Loan": "ASSETS OPERATIONS",
        "Home Loan": "ASSETS OPERATIONS",
        "Credit Card": "CARDS OPERATIONS",
        "Forex Card": "CARDS OPERATIONS",
        "Saving Accounts": "LIABILITIES OPERATIONS",
        "Saving Accounts Growth": "LIABILITIES OPERATIONS",
        "Fixed Deposits": "LIABILITIES OPERATIONS",
        "Fixed Deposits Renewals": "LIABILITIES OPERATIONS",
        "Stripe Gateway": "THIRD PARTY OPERATIONS",
        "Payment Gateway (Stripe)": "THIRD PARTY OPERATIONS",
        "KYC Services": "THIRD PARTY OPERATIONS",
        "KYC Verification Services": "THIRD PARTY OPERATIONS"
      };

      const grouped = {};
      (bData.journeys || []).forEach(j => {
        const catName = knownCategories[j.journey_name] || "OTHER OPERATIONS";
        if (!grouped[catName]) grouped[catName] = [];

        grouped[catName].push({
          name: j.journey_name,
          status: j.health === "Healthy" ? "Stable" : j.health,
          volume: j.total_volume,
          success: j.success_rate,
          abandon: j.abandon_rate,
          failure: j.failure_rate,
          uptime: j.uptime,
          p95: j.p95_latency,
          services: j.distinct_services
        });
      });

      const journeyCategories = Object.keys(grouped).map(k => ({
        name: k,
        journeys: grouped[k]
      }));

      const services = (bData.service_grid || []).map(s => ({
        id: s.service_home,
        name: s.service_name,
        status: s.status === "Green" ? "Healthy" : s.status === "Amber" ? "Warning" : "Critical"
      }));

      const apiStats = {
        topErrors: (bData.top_errors || []).map((e, idx) => ({
          id: idx + 1, method: e.method, path: e.path, value: e.error_rate
        })),
        slowest: (bData.slowest_apis || []).map((e, idx) => ({
          id: idx + 1, method: e.method, path: e.path, value: e.p95_latency + "ms"
        }))
      };

      return {
        source: 'live',
        kpis,
        journeyHealth,
        journeyCategories,
        services,
        apiStats
      };
    }
  } catch (error) {
    console.warn("Backend not available, falling back to mock data.", error);
  }

  // Fallback to local mock data
  const response = await fetch("/data.json");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const data = await response.json();
  return { ...data, source: 'mock' };
};
