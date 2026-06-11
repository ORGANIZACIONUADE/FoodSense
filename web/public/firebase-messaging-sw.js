importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCRalCf85TZ2fiLR9Qt6jzfGFCPtw-yP-c",
  authDomain: "foodsense-c426d.firebaseapp.com",
  projectId: "foodsense-c426d",
  storageBucket: "foodsense-c426d.firebasestorage.app",
  messagingSenderId: "456940297073",
  appId: "1:456940297073:web:01d91bef7aa4090ec774d0",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "FoodSense";
  const options = {
    body: payload.notification?.body ?? "Tenés una nueva alerta de tu despensa.",
    icon: "/foodsense-icon.png",
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});
