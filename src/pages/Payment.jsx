import React from "react";
import QR from "../assets/images/payment.jpeg"; // 👈 replace with your QR image

export default function PaymentScreen() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0f0f0f] border border-purple-700 rounded-2xl shadow-xl p-6 space-y-6 text-center">
        {/* 🎯 Title */}
        <h1 className="text-2xl font-bold text-purple-400">
          Complete Your Registration 💫
        </h1>

        {/* 📷 QR Code */}
        <div className="flex justify-center">
          <img
            src={QR}
            alt="payment-qr"
            className="w-64 h-64 object-contain rounded-lg border border-gray-700"
          />
        </div>

        {/* 💳 Payment Name */}
        <p className="text-sm text-gray-300">
          <span className="text-purple-400 font-semibold">Payment Name:</span>{" "}
          Devarakonda Sri Laxmi Durga
        </p>

        {/* 📢 Instructions */}
        <div className="text-sm text-gray-300 space-y-3 leading-relaxed">
          <p className="text-yellow-300 font-medium">Almost there! 🥳</p>

          <p className="text-gray-100">
            Your registration will only be confirmed once you pay and share the
            screenshot on WhatsApp:
          </p>

          <p className="text-green-400 font-semibold">📱 7382510118</p>

          <p className="text-gray-100">
            Join our WhatsApp group here for all the fun updates 👉
          </p>

          <a
            href="https://chat.whatsapp.com/JITtkasgtqFKbdAbHIWbNB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all"
          >
            https://chat.whatsapp.com/JITtkasgtqFKbdAbHIWbNB
          </a>

          <p className="text-pink-400 font-medium">
            See you soon for the best buddy-making time ever ✨
          </p>
        </div>

        {/* 🔘 Optional Button */}
        {/* <button
          onClick={() => window.open("https://wa.me/xxxxxxxxxx", "_blank")}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 font-semibold"
        >
          Send Screenshot on WhatsApp
        </button> */}
      </div>
    </div>
  );
}
