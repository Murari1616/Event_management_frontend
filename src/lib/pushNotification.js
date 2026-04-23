// src/lib/pushNotification.js
//@ts-nocheck
import { publicKey, socketURL } from "@/appConstants";


export const subscribeUserToPush = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.register("/serviceWorker.js");
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
            await existingSub.unsubscribe();
            console.log("🧹 Existing subscription cleared");
        }
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey), // Load from env
        });

        const user = JSON.parse(localStorage.getItem("user"));

        await fetch(`${socketURL}/subscribe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                subscription,
                userId: user._id,
            }),
        });

        console.log("✅ Push Subscription registered!");
    } else {
        console.warn("Push notifications are not supported in this browser.");
    }
};

// Utility to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = window.atob(base64);
    return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}
