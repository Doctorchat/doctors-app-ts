import React from "react";
import { Link } from "react-router-dom";

import { ArrowUpTrayIcon, DocumentTextIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
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

export const useCloseConversation = createWithEqualityFn<UploadFileStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);

export const CloseConversation: React.FC = () => {
  const { t } = useTranslation();
  const { chatConversation } = useSelector((store: any) => ({
    chatConversation: store.chatContent?.conversation,
  }));
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const open = useCloseConversation((state) => state.open);
  const setOpen = useCloseConversation((state) => state.setOpen);

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
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md gap-6"
      >
        <DialogHeader>
          <DialogTitle>{t("conversations:close_conversation:title")}</DialogTitle>
          <DialogDescription>{t("conversations:close_conversation:description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
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
              {t("common:confirm")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
