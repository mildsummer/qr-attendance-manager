const callbackArray = [];
let now = new Date();

const getNextDate = () => {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
};

let nextDate = getNextDate();

const check = () => {
  now = new Date();
  if (now > nextDate) {
    nextDate = getNextDate();
    callbackArray.forEach((callback) => {
      callback();
    });
  }
  window.setTimeout(check, nextDate - now);
};

export const addChangeDateListener = (callback) => {
  callbackArray.push(callback);
};

export const removeChangeDateListener = (callback) => {
  callbackArray.splice(callbackArray.indexOf(callback), 1);
};

setTimeout(check, nextDate - now);
