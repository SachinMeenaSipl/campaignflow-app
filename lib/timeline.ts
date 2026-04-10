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

const startDate = new Date(); // Start project today
const endDate = addDays(startDate, 131); // 131-day execution window

export function getTimelineWindow() {
  return { startDate, endDate };
}

export function getTimelineMetrics(current = new Date()) {
  const totalDays = differenceInCalendarDays(endDate, startDate);
  const boundedDate = min([max([current, startDate]), endDate]);
  const currentDay = differenceInCalendarDays(boundedDate, startDate) + 1;
  const progress = (currentDay / totalDays) * 100;

  const daysRemaining = differenceInCalendarDays(endDate, boundedDate);
  const totalDurationDays = differenceInCalendarDays(endDate, startDate);

  return {
    startDate,
    endDate,
    currentDay,
    totalDays,
    progress,
    daysRemaining,
    totalDurationDays,
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
    { label: "List cleanup", date: format(addDays(startDate, 14), "yyyy-MM-dd"), day: 15 },
    { label: "Template lock", date: format(addDays(startDate, 42), "yyyy-MM-dd"), day: 43 },
    { label: "Primary launch", date: format(addDays(startDate, 72), "yyyy-MM-dd"), day: 73 },
    { label: "Warm lead follow-up", date: format(addDays(startDate, 104), "yyyy-MM-dd"), day: 105 },
    { label: "Final push", date: format(addDays(startDate, 130), "yyyy-MM-dd"), day: 131 }
  ];
}
