//@ts-nocheck
self.addEventListener("push", (event) => {
  console.log("🔔 Push event received:", event);

  let data = {};
  try {
    data = event.data?.json() || {};
  } catch (err) {
    console.error("❌ Error parsing push event data:", err);
  }
  const title = data.title || "📢 New Notification";
  const options = {
    body: data.body || "You have a new update",
    icon: "/icons/icon-192x192.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
