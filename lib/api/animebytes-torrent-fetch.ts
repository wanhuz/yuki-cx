import pThrottle from "p-throttle";

const throttle = pThrottle({
  limit: 1,
  interval: 3000, // 3s site rule + margin
});

export const abFetchTorrent = throttle((url: string, init?: RequestInit) =>
  fetch(url, init)
);