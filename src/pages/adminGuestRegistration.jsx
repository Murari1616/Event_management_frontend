import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";

import { BASE_URL } from "@/appConstants";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
    name: z.string().min(2, "Name is required"),

    age: z.coerce
        .number()
        .min(1, "Age is required"),

    gender: z.enum(
        ["King", "Queen", "Couple"],
        {
            required_error: "Please select gender",
        }
    ),

    phoneNumber: z
        .string()
        .min(10, "Enter valid phone number"),

    instaId: z
        .string()
        .min(2, "Instagram ID is required"),

    place: z
        .string()
        .min(2, "Place is required"),

    talent: z
        .string()
        .min(2, "Talent is required"),

    description: z.string().optional(),
});

const ADMIN_CODE = "sri.laxmi#4110";

export default function AdminGuestRegistration() {
    const { toast } = useToast();

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const selectedGender = watch("gender");

    // ============================================
    // CHECK ADMIN ACCESS
    // ============================================

    const isAdmin = () => {
        const code = localStorage.getItem("code");

        return code === ADMIN_CODE;
    };

    // ============================================
    // FETCH EVENTS
    // ============================================

    const fetchEvents = async () => {
        try {
            setEventsLoading(true);

            const res = await fetch(
                `${BASE_URL}event/getAll`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
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

            const eventList = result.data || [];

            setEvents(eventList);

            // Automatically select first event
            if (eventList.length > 0) {
                setSelectedEvent(eventList[0]);
            }
        } catch (error) {
            console.error(
                "FETCH EVENTS ERROR:",
                error
            );

            toast({
                title: "Error",
                variant: "destructive",
                description:
                    error.message ||
                    "Failed to fetch events",
            });
        } finally {
            setEventsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // ============================================
    // EVENT CHANGE
    // ============================================

    const handleEventChange = (eventId) => {
        const event = events.find(
            (item) => item._id === eventId
        );

        setSelectedEvent(event || null);
    };

    // ============================================
    // CREATE GUEST
    // ============================================

    const onSubmit = async (data) => {
        // Check admin access before submitting
        const storedCode = localStorage.getItem("code");

        if (storedCode !== "sri.laxmi#4110") {
            toast({
                title: "Access Denied",
                variant: "destructive",
                description:
                    "Admin access is required to add guests.",
            });

            return;
        }

        if (!selectedEvent) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Please select an event.",
            });

            return;
        }
        const randomId = () => crypto.randomUUID();

        // Get amount from selected event based on gender
        const amount =
            data.gender === "King"
                ? selectedEvent.malePrice
                : data.gender === "Queen"
                    ? selectedEvent.femalePrice
                    : selectedEvent.twoPeoplePrice;

        try {
            setLoading(true);

            const res = await fetch(
                `${BASE_URL}guest/create`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        eventId: selectedEvent._id,

                        name: data.name,
                        age: data.age,
                        gender: data.gender,
                        phoneNumber: data.phoneNumber,
                        instaId: data.instaId,
                        place: data.place,
                        talent: data.talent,
                        description: data.description,

                        // Amount from event based on gender
                        amount: amount,

                        // Admin registration = no Razorpay payment
                        razorpayOrderId: `ADMIN_ORDER_${randomId()}`,
                        razorpayPaymentId: `ADMIN_PAYMENT_${randomId()}`,
                        razorpaySignature: `ADMIN_SIGNATURE_${randomId()}`,

                        approve: true,
                        payment: true,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result?.message ||
                    "Failed to create guest"
                );
            }

            toast({
                title: "Guest Added 🎉",
                description:
                    "Guest has been registered successfully.",
                variant: "success",
            });

            reset();

        } catch (error) {
            console.error(
                "CREATE GUEST ERROR:",
                error
            );

            toast({
                title: "Registration Failed",
                variant: "destructive",
                description:
                    error.message ||
                    "Unable to add guest.",
            });
        } finally {
            setLoading(false);
        }
    };


    // ============================================
    // LOADING
    // ============================================

    if (eventsLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />

                    <p className="text-purple-400">
                        Loading events...
                    </p>
                </div>
            </div>
        );
    }

    // ============================================
    // NO EVENTS
    // ============================================

    if (events.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="text-5xl mb-5">
                        🎭
                    </div>

                    <h1 className="text-2xl font-bold text-purple-400">
                        No Events Available
                    </h1>

                    <p className="text-gray-400 mt-3">
                        Please create an event first.
                    </p>
                </div>
            </div>
        );
    }

    // ============================================
    // MAIN PAGE
    // ============================================

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">

            <div className="max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0f0f0f] border border-purple-700">

                {/* ===================================== */}
                {/* HEADER */}
                {/* ===================================== */}

                <div className="p-6 border-b border-purple-900 bg-[#0b0b0b]">

                    <h1 className="text-2xl md:text-3xl font-bold text-purple-400">
                        Add Guest
                    </h1>

                    <p className="text-sm text-gray-400 mt-2">
                        Register a guest directly for an event.
                    </p>

                </div>

                {/* ===================================== */}
                {/* CONTENT */}
                {/* ===================================== */}

                <div className="p-6">

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >

                        {/* ================================= */}
                        {/* EVENT */}
                        {/* ================================= */}

                        {events.length > 1 && (
                            <div>

                                <label className="label">
                                    Select Event
                                </label>

                                <div className="relative">

                                    <select
                                        value={
                                            selectedEvent?._id || ""
                                        }
                                        onChange={(e) =>
                                            handleEventChange(
                                                e.target.value
                                            )
                                        }
                                        className="input-dark appearance-none pr-10"
                                    >

                                        {events.map((event) => (
                                            <option
                                                key={event._id}
                                                value={event._id}
                                                className="bg-[#1a1a1a]"
                                            >
                                                {event.eventName}
                                            </option>
                                        ))}

                                    </select>

                                    <ChevronDown
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"
                                        size={20}
                                    />

                                </div>

                            </div>
                        )}

                        {/* ================================= */}
                        {/* SINGLE EVENT */}
                        {/* ================================= */}

                        {events.length === 1 && (
                            <div className="border border-purple-900 rounded-lg p-3 bg-purple-950/20">

                                <p className="text-xs text-gray-400">
                                    Event
                                </p>

                                <p className="text-purple-300 font-semibold mt-1">
                                    {selectedEvent?.eventName}
                                </p>

                            </div>
                        )}

                        {/* ================================= */}
                        {/* NAME */}
                        {/* ================================= */}

                        <div>

                            <label className="label">
                                Name
                            </label>

                            <input
                                {...register("name")}
                                className="input-dark"
                                placeholder="Enter guest name"
                            />

                            {errors.name && (
                                <p className="error">
                                    {errors.name.message}
                                </p>
                            )}

                        </div>

                        {/* ================================= */}
                        {/* AGE */}
                        {/* ================================= */}

                        <div>

                            <label className="label">
                                Age
                            </label>

                            <input
                                type="number"
                                {...register("age")}
                                className="input-dark"
                                placeholder="Enter age"
                            />

                            {errors.age && (
                                <p className="error">
                                    {errors.age.message}
                                </p>
                            )}

                        </div>

                        {/* ================================= */}
                        {/* GENDER */}
                        {/* ================================= */}

                        <div>

                            <label className="label">
                                Gender
                            </label>

                            <div className="flex flex-wrap gap-3 mt-2">

                                {[
                                    "King",
                                    "Queen",
                                    "Couple",
                                ].map((gender) => (

                                    <label
                                        key={gender}
                                        className={`
                      px-5
                      py-2
                      border
                      rounded-full
                      cursor-pointer
                      transition
                      ${selectedGender ===
                                                gender
                                                ? "bg-purple-600 border-purple-600 text-white"
                                                : "border-purple-500 text-gray-300 hover:bg-purple-800"
                                            }
                    `}
                                    >

                                        <input
                                            type="radio"
                                            value={gender}
                                            {...register("gender")}
                                            className="hidden"
                                        />

                                        {gender === "Couple"
                                            ? "2 People"
                                            : gender}

                                    </label>

                                ))}

                            </div>

                            {errors.gender && (
                                <p className="error">
                                    {errors.gender.message}
                                </p>
                            )}

                        </div>

                        {/* ================================= */}
                        {/* PHONE */}
                        {/* ================================= */}

                        <div>

                            <label className="label">
                                Contact Number
                            </label>

                            <input
                                {...register(
                                    "phoneNumber"
                                )}
                                className="input-dark"
                                placeholder="Enter contact number"
                            />

                            {errors.phoneNumber && (
                                <p className="error">
                                    {
                                        errors.phoneNumber
                                            .message
                                    }
                                </p>
                            )}

                        </div>

                        {/* ================================= */}
                        {/* INSTAGRAM */}
                        {/* ================================= */}

                        <div>

                            <label className="label">
                                Instagram ID
                            </label>

                            <input
                                {...register("instaId")}
                                className="input-dark"
                                placeholder="Enter Instagram ID"
                            />

                            {errors.instaId && (
                                <p className="error">
                                    {
                                        errors.instaId
                                            .message
                                    }
                                </p>
                            )}

                        </div>

                        {/* ================================= */}
                        {/* PLACE */}
                        {/* ================================= */}

                        <div>

                            <label className="label">
                                Place
                            </label>

                            <input
                                {...register("place")}
                                className="input-dark"
                                placeholder="Enter place"
                            />

                            {errors.place && (
                                <p className="error">
                                    {errors.place.message}
                                </p>
                            )}

                        </div>

                        {/* ================================= */}
                        {/* TALENT */}
                        {/* ================================= */}

                        <div>

                            <label className="label">
                                Talent
                            </label>

                            <input
                                {...register("talent")}
                                className="input-dark"
                                placeholder="Enter talent"
                            />

                            {errors.talent && (
                                <p className="error">
                                    {
                                        errors.talent
                                            .message
                                    }
                                </p>
                            )}

                        </div>

                        {/* ================================= */}
                        {/* DESCRIPTION */}
                        {/* ================================= */}

                        <div>

                            <label className="label">
                                Description
                            </label>

                            <textarea
                                {...register(
                                    "description"
                                )}
                                className="input-dark h-24 resize-none"
                                placeholder="Enter description (optional)"
                            />

                        </div>

                        {/* ================================= */}
                        {/* SUBMIT */}
                        {/* ================================= */}

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !selectedEvent
                            }
                            className="
                w-full
                py-3
                rounded-lg
                bg-gradient-to-r
                from-purple-600
                to-pink-500
                font-semibold
                transition
                hover:opacity-90
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
                        >

                            {loading
                                ? "Adding Guest..."
                                : "Add Guest"}

                        </button>

                    </form>

                </div>
            </div>

            {/* ======================================= */}
            {/* STYLES */}
            {/* ======================================= */}

            <style jsx>{`

        .input-dark {
          width: 100%;
          padding: 10px 12px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          outline: none;
        }

        .input-dark:focus {
          border-color: #9333ea;
          box-shadow: 0 0 0 1px #9333ea;
        }

        .label {
          display: block;
          font-size: 12px;
          color: #aaa;
          margin-bottom: 6px;
        }

        .error {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }

        select {
          color-scheme: dark;
        }

      `}</style>

        </div>
    );
}
