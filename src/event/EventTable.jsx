import React from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
    Users,
    Pencil,
    Trash2,
} from "lucide-react";
import EventStatusSwitch from "./EventStatusSwitch";

export default function EventTable({
    events,
    onEdit,
    onDelete,
    onStatusChange
}) {
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (time) => {
        if (!time) return "-";

        const [hours, minutes] =
            time.split(":");

        const hour = Number(hours);

        const period =
            hour >= 12 ? "PM" : "AM";

        const formattedHour =
            hour % 12 || 12;

        return `${formattedHour}:${minutes} ${period}`;
    };

    if (events.length === 0) {
        return (
            <div
                className="
          border
          border-purple-900
          rounded-2xl
          p-12
          text-center
          bg-[#0f0f0f]
        "
            >
                <div className="text-5xl mb-4">
                    🎭
                </div>

                <h2 className="text-xl font-semibold">
                    No events yet
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                    Create your first event to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {events.map((event) => (
                <div
                    key={event._id}
                    className="
            bg-[#0f0f0f]
            border
            border-purple-900
            rounded-2xl
            p-5
            hover:border-purple-600
            transition
          "
                >

                    {/* ======================= */}
                    {/* EVENT HEADER */}
                    {/* ======================= */}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {event.eventName}
                            </h2>

                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">

                                <span className="flex items-center gap-1">
                                    <CalendarDays className="w-4 h-4 text-purple-400" />

                                    {formatDate(event.dateofEvent)}
                                </span>

                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-pink-400" />

                                    {formatTime(event.fromTime)}
                                    {" - "}
                                    {formatTime(event.toTime)}
                                </span>

                            </div>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex gap-2">

                            <button
                                onClick={() => onEdit(event)}
                                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-purple-700
                  text-purple-400
                  hover:bg-purple-900/30
                "
                            >
                                <Pencil className="w-4 h-4" />

                                Edit
                            </button>

                            <button
                                onClick={() => onDelete(event)}
                                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-red-900
                  text-red-400
                  hover:bg-red-900/20
                "
                            >
                                <Trash2 className="w-4 h-4" />

                                Delete
                            </button>

                        </div>
                    </div>

                    {/* ======================= */}
                    {/* DETAILS */}
                    {/* ======================= */}

                    <div className="mt-5 lg:flex flex flex-col justify-between gap-4">

                        {/* LOCATION */}

                        <div className="flex items-start gap-3">

                            <MapPin className="w-5 h-5 text-red-400 mt-0.5" />

                            <div>
                                <p className="text-xs text-gray-500">
                                    Location
                                </p>

                                <p className="text-sm text-gray-300">
                                    {event.location}
                                </p>

                                {event.locationLink && (
                                    <a
                                        href={event.locationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            text-xs
                                            text-red-400
                                            underline
                                            "
                                    >
                                        Open Maps
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* REGISTRATION */}

                        <div className="flex items-start gap-3">

                            <Users className="w-5 h-5 text-cyan-400 mt-0.5" />

                            <div>
                                <p className="text-xs text-gray-500">
                                    Registrations Count
                                </p>

                                <p className="text-sm text-gray-300">
                                    {event.registrationCount}
                                </p>
                            </div>
                        </div>
                        <EventStatusSwitch
                            event={event}
                            onStatusChange={onStatusChange}
                        />


                    </div>

                    {/* ======================= */}
                    {/* PRICES */}
                    {/* ======================= */}

                    <div className="grid grid-cols-3 gap-3 mt-5">

                        <div
                            className="
                bg-[#181818]
                rounded-xl
                p-3
                text-center
              "
                        >
                            <p className="text-xs text-blue-400">
                                👨 Male
                            </p>

                            <p className="text-lg font-bold mt-1 text-white ">
                                ₹{event.malePrice}
                            </p>
                        </div>

                        <div
                            className="
                bg-[#181818]
                rounded-xl
                p-3
                text-center
              "
                        >
                            <p className="text-xs text-pink-400">
                                👩 Female
                            </p>

                            <p className="text-lg font-bold mt-1 text-white">
                                ₹{event.femalePrice}
                            </p>
                        </div>

                        <div
                            className="
                bg-[#181818]
                rounded-xl
                p-3
                text-center
              "
                        >
                            <p className="text-xs text-green-400">
                                👫 Couple
                            </p>

                            <p className="text-lg font-bold mt-1 text-white">
                                ₹{event.twoPeoplePrice}
                            </p>
                        </div>

                    </div>

                    {/* DEADLINE */}

                    <div className="mt-4 pt-4 border-t border-gray-800">

                        <p className="text-xs text-gray-500">
                            Registration Deadline
                        </p>

                        <p className="text-sm text-yellow-400 mt-1">
                            {new Date(
                                event.deadline
                            ).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </p>

                    </div>

                </div>
            ))}

        </div>
    );
}
