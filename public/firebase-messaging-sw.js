// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: "doctorchat-push.firebaseapp.com",
  projectId: "doctorchat-push",
  storageBucket: "doctorchat-push.appspot.com",
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  appId: `${process.env.REACT_FIREBASE_APP_ID}`,
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(payload);
  const { title, body } = payload.data;
  const parsedBody = JSON.parse(body); // Parse the JSON string
  if (parsedBody && parsedBody.content) {
    self.registration.showNotification(title, {
      body: parsedBody.content,
      icon: "./assets/companyIcon.png",
      data: parseInt(parsedBody.chat_id),
    });
  } else {
    console.error("Invalid or missing 'content' in payload data:", payload);
  }
});
messaging.setBackgroundMessageHandler(function (payload) {
  console.log(payload);
  const { title, body } = payload.data;
  const parsedBody = JSON.parse(body);
  if (parsedBody && parsedBody.content) {
    return self.registration.showNotification(title, {
      body: parsedBody.content,
      icon: "./assets/companyIcon.png",
      tag: parsedBody.isPatientDoctorChat ? "patientId=" : "doctorId=",
      data: parseInt(parsedBody.chat_id),
    });
  } else {
    console.error("Invalid or missing 'content' in payload data:", payload);
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log(event)
  event.notification.close();
  const notificationChatId = event.notification.data;
  const notificatioBody = event.notification.body;
  const notificationTypeChat = event.notification.tag;
  if (notificatioBody) {
    try {
      if (notificationChatId) {
        const url =
          this.location.origin +
          "/conversations?" +
          notificationTypeChat +
          notificationChatId +
          "&anonymous=false";
        event.waitUntil(
          // eslint-disable-next-line no-undef
          clients.openWindow(url).then(() => {
            // Do something after the new tab is opened, if needed
            console.log("New tab opened with URL:", url);
          })
        );
      } else {
        console.error("chat_id is missing in the notification data:", notificationChatId);
      }
    } catch (error) {
      console.error("Error parsing JSON from body:", error);
    }
  } else {
    console.error("body is missing in the notification data:", event.notification);
  }
});
