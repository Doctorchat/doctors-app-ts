import { useCallback, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function useMessageFromValues(chatId: string | null) {
  const [value, setValues] = useLocalStorage<{ content: string }>(`message-form:${chatId}`, {
    content: "",
  });

  const MessageContent: string | null = localStorage.getItem(`message-form:${chatId}`) ?? "";

  let contentMessage = MessageContent && JSON.parse(MessageContent);

  const resetValues = useCallback(() => {
    setValues({
      content: "",
    });
    localStorage.removeItem(`message-form:${chatId}`);
  }, [chatId, setValues]);

  return {
    values: contentMessage ?? "",
    setValues: useCallback((v: any) => setValues((prev: any) => ({ ...prev, ...v })), [setValues]),
    resetValues,
  };
}
