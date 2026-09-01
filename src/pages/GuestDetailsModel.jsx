import React from "react";

export default function UserDetailsModal({
    open,
    user,
    onClose,
}) {
    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 py-6 my-10">
            <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto custom-horizontal-scroll rounded-xl bg-gray-900 border border-gray-700 p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-purple-400">
                        👤 User Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Name</p>
                        <p className="text-white font-semibold">
                            {user.name || "-"}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Age</p>
                        <p className="text-white">
                            {user.age || "-"}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Gender</p>
                        <p className="text-white">
                            {user.gender || "-"}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Phone</p>
                        <p className="text-white">
                            {user.phoneNumber || "-"}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">
                            Instagram
                        </p>

                        {user.instaId ? (
                            <a
                                href={`https://instagram.com/${user.instaId.replace(
                                    "@",
                                    ""
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 underline"
                            >
                                {user.instaId}
                            </a>
                        ) : (
                            <p className="text-white">-</p>
                        )}
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Place</p>
                        <p className="text-white">
                            {user.place || "-"}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Talent</p>
                        <p className="text-white">
                            {user.talent || "-"}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Event</p>
                        <p className="text-white">
                            {user.eventId?.eventName || "Previous Events"}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 sm:col-span-2">
                        <p className="text-gray-400 text-xs mb-1">
                            Description
                        </p>

                        <p className="text-white whitespace-pre-wrap break-words">
                            {user.description || "-"}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">
                            Payment Status
                        </p>

                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.approve
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                                }`}
                        >
                            {user.approve ? "Paid / Approved" : "Not Paid"}
                        </span>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">
                            Registered On
                        </p>

                        <p className="text-white">
                            {user.createdAt
                                ? new Date(user.createdAt).toLocaleString("en-IN")
                                : "-"}
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
