import { SessionUser } from "@/features/auth/types";
import { apiUpdateFCMToken } from "@/features/notification-firebase/api";
import { getMessaging, getToken } from "firebase/messaging";
import { FIREBASE_PERMISSION, FIREBASE_TOKEN_KEY, FIREBASE_VAPID_KEY } from "@/config/app";
import { firebaseApp } from "./api/config";

export const fetchToken = async (user: SessionUser | null) => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const getTokenFirebaseStorage = localStorage.getItem(FIREBASE_TOKEN_KEY);
      const permissionStorage = localStorage.getItem(FIREBASE_PERMISSION);
      if (permissionStorage || (!user && getTokenFirebaseStorage)) {
        return;
      }

      if (user) {
        if (!getTokenFirebaseStorage) {
          const token = await setTokenStorage();
          if (token) {
            await apiUpdateFCMToken(token);
            localStorage.setItem(FIREBASE_PERMISSION, JSON.stringify("true"));
            localStorage.removeItem(FIREBASE_TOKEN_KEY);
          } else {
            console.log("Notifications are not active");
          }
        } else if (getTokenFirebaseStorage) {
          await apiUpdateFCMToken(getTokenFirebaseStorage);
          localStorage.setItem(FIREBASE_PERMISSION, JSON.stringify("true"));
          localStorage.removeItem(FIREBASE_TOKEN_KEY);
        }
      } else if (!user) {
        if (!getTokenFirebaseStorage) {
          setTokenStorage();
          return;
        }
      }
    } catch (err) {
      console.log("An error occurred while retrieving token. ", err);
    }
  }
};
const setTokenStorage = async () => {
  const messaging = getMessaging(firebaseApp);
  return await Notification.requestPermission().then(async (permission) => {
    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: FIREBASE_VAPID_KEY,
      });
      if (currentToken) {
        localStorage.setItem(FIREBASE_TOKEN_KEY, JSON.stringify(currentToken));
        return currentToken;
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    } else {
      return false;
    }
  });
};
