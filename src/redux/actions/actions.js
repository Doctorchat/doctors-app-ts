// actions.js

export const addMessage = (message) => ({
  type: "ADD_MESSAGE",
  payload: message,
});

export const resetMessages = () => ({
  type: "RESET_MESSAGES",
});
