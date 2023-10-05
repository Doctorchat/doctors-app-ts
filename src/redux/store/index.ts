// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // Definiți un slice folosind createSlice
// const chatSlice = createSlice({
//   name: "chat",
//   initialState: /* initialState */,
//   reducers: {
//     addMessage: (state, action: PayloadAction<string>) => {
//       state.conversation.messages.push(action.payload);
//     },
//     addMessages: (state, action: PayloadAction<any>) => {
//       // Actualizați starea aici folosind acțiunea primită
//     },
//     resetMessages: (state) => {
//       state.conversation.messages = [];
//     },
//   },
// });

// // Exportați reducerul și acțiunile din slice
// export const { addMessage, addMessages, resetMessages } = chatSlice.actions;
// export default chatSlice.reducer;