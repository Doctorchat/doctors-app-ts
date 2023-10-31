// const globalSubscriptions = {};

// export function addGlobalSubscription(channelName, event, callback) {
//   const key = `${channelName}:${event}`;
//   if (!globalSubscriptions[key]) {
//     globalSubscriptions[key] = [];
//   }
//   globalSubscriptions[key].push(callback);
// }

// export function removeGlobalSubscription(channelName, event, callback) {
//   const key = `${channelName}:${event}`;
//   if (globalSubscriptions[key]) {
//     globalSubscriptions[key] = globalSubscriptions[key].filter((cb) => cb !== callback);
//   }
// }
