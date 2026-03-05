import { useCallback } from "react";
import { useObservabilityHeader } from "../context/ObservabilityHeaderContext";

function parseYYYYMMDDToLocalDate(yyyyMmDd) {
  // yyyyMmDd: "2026-02-01"
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyyMmDd.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const monthIndex = Number(m[2]) - 1; // 0-based
  const day = Number(m[3]);
  return new Date(year, monthIndex, day); // local date at 00:00:00
}

export function useTimeFilter() {
  const { timeFilter, setTimeFilter } = useObservabilityHeader();

  const getTimeRange = useCallback(() => {
    const now = new Date();
    let startTime;
    let endTime;

    // The Context provides timeFilter as { type: "preset", value: "Last 24h" } 
    // or { type: "custom", value: { start: "YYYY-MM-DD", end: "YYYY-MM-DD" } }
    const isCustomObj = timeFilter?.type === 'custom' && typeof timeFilter?.value === 'object';
    const filterString = isCustomObj ? "" : (typeof timeFilter === 'string' ? timeFilter : timeFilter?.value || "");

    if (isCustomObj) {
      const start = parseYYYYMMDDToLocalDate(timeFilter.value.start);
      const end = parseYYYYMMDDToLocalDate(timeFilter.value.end);
      if (start && end) {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        if (end < start) {
          startTime = end;
          endTime = start;
        } else {
          startTime = start;
          endTime = end;
        }
      }
    }

    if (!startTime || !endTime) {
      switch (filterString) {
        case "Last 1h":
          endTime = new Date(now);
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;

        case "Last 24h":
          endTime = new Date(now);
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;

        case "Last 7d":
          endTime = new Date(now);
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;

        default: {
          const str = filterString.trim();
          const parts =
            str.includes(" to ")
              ? str.split(" to ")
              : str.includes(" - ")
                ? str.split(" - ")
                : null;

          if (parts && parts.length === 2) {
            const start = parseYYYYMMDDToLocalDate(parts[0]);
            const end = parseYYYYMMDDToLocalDate(parts[1]);

            if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);

              if (end < start) {
                startTime = end;
                endTime = start;
              } else {
                startTime = start;
                endTime = end;
              }
              break;
            }
          }

          // Fallback
          endTime = new Date(now);
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }
      }
    }

    return {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationMs: endTime.getTime() - startTime.getTime(),
    };
  }, [timeFilter]);

  return { timeFilter, setTimeFilter, getTimeRange };
}