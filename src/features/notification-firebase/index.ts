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
} from "@/config/app";
import { SessionUser } from "@/features/auth/types";
import { apiUpdateFCMToken } from "@/features/notification-firebase/api";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, Messaging, onMessage } from "firebase/messaging";
import { firebaseConfigTypes, tokenOptions } from "./types";

const tokenOptions: tokenOptions = {
  vapidKey: FIREBASE_VAPID_KEY,
};

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
} as firebaseConfigTypes;

const firebaseApp = initializeApp(firebaseConfig) as FirebaseApp;
const messaging = getMessaging(firebaseApp) as Messaging;

const requestPermissionNotification = (getTokenFirebase: string, permission: string | null) => {
  if ("Notification" in window && !permission) {
    Notification.requestPermission().then(async (permission) => {
      permission === "granted" && (await apiUpdateFCMToken(getTokenFirebase));
      localStorage.setItem(FIREBASE_PERMISSION, JSON.stringify(permission));
      localStorage.removeItem(FIREBASE_TOKEN_KEY);
    });
  }
};

export const fetchToken = async (user: SessionUser | null) => {
  try {
    const getTokenFirebaseStorage = localStorage.getItem(FIREBASE_TOKEN_KEY);
    const permission = localStorage.getItem(FIREBASE_PERMISSION);

    if (!getTokenFirebaseStorage && !user && !permission) {
      const getTokenFirebase = await getToken(messaging, tokenOptions);
      localStorage.setItem(FIREBASE_TOKEN_KEY, JSON.stringify(getTokenFirebase));
    }
    if (user) {
      if (!getTokenFirebaseStorage) {
        const getTokenFirebase = await getToken(messaging, tokenOptions);
        requestPermissionNotification(getTokenFirebase, permission);
      } else {
        requestPermissionNotification(getTokenFirebaseStorage, permission);
      }
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
