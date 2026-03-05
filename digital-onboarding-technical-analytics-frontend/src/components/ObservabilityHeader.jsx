import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useObservabilityHeader } from "../context/ObservabilityHeaderContext";
import { useTheme } from "../context/ThemeContext";
import "./ObservabilityHeader.css";
import logo from "../assets/hdfclogo.png";

const NAV_TABS = [
  { label: "Overview", id: "overview" },
  { label: "Journeys", id: "journeys" },
  { label: "Services", id: "services" },
  { label: "API Explorer", id: "api-explorer" },
  { label: "Alert", id: "alerts" },
];

const TIME_FILTER_OPTIONS = ["Last 1h", "Last 24h", "Last 7d", "Select Custom Range"];

export default function ObservabilityHeader() {
  const {
    selectedTab,
    setSelectedTab,
    timeFilter,
    setTimeFilter,
    timeFilterLabel,
    isConnected,
  } = useObservabilityHeader();

  const { theme, toggleTheme } = useTheme();

  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Calculate today's date in YYYY-MM-DD format for max constraints
  const today = new Date().toISOString().split('T')[0];

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const dropdownRef = useRef(null);

  // Determine active tab based on context state or scrolling (simplified to context for now)
  const isTabActive = (tabLabel) => selectedTab === tabLabel;

  // Close dropdown on outside click + ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsTimeFilterOpen(false);
        setShowCustomRange(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsTimeFilterOpen(false);
        setShowCustomRange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleTabClick = (tab) => {
    setSelectedTab(tab.label);

    if (tab.id === "overview") {
      if (pathname !== "/") {
        navigate("/");
      } else {
        const element = document.getElementById(tab.id);
        if (element) {
          // Offset for fixed header (approx 80px)
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    } else {
      navigate(`/pages/${tab.id}`);
    }
  };

  const handleTimeFilterChange = (option) => {
    if (option === "Select Custom Range") {
      setShowCustomRange(true);
      return;
    }

    setTimeFilter({
      type: "preset",
      value: option,
    });

    setShowCustomRange(false);
    setIsTimeFilterOpen(false);
  };

  const applyCustomRange = () => {
    if (!customStart || !customEnd) return;

    setTimeFilter({
      type: "custom",
      value: {
        start: customStart,
        end: customEnd,
      },
    });

    setShowCustomRange(false);
    setIsTimeFilterOpen(false);
  };

  return (
    <header className="obsHeader">
      <div className="obsHeaderInner">
        {/* -------------------- BRANDING -------------------- */}
        <div
          className="obsBrand"
          onClick={() => window.location.href = "/"}
          style={{ cursor: "pointer" }}
          title="Refresh Dashboard"
        >
          <img
            src={logo}
            alt="HDFC Bank Logo"
            className="obsBrandLogo"
          />
        </div>

        {/* -------------------- NAV TABS -------------------- */}

        <nav className="obsNav">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.label}
              className={`obsNavTab ${isTabActive(tab.label) ? "active" : ""}`}
              onClick={() => handleTabClick(tab)}
              aria-current={isTabActive(tab.label) ? "page" : undefined}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>


        {/* -------------------- RIGHT SECTION: LIVE + TIME FILTER -------------------- */}
        <div className="obsHeaderRight">

          {/* Theme Toggle */}
          <button
            className="obsThemeToggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Live Indicator */}
          <div className="obsLiveIndicator" aria-label="System is live">
            <span className={`obsLiveDot ${!isConnected ? "disconnected" : ""}`}></span>
            <span className={`obsLiveLabel ${!isConnected ? "disconnected" : ""}`}>Live</span>
          </div>

          {/* Time Filter Dropdown */}
          <div className="obsTimeFilterWrapper" ref={dropdownRef}>
            <button
              className="obsTimeFilterBtn"
              onClick={() => setIsTimeFilterOpen((v) => !v)}
              aria-label="Open time filter"
              aria-expanded={isTimeFilterOpen}
              type="button"
            >
              <span className="obsTimeFilterLabel">{timeFilterLabel}</span>
              <span className="obsTimeFilterChevron">
                <SvgChevronDown />
              </span>
            </button>

            {isTimeFilterOpen && (
              <div className="obsTimeFilterDropdown">
                {!showCustomRange ? (
                  TIME_FILTER_OPTIONS.map((option) => {
                    const isSelected =
                      timeFilter.type === "preset" && timeFilter.value === option;

                    return (
                      <button
                        key={option}
                        className={`obsTimeFilterOption ${isSelected ? "selected" : ""
                          }`}
                        onClick={() => handleTimeFilterChange(option)}
                        type="button"
                      >
                        {option}
                        {isSelected && (
                          <span className="obsCheckmark">
                            <SvgCheckmark />
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="obsCustomDateContainer">
                    <div className="obsDateRow">
                      <label>Start date</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        max={customEnd ? (customEnd < today ? customEnd : today) : today}
                      />
                    </div>

                    <div className="obsDateRow">
                      <label>End date</label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        min={customStart || undefined}
                        max={today}
                      />
                    </div>

                    <div className="obsDateActions">
                      <button
                        type="button"
                        className="obsDateBackBtn"
                        onClick={() => setShowCustomRange(false)}
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        className="obsDateApplyBtn"
                        onClick={applyCustomRange}
                        disabled={!customStart || !customEnd}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------- SVG ICONS -------------------- */

function SvgChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgCheckmark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
