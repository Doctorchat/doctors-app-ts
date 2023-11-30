import { ButtonNotification, INotifications, ITypesOfButton, LinkNotification } from "../types";

export const notificationDescription = (data: INotifications) => {
  switch (data?.type) {
    case "new_ticket":
      return data.isMeet
        ? { text: "type_new_ticket_video", data: { user_name: data.data.user_name } }
        : { text: "type_new_ticket_chat", data: { user_name: data.data.user_name } };

    case "new_referral":
      return { text: "type_new_referral", data: { user_name: data.data.user_name } };

    case "new_referral_revenue":
      return {
        text: "type_new_referral_revenue",
        data: {
          amount: data.amount,
          currency: data.currency,
          user_name: data.data.user_name,
        },
      };

    case "new_review":
      return data.like
        ? {
            text: "type_new_review_like",
            data: {
              user_name: data.data.user_name,
            },
          }
        : {
            text: "type_new_review_dislike",
            data: {
              user_name: data.data.user_name,
            },
          };

    case "chat_archived":
      return {
        text: "type_chat_archived",
        data: {
          chat_id: data.chat_id,
        },
      };

    case "reset_password":
      return {
        text: "type_reset_password",
      };

    case "invite_to_chat":
      return {
        text: "type_invite_to_chat",
        data: { user_name: data.data.user_name },
      };

    case "info" || "info_with_link" || "note":
      return "";

    default:
      return "";
  }
};

export const typeEmptyContent = ["info", "info_with_link", "note"];
export const isLinkChatId = ["new_ticket", "chat_archived", "invite_to_chat"];

export const isButtonNotification = {
  new_ticket: true,
  new_referral_revenue: false,
  new_referral: false,
  new_review: true,
  chat_archived: true,
  reset_password: false,
  invite_to_chat: true,
  info: false,
  info_with_link: true,
  note: false,
} as ButtonNotification;

export const isLinkNotification = {
  new_ticket: { isPartialLink: true, link: "/conversations?patientId=" },
  new_review: { isButton: true, isPartialLink: true, link: "/reviews" },
  chat_archived: { isButton: true, isPartialLink: true, link: "/conversations?patientId=" },
  invite_to_chat: { isButton: true, isPartialLink: true, link: "/conversations?patientId=" },
  info_with_link: { isButton: true, isPartialLink: false },
  new_referral_revenue: { isButton: false, isPartialLink: false },
  new_referral: { isButton: false, isPartialLink: false },
  reset_password: { isButton: false, isPartialLink: false },
  note: { isButton: false, isPartialLink: false },
  info: { isButton: false, isPartialLink: false },
} as LinkNotification;
