import {
  addDays,
  differenceInCalendarDays,
  eachMonthOfInterval,
  endOfMonth,
  format,
  max,
  min,
  startOfMonth
} from "date-fns";

const startDate = new Date(2026, 3, 7);
const endDate = new Date(2026, 7, 16);

export function getTimelineWindow() {
  return { startDate, endDate };
}

export function getTimelineMetrics(current = new Date()) {
  const totalDays = differenceInCalendarDays(endDate, startDate);
  const boundedDate = min([max([current, startDate]), endDate]);
  const currentDay = differenceInCalendarDays(boundedDate, startDate) + 1;
  const progress = (currentDay / totalDays) * 100;

  return {
    startDate,
    endDate,
    currentDay,
    totalDays,
    progress,
    startLabel: format(startDate, "d MMM yyyy"),
    endLabel: format(endDate, "d MMM yyyy"),
    todayLabel: format(boundedDate, "d MMM yyyy")
  };
}

export function getTimelineBreakdown() {
  return eachMonthOfInterval({ start: addDays(startDate, 1), end: endDate }).map((month) => {
    const monthStart = max([month, addDays(startDate, 1), startOfMonth(month)]);
    const monthEnd = min([endOfMonth(month), endDate]);
    const days = differenceInCalendarDays(addDays(monthEnd, 1), monthStart);

    return {
      label: format(month, "MMMM"),
      days
    };
  });
}

export function getMilestones() {
  return [
    { label: "List cleanup", date: "2026-04-21", day: 15 },
    { label: "Template lock", date: "2026-05-19", day: 43 },
    { label: "Primary launch", date: "2026-06-18", day: 73 },
    { label: "Warm lead follow-up", date: "2026-07-20", day: 105 },
    { label: "Final push", date: "2026-08-16", day: 131 }
  ];
}
