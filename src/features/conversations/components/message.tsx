import React from "react";
import { Link } from "react-router-dom";

import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

import { ConversationMessageFile } from "../types";

import { bytesToSize, cn } from "@/utils";

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
  title?: string;
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
      <h3 className="text-sm font-medium text-typography-primary">
        {title},{" "}
        <time dateTime={timestamp} className="text-typography-secondary">
          {format(new Date(timestamp), "HH:mm")}
        </time>
      </h3>
    </div>
  );
};

const variantClasses = {
  primary: "bg-white text-black",
  secondary: "bg-neutral-100 text-black",
};

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary";
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  const { align } = React.useContext(MessageContext);

  return (
    <div
      className={cn(
        "flex max-w-[min(90%,480px)] flex-col rounded-2xl border border-neutral-200 bg-white p-2 text-black shadow-sm",
        { "rounded-tl-md": align === "left" },
        { "rounded-tr-md": align === "right" },
        variantClasses[variant],
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

export interface MessageBubbleFileProps extends React.HTMLAttributes<HTMLDivElement> {
  file: ConversationMessageFile;
}

export const MessageBubbleFile: React.FC<MessageBubbleFileProps> = ({
  file,
  className,
  ...props
}) => {
  const name = file.name.split(".").slice(0, -1).join(".");
  const extension = file.name.split(".").pop();
  const isImage = file.type.startsWith("image/");

  return (
    <div className={cn("max-w-full", className)} {...props}>
      <div className="flex items-center overflow-hidden">
        <Link to={file.file_url} target="_blank" rel="noreferrer">
          <picture className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl">
            {isImage ? (
              <img src={file.file_url} alt="attachment" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                <DocumentTextIcon className="h-6 w-6 text-neutral-700" />
              </div>
            )}
          </picture>
        </Link>
        <div className="ml-2 flex-1 overflow-hidden">
          <Link
            to={file.file_url}
            target="_blank"
            rel="noreferrer"
            className="active:underline active:underline-offset-2 md:hover:underline md:hover:underline-offset-2"
          >
            <h4 className="flex overflow-hidden text-sm font-medium text-black">
              <span className="truncate">{name}</span>
              <span className="whitespace-nowrap">.{extension}</span>
            </h4>
          </Link>
          <p className="mt-px text-sm">{bytesToSize(Number(file.size))}</p>
        </div>
      </div>
    </div>
  );
};
