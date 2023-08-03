import { sleep } from "./time";

export const tryAgain = async (fun, max, timeout = 2500) => {
  try {
    const info = await fun();
    return info;
  } catch {
    if (max > 1) {
      await sleep(timeout);
      return tryAgain(fun, max - 1);
    }
  }
};

export const filter = (value, is, isnt) => {
  let filtered = !!is;
  if (Array.isArray(is)) {
    is.forEach((isA) => {
      if (value.includes(isA)) {
        filtered = false;
      }
    });
  } else if (is && is.length > 0 && value.includes(is)) {
    filtered = false;
  }
  if (Array.isArray(isnt)) {
    isnt.forEach((isntA) => {
      if (value.includes(isntA)) {
        filtered = true;
      }
    });
  } else if (isnt && isnt.length > 0 && value.includes(isnt)) {
    filtered = true;
  }
  return !filtered;
};
