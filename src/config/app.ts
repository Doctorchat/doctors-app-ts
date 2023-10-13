export const API_URL = import.meta.env.VITE_API_URL;
export const API_SUFFIX = "/api/md/";

export const TOKEN_TYPE = "Bearer";
export const REQUEST_HEADER_AUTH_KEY = "Authorization";

export const SESSION_TOKEN_KEY = "session:token";
export const SESSION_USER_KEY = "session:user";

export const FIREBASE_VAPID_KEY =
  "BLa90qVXOeCto_aep2nFFSTu9wpZP0vdgKUc1OkiALBVVHH909zIrmSaqJ4CNEyS7eu7VIX5RbNfu8lR-wA8EAc";
export const FIREBASE_API_KEY = "AIzaSyBJ1I8aqW1b7i6eaic6pUMdCk8ePVPfzxU";
export const FIREBASE_AUTH_DOMAIN = "doctorchat-push.firebaseapp.com";
export const FIREBASE_PROJECT_ID = "doctorchat-push";
export const FIREBASE_STORAGE_BUCKET = "doctorchat-push.appspot.com";
export const FIREBASE_MESSAGING_SENDER_ID = "373860489948";
export const FIREBASE_APP_ID = "1:373860489948:web:138a8c02fb772e3ba87219";
export const FIREBASE_TOKEN_KEY = "firebase:token";
export const FIREBASE_PERMISSION = "notificationPermission";

export const SOCKET_PUSHER_KEY = "19727a34d355626f8a23";
export const SOCKET_PUSHER_CLUSTER = "eu";
export const SOCKET_PUSHER_EVENT_RECEIVE = "receive-message-patient";
export const SOCKET_PUSHER_CHANNEL_DOCTOR = "chat-doctor-to-patient-";
export const SOCKET_PUSHER_CHANNEL_PATIENT = "chat-patient-to-doctor-";
export const SOCKET_PUSHER_CHANNEL_LIST_CHATS = "chat-list-";
export const SOCKET_PUSHER_EVENT_LIST_CHATS = "update-chat-list";

export const SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_CHAT = "chat-doctor-";
export const SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_CHAT = "doctor-messages";

export const SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_LIST = "doctors-message-list-";
export const SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_LIST = "update-doctors-message-list";
