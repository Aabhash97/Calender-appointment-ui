import moment from "moment-timezone";

export const TIMEZONES = [
  { value: "America/Los_Angeles", label: "America/Los_Angeles (GMT-7:00)" },
  { value: "America/New_York", label: "America/New_York (GMT-4:00)" },
  { value: "Europe/London", label: "Europe/London (GMT+1:00)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+9:00)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
];

export const TIMEZONES_VALUE = [
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export const BASE_URL = "http://localhost:8080";