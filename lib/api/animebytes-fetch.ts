// lib/utils/animebytes-fetch.ts
import pThrottle from "p-throttle";

const throttle = pThrottle({
  limit: 1,        // 1 call...
  interval: 3000,  // ...per 3 seconds
});

export const abFetch = throttle((url: string, init?: RequestInit) =>
  fetch(url, init)
);