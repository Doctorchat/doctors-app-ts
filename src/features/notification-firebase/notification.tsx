import { useState } from "react";
import { onMessageListener } from ".";
import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast";

export const Notification = () => {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });

  onMessageListener()
    .then((payload: any) => {
      setShow(true);
      setNotification({ title: payload.notification.title, body: payload.notification.body });
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));

  return (
    <div className="App">
      <Toast open={show}>
        <div className="grid gap-1">
          {notification.title && <ToastTitle>{notification.title}</ToastTitle>}
          {notification.body && <ToastDescription>{notification.body}</ToastDescription>}
        </div>

        <ToastClose />
      </Toast>
    </div>
  );
};
