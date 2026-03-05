/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const ObservabilityHeaderContext = createContext(null);

export function ObservabilityHeaderProvider({ children }) {
  const [selectedTab, setSelectedTab] = useState("Overview");

  // ✅ structured time filter (API-ready)
  const [timeFilter, setTimeFilter] = useState({
    type: "preset", // "preset" | "custom"
    value: "Last 24h", // string for preset, object for custom
  });

  // ✅ structure for backend connectivity
  const [isConnected, setIsConnected] = useState(true);

  // ✅ label used for UI display
  const timeFilterLabel =
    timeFilter?.type === "custom"
      ? `${timeFilter.value.start} → ${timeFilter.value.end}`
      : timeFilter?.value || "Last 24h";

  return (
    <ObservabilityHeaderContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        timeFilter,
        setTimeFilter,
        timeFilterLabel,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </ObservabilityHeaderContext.Provider>
  );
}

export function useObservabilityHeader() {
  const context = useContext(ObservabilityHeaderContext);
  if (!context) {
    throw new Error(
      "useObservabilityHeader must be used within ObservabilityHeaderProvider"
    );
  }
  return context;
}
