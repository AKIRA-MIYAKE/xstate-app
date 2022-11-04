export const sleep: (msec: number) => Promise<void> = (msec) =>
  new Promise((resolve) => setTimeout(resolve, msec))
