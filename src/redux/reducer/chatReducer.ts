// // import { ChatAction, ChatState, initialState } from "@/redux/types/chatTypes";

// // const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
// //   switch (action.type) {
// //     case "ADD_MESSAGE":
// //       return {
// //         ...state,
// //         conversation: {
// //           ...state.conversation,
// //           messages: [...state.conversation.messages, action.payload],
// //         },
// //       };
//     // case "ADD_MESSAGES":
//     //   return {
//     //     ...state,
//     //     conversation: {
//     //       ...state.conversation,
//     //       ...action.payload,
//     //       messages: [...state.conversation.messages, ...action.payload.messages], // Adăugăm mesajele noi
//     //     },
//     //   };
// //     case "RESET_MESSAGES":
// //       return { ...state, conversation: { ...state.conversation, messages: [] } };
// //     default:
// //       return state;
// //   }
// // };

// // export default chatReducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { ChatState, initialState } from "@/redux/types/chatTypes";
// import { ConversationMessage } from "@/features/conversations/types";

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     addMessage: (state, action: PayloadAction<ConversationMessage>) => {
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

// export const { addMessage, addMessages, resetMessages } = chatSlice.actions;
// export default chatSlice.reducer;
