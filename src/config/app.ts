export const API_URL = import.meta.env.VITE_API_URL;
export const API_SUFFIX = "/api/md/";

export const TOKEN_TYPE = "Bearer";
export const REQUEST_HEADER_AUTH_KEY = "Authorization";

export const SESSION_TOKEN_KEY = "session:token";
export const SESSION_USER_KEY = "session:user";
export const FIREBASE_TOKEN_KEY = "firebase:token";
export const FIREBASE_PERMISSION = "notification:firebase";

export const FIREBASE_VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY + "";
export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY + "";
export const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN + "";
export const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID + "";
export const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET + "";
export const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID + "";
export const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID + "";

export const SOCKET_PUSHER_KEY = import.meta.env.VITE_SOCKET_PUSHER_KEY + "";
export const SOCKET_PUSHER_CLUSTER = import.meta.env.VITE_SOCKET_PUSHER_CLUSTER + "";

export const SOCKET_PUSHER_EVENT_RECEIVE = "receive-message-patient";
export const SOCKET_PUSHER_CHANNEL_DOCTOR = "chat-doctor-to-patient-";
export const SOCKET_PUSHER_CHANNEL_PATIENT = "chat-patient-to-doctor-";
export const SOCKET_PUSHER_CHANNEL_LIST_CHATS = "chat-list-";
export const SOCKET_PUSHER_EVENT_LIST_CHATS = "update-chat-list";

export const SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_CHAT = "chat-doctor-";
export const SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_CHAT = "doctor-messages";

export const SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_LIST = "doctors-message-list-";
export const SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_LIST = "update-doctors-message-list";

export const SOCKET_PUSHER_CHANNEL_DASHBOARD_PATIENTS_LIST = "dashboard-list-";
export const SOCKET_PUSHER_EVENT_DASHBOARD_PATIENTS_LIST = "update-chat-list";

export const SOCKET_PUSHER_CHANNEL_DASHBOARD_DOCTORS_LIST = "dashboard-doctors-message-list-";
export const SOCKET_PUSHER_EVENT_DASHBOARD_DOCTORS_LIST = "update-doctors-message-list";
