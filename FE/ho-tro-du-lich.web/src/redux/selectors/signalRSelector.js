export const getSignalR = (url, eventName) => (store) => {
  if (store.signalRSlice[url] && store.signalRSlice[url][eventName]) {
    return store.signalRSlice[url][eventName];
  } else {
    return null;
  }
};
