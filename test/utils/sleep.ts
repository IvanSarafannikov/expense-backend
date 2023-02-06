export const sleep = (ms: number) =>
  new Promise((res, _) => setTimeout(res, ms));
