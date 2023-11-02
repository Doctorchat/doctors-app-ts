[![Doctors APP](https://github.com/Doctorchat/doctors-app-ts/actions/workflows/prod.yaml/badge.svg?branch=main)](https://github.com/Doctorchat/doctors-app-ts/actions/workflows/prod.yaml)
# 👨‍⚕️ Doctor's Cabinet 

## API ENV:

```
VITE_API_URL=
```

## Pusher ENV
```
VITE_SOCKET_PUSHER_KEY=
VITE_SOCKET_PUSHER_CLUSTER=
VITE_SOCKET_PUSHER_EVENT_RECEIVE=receive-message-patient
VITE_SOCKET_PUSHER_CHANNEL_DOCTOR=chat-doctor-to-patient-
VITE_SOCKET_PUSHER_CHANNEL_PATIENT=chat-patient-to-doctor-
VITE_SOCKET_PUSHER_CHANNEL_LIST_CHATS=chat-list-
VITE_SOCKET_PUSHER_EVENT_LIST_CHATS=update-chat-list
VITE_SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_CHAT=chat-doctor-
VITE_SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_CHAT=doctor-messages
VITE_SOCKET_PUSHER_CHANNEL_DOCTOR_DOCTORS_LIST=doctors-message-list-
VITE_SOCKET_PUSHER_EVENT_DOCTOR_DOCTORS_LIST=update-doctors-message-list
```

## Firebase ENV
```
VITE_FIREBASE_VAPID_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```




This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
