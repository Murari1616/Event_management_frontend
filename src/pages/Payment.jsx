import React from "react";

export default function PaymentScreen() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0f0f0f] border border-purple-700 rounded-2xl shadow-xl p-6 text-center space-y-6">
        
        {/* 🎉 Success Message */}
        <h1 className="text-3xl font-bold text-green-400">
          Registration Successful 🎉
        </h1>

        <p className="text-gray-300 text-sm leading-relaxed">
          You're officially in! 💫 <br />
          Get ready for an amazing experience filled with fun, vibes, and new connections ✨
        </p>

        <p className="text-purple-400 font-medium">
          See you at the event 💜
        </p>

        {/* 📲 WhatsApp Join */}
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            Join our WhatsApp group for updates and event details 👇
          </p>

          <a
            href="https://chat.whatsapp.com/JITtkasgtqFKbdAbHIWbNB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 font-semibold underline"
          >
            👉 Join the WhatsApp Group
          </a>
        </div>

      </div>
    </div>
  );
}
