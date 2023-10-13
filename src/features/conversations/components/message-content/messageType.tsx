import PropTypes from "prop-types";
import React from "react";
import { MessageMeet } from "./messageMeet";
import { ConversationMessage } from "../../types";

interface MessageTypeProps {
  type?: string;
  message: ConversationMessage;
}

export const MessageType: React.FC<MessageTypeProps> = ({ type, message }) => {
  if (type === "meet") return <MessageMeet message={message} />;

  return null;
};
