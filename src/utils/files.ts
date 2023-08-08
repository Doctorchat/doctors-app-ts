import { round } from "./formatters";

interface FileSizeValidationError {
  key: "file_size_too_big";
  size: number;
}

interface FileTypeValidationError {
  key: "file_type_not_allowed";
  extensions: string;
}

export type FileValidationError = FileSizeValidationError | FileTypeValidationError;

export const validateFile = (
  file: File,
  options: {
    /** The max file size in MB. */
    size?: number;
    extensions?: string[];
  },
): FileValidationError | undefined => {
  if (file) {
    if (options.size && file.size > options.size * 1024 * 1024) {
      return {
        key: "file_size_too_big",
        size: options.size,
      };
    }

    if (options.extensions) {
      const fileExtension = `.${file.name.split(".").pop() ?? ""}`;

      if (options.extensions.indexOf(fileExtension) === -1) {
        return {
          key: "file_type_not_allowed",
          extensions: options.extensions.join(", "),
        };
      }
    }
  }
};

export const bytesToSize = (bytes: number) => {
  if (bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};
