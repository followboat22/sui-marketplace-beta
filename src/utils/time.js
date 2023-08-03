const defaultTimeout = 10000;
export const sleep = (time) => new Promise((r) => setTimeout(r, time || defaultTimeout));