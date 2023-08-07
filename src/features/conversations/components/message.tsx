import React from "react";

import { format } from "date-fns";

import { cn } from "@/utils";

interface MessageContextValue {
  align: "left" | "right";
}

const MessageContext = React.createContext({} as MessageContextValue);

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  align: "left" | "right";
}

export const Message: React.FC<MessageProps> = ({ align, className, children, ...props }) => {
  return (
    <MessageContext.Provider value={{ align }}>
      <div
        className={cn(
          "flex flex-col space-y-1",
          { "items-start": align === "left" },
          { "items-end": align === "right" },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </MessageContext.Provider>
  );
};

export interface MessageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  timestamp: string;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({
  title,
  timestamp,
  className,
  ...props
}) => {
  const { align } = React.useContext(MessageContext);

  return (
    <div
      className={cn(
        "flex w-fit",
        { "pl-1": align === "left" },
        { "pr-1": align === "right" },
        className,
      )}
      {...props}
    >
      <h3 className="text-xs font-medium text-typography-primary">
        {title},{" "}
        <time dateTime={timestamp} className="text-typography-secondary">
          {format(new Date(timestamp), "HH:mm")}
        </time>
      </h3>
    </div>
  );
};

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ className, children, ...props }) => {
  const { align } = React.useContext(MessageContext);

  return (
    <div
      className={cn(
        "flex max-w-[min(90%,480px)] flex-col rounded-2xl border border-neutral-200 bg-white p-2 text-black shadow-sm",
        { "rounded-tl-md": align === "left" },
        { "rounded-tr-md": align === "right" },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface MessageBubbleText extends React.HTMLAttributes<HTMLParagraphElement> {}

export const MessageBubbleText: React.FC<MessageBubbleText> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p className={cn("whitespace-pre-wrap break-words", className)} {...props}>
      {children}
    </p>
  );
};
