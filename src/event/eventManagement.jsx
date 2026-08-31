import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { BASE_URL } from "@/appConstants";
import { useToast } from "@/hooks/use-toast";

import AddEventModal from "./EventModal";
import EventTable from "./EventTable";
import EventModal from "./EventModal";

export default function EventManagement() {
    const { toast } = useToast();

    const [events, setEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);


    const [loading, setLoading] =
        useState(true);

    const [showAddModal, setShowAddModal] =
        useState(false);

    /*
     * ================================
     * FETCH EVENTS
     * ================================
     */

    const fetchEvents = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `${BASE_URL}event/getAll`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result?.message ||
                    "Failed to fetch events"
                );
            }

            setEvents(result.data || []);

        } catch (error) {
            console.error(error);

            toast({
                title: "Error",
                variant: "destructive",
                description:
                    error.message ||
                    "Failed to fetch events",
            });

        } finally {
            setLoading(false);
        }
    };

    /*
     * Fetch events when page loads
     */

    useEffect(() => {
        fetchEvents();
    }, [showEventModal]);

    /*
     * ================================
     * EDIT
     * ================================
     */

    const handleAdd = () => {
        setSelectedEvent(null);
        setShowEventModal(true);
    };


    const handleEdit = (event) => {
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    const handleStatusChange = (updatedEvent) => {
        setEvents((prev) =>
            prev.map((event) =>
                event._id === updatedEvent._id
                    ? updatedEvent
                    : event
            )
        );
    };

    const handleDelete = async (event) => {
        console.log("EVENTS",event)
        const confirmed = window.confirm(
            `Are you sure you want to delete "${event.eventName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const res = await fetch(
                `${BASE_URL}event/delete/${event._id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result?.message || "Failed to delete event"
                );
            }

            setEvents((prev) =>
                prev.filter(
                    (item) => item._id !== event._id
                )
            );

            toast({
                title: "Success",
                description: "Event deleted successfully.",
            });

        } catch (error) {
            console.error("Delete event error:", error);

            toast({
                title: "Error",
                variant: "destructive",
                description:
                    error.message || "Failed to delete event",
            });
        }
    }


    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">

            <div className="max-w-6xl mx-auto">

                {/* ============================= */}
                {/* PAGE HEADER */}
                {/* ============================= */}

                <div
                    className="
            flex
            flex-col
            sm:flex-row
            justify-between
            sm:items-center
            gap-4
            mb-8
          "
                >

                    <div>
                        <p className="text-sm text-purple-400">
                            ✨ Manage your events
                        </p>

                        <h1 className="text-3xl font-bold">
                            Events
                        </h1>

                        <p className="text-gray-500 text-sm mt-1">
                            Create and manage your upcoming
                            events.
                        </p>
                    </div>

                    {/* ADD EVENT */}

                    <button
                        onClick={handleAdd}
                        className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-gradient-to-r
              from-purple-600
              to-pink-500
              font-semibold
              hover:opacity-90
              transition
            "
                    >
                        <Plus className="w-5 h-5" />

                        Add Event
                    </button>

                </div>

                {/* ============================= */}
                {/* EVENT COUNT */}
                {/* ============================= */}

                <div className="mb-5">

                    <p className="text-sm text-gray-500">
                        {events.length}{" "}
                        {events.length === 1
                            ? "event"
                            : "events"}{" "}
                        found
                    </p>

                </div>

                {/* ============================= */}
                {/* LOADING */}
                {/* ============================= */}

                {loading ? (
                    <div
                        className="
              text-center
              py-20
              text-gray-400
            "
                    >
                        Loading events... ✨
                    </div>
                ) : (
                    <EventTable
                        events={events}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                    />
                )}

            </div>

            {/* ============================= */}
            {/* ADD EVENT MODAL */}
            {/* ============================= */}

            <EventModal
                open={showEventModal}
                event={selectedEvent}
                onClose={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                }}
                onEventSaved={(savedEvent, action) => {
                    if (action === "create") {
                        setEvents((prev) => [
                            savedEvent,
                            ...prev,
                        ]);
                    }

                    if (action === "update") {
                        setEvents((prev) =>
                            prev.map((item) =>
                                item._id === savedEvent._id
                                    ? savedEvent
                                    : item
                            )
                        );
                    }
                }}
            />


        </div>
    );
}
