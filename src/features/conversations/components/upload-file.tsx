import React from "react";
import { Link } from "react-router-dom";

import { ArrowUpTrayIcon, DocumentTextIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { useConversationLayoutStore } from "./layout";
import { apiSendFile } from "../api";
import { useConversation } from "../hooks";

import { Button, Dialog, DialogContent, DialogFooter } from "@/components/ui";
import { useToast } from "@/hooks";
import { bytesToSize, cn, getApiErrorMessages, validateFile } from "@/utils";
import { useSelector } from "react-redux";

export const ALLOWED_FILE_TYPES = [
  ".png",
  ".jpeg",
  ".jpg",
  ".bmp",
  ".doc",
  ".docx",
  ".pdf",
  ".xlsx",
  ".xls",
  ".mov",
  ".avi",
  ".mp4",
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

interface DropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  error: string | null;
}

const Dropzone: React.FC<DropzoneProps> = ({ error, className, ...props }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-neutral-500 bg-neutral-50 px-4 py-10",
        "active:border-neutral-600 active:bg-neutral-200 md:hover:border-neutral-600 md:hover:bg-neutral-200",
        "transition-colors duration-200 ease-in-out",
        { "border-none bg-red-50": error },
        className
      )}
      {...props}
    >
      {error === null && (
        <>
          <ArrowUpTrayIcon className="h-9 w-9" />
          <p className="mt-4 select-none text-sm font-medium">
            {t("conversations:click_to_select_file")}
          </p>
        </>
      )}
      {Boolean(error) && (
        <>
          <NoSymbolIcon className="h-10 w-10 text-red-600" />
          <h3 className="mt-4 select-none font-medium text-red-600">
            {t("validations:invalid_file")}
          </h3>
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
        </>
      )}
    </div>
  );
};

interface UploadFileStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useUploadFileStore = createWithEqualityFn<UploadFileStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);

export const UploadFile: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useConversation();
  const { chatConversation } = useSelector((store: any) => ({
    chatConversation: store.chatContent?.conversation,
  }));
  const { toast } = useToast();

  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const queryClient = useQueryClient();
  const open = useUploadFileStore((state) => state.open);
  const setOpen = useUploadFileStore((state) => state.setOpen);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSending, setIsSending] = React.useState(false);

  const closeWithTransition = () => {
    setOpen(false);
    setTimeout(() => {
      setFile(null);
      setError(null);
      if (inputRef.current) inputRef.current.value = "";
    }, 300);
  };

  const onUploadFileHandler = async () => {
    if (file && chatConversation.chat_id) {
      setIsSending(true);
      try {
        await apiSendFile({
          chat_id: chatConversation.chat_id,
          file,
        });
        await Promise.allSettled([
          queryClient.invalidateQueries(["conversations", conversationsType]),
          queryClient.invalidateQueries(["conversation", id]),
        ]);
        closeWithTransition();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "common:something_went_wrong",
          description: getApiErrorMessages(error),
        });
      } finally {
        setIsSending(false);
      }
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const fileError = validateFile(file, {
        extensions: ALLOWED_FILE_TYPES,
        size: MAX_FILE_SIZE,
      });

      if (fileError) {
        if (fileError.key === "file_size_too_big") {
          setError(t("validations:file_size_too_big", { size: fileError.size }));
        } else if (fileError.key === "file_type_not_allowed") {
          setError(t("validations:file_type_not_allowed", { extensions: fileError.extensions }));
        } else {
          setError(t("common:unknown_error"));
        }
        setFile(null);
      } else {
        setError(null);
        setFile(file);
      }
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="pointer-events-none hidden"
        accept={ALLOWED_FILE_TYPES.join(", ")}
        multiple={false}
        onChange={onInputChange}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="max-w-md gap-6"
        >
          {file === null && <Dropzone error={error} onClick={() => inputRef.current?.click()} />}

          {file && (
            <>
              {file.type.includes("image") && (
                <div className="flex items-center justify-center overflow-hidden rounded-md bg-neutral-50">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="img"
                    className="aspect-square h-full w-full object-contain"
                  />
                </div>
              )}

              {file.type.includes("image") === false && (
                <div className="flex items-center overflow-hidden">
                  <div className="flex h-14 w-14 items-center justify-center rounded-md bg-rose-100">
                    <DocumentTextIcon className="h-8 w-8 text-rose-500" />
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden">
                    <Link
                      to={URL.createObjectURL(file)}
                      target="_blank"
                      rel="noreferrer"
                      className="active:underline active:underline-offset-2 md:hover:underline md:hover:underline-offset-2"
                    >
                      <h4 className="flex overflow-hidden font-medium text-typography-primary">
                        <span className="truncate">
                          {file.name.split(".").slice(0, -1).join(".")}
                        </span>
                        <span className="whitespace-nowrap">.{file.name.split(".").pop()}</span>
                      </h4>
                    </Link>
                    <p className="mt-px">{bytesToSize(file.size)}</p>
                  </div>
                </div>
              )}
            </>
          )}

          <DialogFooter className={cn({ "sm:justify-between": Boolean(file) })}>
            {file && (
              <Button
                className="w-full sm:w-auto"
                disabled={isSending}
                onClick={() => inputRef.current?.click()}
              >
                {t("conversations:select_different_file")}
              </Button>
            )}
            <div className="flex items-center">
              <Button
                variant="outline"
                className="w-full"
                disabled={isSending}
                onClick={() => setOpen(false)}
              >
                {t("common:cancel")}
              </Button>
              <Button className="ml-2 w-full" disabled={isSending} onClick={onUploadFileHandler}>
                {t("common:upload")}
                {isSending && "..."}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
