import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, Info, ChevronDown } from "lucide-react";

import MoM from "../assets/images/MoM.jpeg";

import { BASE_URL, testURL } from "@/appConstants";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "react-razorpay";

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

  agree: z.boolean().refine(
    (v) => v === true,
    {
      message: "Please agree to the terms",
    }
  ),
});

export default function EventRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { Razorpay } = useRazorpay();

  const [showAdminModal, setShowAdminModal] =useState(false);
  const [showModal, setShowModal] =useState(false);
  const [adminCode, setAdminCode] =useState("");
  const [loading, setLoading] =useState(false);
  const [events, setEvents] =useState([]);
  const [selectedEvent, setSelectedEvent] =useState(null);
  const [eventsLoading, setEventsLoading] =useState(true);
  const [users, setUsers] =useState([]);
  const [isClosed, setIsClosed] =useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      agree: false,
      paid: false,
    },
  });

  const agree = watch("agree");
  const selectedGender = watch("gender");


  const genderPrices = {
    King: selectedEvent?.malePrice || 0,
    Queen: selectedEvent?.femalePrice || 0,
    Couple: selectedEvent?.twoPeoplePrice || 0,
  };

  const selectedPrice =
    genderPrices[selectedGender];

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

      // Select first event automatically
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

  const fetchUsers = async () => {
    try {
      if (
        localStorage.getItem("code") !==
        "sri.laxmi#4110"
      ) {
        return;
      }

      const res = await fetch(
        `${BASE_URL}guest/getAll`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message ||
          "Failed to fetch users"
        );
      }

      setUsers(data.data || []);
    } catch (err) {
      console.error(
        "FETCH USERS ERROR:",
        err
      );

      toast({
        title: "Error",
        variant: "destructive",
        description:
          "Failed to fetch users",
      });
    }
  };

  const wake = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${testURL}/wake-up`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("WAKE RESPONSE:", res);

      if (!res.ok) {
        throw new Error(
          "Server wake-up failed"
        );
      }
    } catch (err) {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          err.message ||
          "Unable to connect to server",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    wake();
    fetchEvents();
    fetchUsers();
  }, []);


  const paidUsersCount =
    selectedEvent && users.length > 0
      ? users.filter((user) => {
        if (user.approve !== true) {
          return false;
        }

        // If eventId is an object
        if (
          typeof user.eventId ===
          "object"
        ) {
          return (
            user.eventId?._id ===
            selectedEvent._id
          );
        }

        // If eventId is string
        return (
          user.eventId ===
          selectedEvent._id
        );
      }).length
      : 0;

  // =========================
  // SEATS LEFT
  // =========================

  const seatsLeft = selectedEvent
    ? Math.max(
      selectedEvent.registrationCount -
      paidUsersCount,
      0
    )
    : 0;

  // =========================
  // CHECK EVENT DEADLINE
  // =========================

  useEffect(() => {
    if (!selectedEvent) {
      setIsClosed(false);
      return;
    }

    const checkIfClosed = () => {
      const now = new Date();

      const deadline = new Date(
        selectedEvent.deadline
      );

      const soldOut =
        paidUsersCount >=
        selectedEvent.registrationCount;

      setIsClosed(
        now >= deadline || soldOut
      );
    };

    checkIfClosed();

    const interval = setInterval(
      checkIfClosed,
      60000
    );

    return () => {
      clearInterval(interval);
    };
  }, [
    selectedEvent,
    paidUsersCount,
  ]);

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    const [hours, minutes] =
      time.split(":");

    const hour = Number(hours);

    const period =
      hour >= 12 ? "PM" : "AM";

    const formattedHour =
      hour % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
  };


  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleEventChange = (eventId) => {
    const event = events.find(
      (item) => item._id === eventId
    );

    setSelectedEvent(
      event || null
    );

    // Reset payment / terms
    setValue("paid", false);
    setValue("agree", false);
  };


  const SECRET_CODE = "sri.laxmi#4110";

  const handleVerify = () => {
    if (
      adminCode === SECRET_CODE
    ) {
      localStorage.setItem(
        "code",
        "sri.laxmi#4110"
      );

      navigate(
        "/registered-users"
      );
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          "Wrong Code",
      });
    }
  };


  const onSubmit = async (data) => {
    if (!selectedEvent) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please select an event",
      });

      return;
    }

    try {
      setLoading(true);


      const orderRes = await fetch(
        `${BASE_URL}payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: selectedEvent._id,
            gender: data.gender,
          }),
        }
      );

      const orderResult =
        await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(
          orderResult?.message ||
          "Unable to create payment order"
        );
      }

      const order = orderResult.data;

      const options = {
        key: order.key,

        amount:
          order.amount * 100,

        currency:
          order.currency,

        name: "Modhati Malupu",

        description:
          selectedEvent.eventName,

        order_id:
          order.orderId,

        prefill: {
          name: data.name,
          contact: data.phoneNumber,
        },

        theme: {
          color: "#9333ea",
        },

        handler: async function (
          response
        ) {

          try {
            setLoading(true);

            // ========================================
            // 4. Verify payment on backend
            // ========================================

            const verifyRes =
              await fetch(
                `${BASE_URL}payment/verify`,
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_signature:
                      response.razorpay_signature,

                    guestData: {
                      name: data.name,
                      age: data.age,
                      gender: data.gender,
                      phoneNumber:
                        data.phoneNumber,
                      instaId: data.instaId,
                      place: data.place,
                      talent: data.talent,
                      description:
                        data.description,
                    },
                  }),
                }
              );

            const verifyResult =
              await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(
                verifyResult?.message ||
                "Payment verification failed"
              );
            }

            toast({
              title: "Success 🎉",
              description:
                "Payment successful! Registration confirmed.",
              variant: "success",
            });

            navigate("/success");

          } catch (error) {

            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error
            );

            toast({
              title: "Payment Error",
              variant: "destructive",
              description:
                error.message ||
                "Payment verification failed",
            });

          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);

            toast({
              title: "Payment Cancelled",
              variant: "destructive",
              description:
                "You cancelled the payment.",
            });
          },
        },
      };

      const razorpay = new Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.error(
        "PAYMENT ERROR:",
        error
      );

      toast({
        title: "Payment Error",
        variant: "destructive",
        description:
          error.message ||
          "Unable to start payment",
      });

      setLoading(false);
    }
  };

  if (
    !eventsLoading &&
    events.length === 0
  ) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-5xl mb-5">
            🎭
          </div>

          <h1 className="text-3xl font-bold text-purple-400">
            No Events Available
          </h1>

          <p className="text-gray-400 mt-3">
            Please check back later.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // LOADING EVENTS
  // =========================

  if (
    eventsLoading ||
    !selectedEvent
  ) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />

          <p className="text-gray-400">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // EVENT CLOSED
  // =========================

  if (isClosed) {
    const soldOut =
      paidUsersCount >=
      selectedEvent.registrationCount;

    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center relative p-6">

        {/* ADMIN BUTTON */}

        <button
          onClick={() =>
            setShowAdminModal(true)
          }
          className="
            absolute
            top-4
            right-4
            bg-black/70
            border
            border-purple-600
            p-3
            rounded-full
            hover:bg-purple-900
            transition
            z-50
          "
        >
          <Info className="text-white w-5 h-5" />
        </button>

        <div className="w-full ">

          {/* EVENT SELECTOR */}

          {events.length > 1 && (
            <div className="absolute top-4 left-4 flex justify-center md:justify-start w-[80%]">
              <select
                value={selectedEvent?._id || ""}
                onChange={(e) => handleEventChange(e.target.value)}
                className="
                  w-full
                  max-w-sm
                  md:w-72
                  p-3
                  rounded-lg
                  bg-[#1a1a1a]
                  border
                  border-purple-700
                  text-white
                  outline-none
                "
              >
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.eventName}
                  </option>
                ))}
              </select>
            </div>
          )}


          <div className="px-6">

            <div className="text-5xl mb-5">
              {soldOut
                ? "🎉"
                : "⏰"}
            </div>

            <h1 className="text-4xl font-bold text-purple-400 mb-4">
              {soldOut
                ? "Event is Sold Out"
                : "Registration is Closed"}
            </h1>

            <p className="text-gray-400 text-xl">
              {soldOut
                ? "Tickets are sold out. Thank you for your interest 🙏"
                : "Registration deadline has passed. Thank you for your interest 🙏"}
            </p>

            <p className="text-purple-300 mt-5">
              {selectedEvent.eventName}
            </p>
          </div>
        </div>

        {/* ADMIN MODAL */}

        {showAdminModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-[#1a1a1a] p-6 rounded-lg w-80 space-y-4">
              <h2 className="text-purple-400 text-lg font-bold">Admin Access</h2>

              <input
                type="password"
                placeholder="Enter code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full p-2 rounded bg-black border border-gray-600 text-white"
              />

              <button
                onClick={handleVerify}
                className="w-full bg-purple-600 py-2 rounded"
              >
                Unlock
              </button>

              <button
                onClick={() => setShowAdminModal(false)}
                className="text-sm text-gray-400 w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">

      <div className="max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0f0f0f] border border-purple-700">

        {/* ========================= */}
        {/* EVENT DROPDOWN */}
        {/* ========================= */}

        {events.length > 1 && (
          <div className="p-5 border-b border-purple-900 bg-[#0b0b0b]">
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
                className="
                appearance-none
                w-full
                p-3
                pr-10
                rounded-lg
                bg-[#1a1a1a]
                border
                border-purple-700
                text-white
                outline-none
                focus:border-purple-400
                cursor-pointer
              "
              >
                {events.map(
                  (event) => (
                    <option
                      key={event._id}
                      value={event._id}
                      className="bg-[#1a1a1a]"
                    >
                      {event.eventName}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                pointer-events-none
                text-purple-400
              "
                size={20}
              />

            </div>
          </div>
        )}

        {/* ========================= */}
        {/* HERO */}
        {/* ========================= */}

        <div className="relative h-64 z-10">

          <img
            src={MoM}
            className="
              w-full
              h-full
              object-cover
              opacity-70
            "
            alt="Event"
          />

          <button
            onClick={() =>
              setShowAdminModal(true)
            }
            className="
              absolute
              top-3
              right-3
              bg-black/60
              p-2
              rounded-full
              hover:bg-black
              z-50
            "
          >
            <Info className="text-white w-5 h-5" />
          </button>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />

          <div className="absolute bottom-4 left-6">

            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
              {selectedEvent.eventName}
            </h1>

            <p className="text-sm text-purple-300">
              No Boundaries. No Filters.
            </p>

          </div>
        </div>

        {/* ========================= */}
        {/* CONTENT */}
        {/* ========================= */}

        <div className="p-6 space-y-6">

          {/* ========================= */}
          {/* EVENT DETAILS */}
          {/* ========================= */}

          <div className="space-y-3 text-sm text-gray-300 leading-relaxed">

            <div className="flex flex-col md:flex-row md:justify-between gap-3">

              <p className="italic text-purple-300">
                Just You, Your Soul and
                Your Inner Child ✨
              </p>

              <div className="flex items-center gap-2 text-red-400">

                <span className="text-sm italic">
                  Only
                </span>

                <span className="text-xl font-bold text-red-500">
                  {seatsLeft}
                </span>

                <span className="text-sm italic">
                  seats left — hurry up!
                </span>

              </div>
            </div>

            {/* EVENT INFO */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

              {/* MALE */}

              <div className="text-blue-400">
                👨{" "}
                <span className="font-semibold">
                  Men:
                </span>{" "}
                ₹
                {
                  selectedEvent.malePrice
                }
              </div>

              {/* FEMALE */}

              <div className="text-pink-400">
                👩{" "}
                <span className="font-semibold">
                  Women:
                </span>{" "}
                ₹
                {
                  selectedEvent.femalePrice
                }
              </div>

              {/* COUPLE */}

              <div className="text-green-400">
                🧑‍🤝‍🧑{" "}
                <span className="font-semibold">
                  2 People:
                </span>{" "}
                ₹
                {
                  selectedEvent.twoPeoplePrice
                }
              </div>

              {/* DATE */}

              <p className="text-blue-400">
                📅{" "}
                {formatDate(
                  selectedEvent.dateofEvent
                )}
              </p>

              {/* TIME */}

              <p className="text-purple-400">
                🕡{" "}
                {formatTime(
                  selectedEvent.fromTime
                )}
                {" - "}
                {formatTime(
                  selectedEvent.toTime
                )}
              </p>

              {/* LOCATION */}

              <div>
                <a
                  href={
                    selectedEvent.locationLink
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-red-400 underline"
                >
                  📍{" "}
                  {
                    selectedEvent.location
                  }
                </a>
              </div>

              {/* REGISTRATION */}

              <div className="text-cyan-400">
                🎟️{" "}
                <span className="font-semibold">
                  Seats:
                </span>{" "}
                {seatsLeft} /{" "}
                {
                  selectedEvent.registrationCount
                }
              </div>

              {/* DEADLINE */}

              <div className="text-yellow-400">
                ⏰{" "}
                <span className="font-semibold">
                  Deadline:
                </span>{" "}
                {selectedEvent.deadline
                  ? new Date(
                    selectedEvent.deadline
                  ).toLocaleString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute:
                        "2-digit",
                    }
                  )
                  : "-"}
              </div>

            </div>
          </div>

          {/* ========================= */}
          {/* REGISTRATION FORM */}
          {/* ========================= */}

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-4"
          >

            {/* NAME */}

            <div>
              <label className="label">
                What do your buddies call you? ✨
              </label>

              <input
                {...register("name")}
                className="input-dark"
              />

              {errors.name && (
                <p className="error">
                  {
                    errors.name.message
                  }
                </p>
              )}
            </div>

            {/* AGE */}

            <div>
              <label className="label">
                How young are you today? 🎂
              </label>

              <input
                type="number"
                {...register("age")}
                className="input-dark"
              />

              {errors.age && (
                <p className="error">
                  {
                    errors.age.message
                  }
                </p>
              )}
            </div>

            {/* GENDER */}

            <div>

              <label className="label">
                Gender?
              </label>

              <div className="flex gap-4 mt-2">

                {[
                  "King",
                  "Queen",
                  "Couple",
                ].map((g) => (
                  <label
                    key={g}
                    className={`
                      px-4
                      py-2
                      border
                      rounded-full
                      cursor-pointer
                      transition

                      ${selectedGender ===
                        g
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-purple-500 text-gray-300 hover:bg-purple-800"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={g}
                      {...register(
                        "gender"
                      )}
                      className="hidden"
                    />

                    {g}
                  </label>
                ))}

              </div>

              {errors.gender && (
                <p className="error">
                  {
                    errors.gender.message
                  }
                </p>
              )}
            </div>

            {/* PHONE */}

            <div>
              <label className="label">
                Contact Number?
              </label>

              <input
                {...register(
                  "phoneNumber"
                )}
                className="input-dark"
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

            {/* INSTAGRAM */}

            <div>
              <label className="label">
                Your Instagram ID? 📸
              </label>

              <input
                {...register(
                  "instaId"
                )}
                className="input-dark"
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

            {/* PLACE */}

            <div>
              <label className="label">
                Which fairy place are you from? 🌼
              </label>

              <input
                {...register("place")}
                className="input-dark"
              />

              {errors.place && (
                <p className="error">
                  {
                    errors.place.message
                  }
                </p>
              )}
            </div>

            {/* TALENT */}

            <div>
              <label className="label">
                What makes you super special? 🌟
              </label>

              <input
                {...register("talent")}
                className="input-dark"
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

            {/* DESCRIPTION */}

            <div>
              <label className="label">
                What made your heart bring you here? 💖
              </label>

              <textarea
                {...register(
                  "description"
                )}
                className="input-dark h-20"
              />
            </div>

            {/* ========================= */}
            {/* PAYMENT */}
            {/* ========================= */}

            <div className="
                  border
                  border-purple-700
                  rounded-xl
                  p-4
                  text-center
                  space-y-4
                  bg-black
                  "
            >

              <h2 className="
    text-lg
    font-semibold
    text-purple-400
  ">
                Registration Payment 💫
              </h2>

              <p className="
    text-2xl
    font-bold
    text-green-400
  ">
                {selectedPrice
                  ? `₹${selectedPrice}`
                  : "Select Gender"}
              </p>

              <p className="text-sm text-gray-400">
                After clicking the button below,
                Razorpay secure checkout will open.
              </p>

              <p className="text-xs text-yellow-300">
                🔒 Secure payment powered by Razorpay
              </p>

            </div>


            {/* ========================= */}
            {/* TERMS NOTICE */}
            {/* ========================= */}

            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-300 p-3 rounded-lg text-xs">

              ⚠️ Please read the{" "}

              <span
                className="
                  underline
                  cursor-pointer
                  text-yellow-200
                  font-semibold
                "
                onClick={() =>
                  setShowModal(true)
                }
              >
                Terms & Conditions
              </span>{" "}

              carefully before proceeding.

            </div>

            {/* AGREE */}

            <div className="flex items-center gap-3">

              <Checkbox.Root
                checked={agree}
                onCheckedChange={(val)=>
                  setValue(
                    "agree",
                    !!val,
                    {
                      shouldValidate:
                        true,
                    }
                  )
                }
                className="
                  w-5
                  h-5
                  border
                  rounded
                  disabled:opacity-40
                  data-[state=checked]:bg-purple-600
                "
              >
                <Checkbox.Indicator>
                  <CheckIcon className="text-white w-4 h-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>

              <span className="text-sm">
                I agree
              </span>

            </div>

            {errors.agree && (
              <p className="error">
                {
                  errors.agree.message
                }
              </p>
            )}

            {/* ========================= */}
            {/* SUBMIT */}
            {/* ========================= */}

            <button
              type="submit"
              disabled={
                isSubmitting ||
                loading ||
                !selectedEvent ||
                !selectedGender
              }
              className="
    w-full
    py-3
    rounded-lg
    bg-gradient-to-r
    from-purple-600
    to-pink-500
    font-semibold
    disabled:opacity-50
  "
            >
              {loading || isSubmitting
                ? "Opening Secure Payment..."
                : `Pay ₹${selectedPrice || 0} & Reserve Spot`}
            </button>


          </form>
        </div>
      </div>

      {/* ========================= */}
      {/* TERMS MODAL */}
      {/* ========================= */}

      {showModal && (
        <div className="
          fixed
          inset-0
          bg-black
          bg-opacity-70
          flex
          justify-center
          items-center
          z-[100]
          p-4
        ">

          <div className="
            bg-[#1a1a1a]
            p-6
            rounded-lg
            max-w-md
            w-full
            text-sm
            space-y-4
            border
            border-purple-700
          ">

            <h2 className="text-lg font-bold text-purple-400">
              Terms & Conditions
            </h2>

            <p className="text-gray-300 whitespace-pre-line">
              {`Guest contribution is mandatory, non-refundable.

                    No illegal activities or drugs.

                    We are not responsible for interactions or belongings.

                    Maintain respectful behavior.

                    Entry is at host discretion.

                    By registering, you agree to all terms.`}
            </p>

            <button
              onClick={() => {
                setShowModal(false);

                setValue(
                  "agree",
                  false
                );
              }}
              className="
                w-full
                bg-purple-600
                py-2
                rounded
                hover:bg-purple-700
              "
            >
              I Understand
            </button>

          </div>
        </div>
      )}

      {/* ========================= */}
      {/* ADMIN MODAL */}
      {/* ========================= */}

      {showAdminModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-6 rounded-lg w-80 space-y-4">
            <h2 className="text-purple-400 text-lg font-bold">Admin Access</h2>

            <input
              type="password"
              placeholder="Enter code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full p-2 rounded bg-black border border-gray-600 text-white"
            />

            <button
              onClick={handleVerify}
              className="w-full bg-purple-600 py-2 rounded"
            >
              Unlock
            </button>

            <button
              onClick={() => setShowAdminModal(false)}
              className="text-sm text-gray-400 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style jsx>{`

        .input-dark {
          width: 100%;
          padding: 10px;
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

        input[type="date"],
        input[type="time"],
        input[type="datetime-local"] {
          color-scheme: dark;
        }

        select {
          color-scheme: dark;
        }

      `}</style>

    </div>
  );
}

// =================================================