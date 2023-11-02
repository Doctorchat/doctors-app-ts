import { SessionUser } from "@/features/auth/types";
import { apiUpdateFCMToken } from "@/features/notification-firebase/api";
import { getMessaging, getToken } from "firebase/messaging";
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PERMISSION,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_TOKEN_KEY,
  FIREBASE_VAPID_KEY,
} from "@/config";
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
  console.log({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  });
  return await Notification.requestPermission().then(async (permission) => {
    console.log(permission);
    console.log(FIREBASE_VAPID_KEY);
    console.log(messaging);
    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: FIREBASE_VAPID_KEY,
      });
      console.log(FIREBASE_VAPID_KEY);
      console.log(currentToken);
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
