import { Button } from "@/components/ui";
import axiosInstance from "@/lib/axios";
import { validateFile } from "@/utils";
import { ArrowUpTrayIcon, UserIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { updateAvatar } from "../api";

const ALLOWED_FILE_TYPES = [".png", ".jpeg", ".jpg"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export const UserAvatar = ({ image }: { image: string }) => {
  const { t } = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    axiosInstance.get(image).catch((e) => {
      if (e) setError("error");
    });
  }, []);

  const content = () => {
    if (file) {
      return <img src={URL.createObjectURL(file)} alt="image" className="w-full rounded" />;
    }
    if (image && !error) {
      return <img src={image} alt="image" className="w-full rounded" />;
    }
    return <UserIcon className="w-full" />;
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
        updateAvatar(file);
      }
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mb-8 flex items-end">
      <div className="mr-10 max-h-48 w-48">{content()}</div>
      <input
        ref={inputRef}
        type="file"
        className="pointer-events-none hidden"
        accept={ALLOWED_FILE_TYPES.join(", ")}
        multiple={false}
        onChange={onInputChange}
      />
      <Button onClick={() => inputRef.current?.click()}>
        <span className="mr-2">{t("common:upload")}</span>&nbsp;
        <ArrowUpTrayIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
