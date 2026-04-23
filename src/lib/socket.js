import { socketURL } from "@/appConstants";
import { io } from "socket.io-client";

// Replace this with your backend's IP and port
const socket = io(socketURL, {
  transports: ['websocket'],
  autoConnect: false,
});

export const initializeSocket = (onNotificationCallback) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?._id) return;

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("register", user._id);

  socket.on("newRentNotification", (data) => {
    console.log("📦 New Rent Notification:", data);
    if (typeof onNotificationCallback === "function") {
      onNotificationCallback(data);
    }
  });
};

export default socket;
