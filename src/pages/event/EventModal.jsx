import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { BASE_URL } from "@/appConstants";
import { useToast } from "@/hooks/use-toast";

const eventSchema = z.object({
  eventName: z.string().min(2, "Event name is required"),

  malePrice: z.coerce
    .number()
    .min(0, "Male price is required"),

  femalePrice: z.coerce
    .number()
    .min(0, "Female price is required"),

  twoPeoplePrice: z.coerce
    .number()
    .min(0, "Two Persons price is required"),

  dateofEvent: z
    .string()
    .min(1, "Event date is required"),

  location: z
    .string()
    .min(2, "Location is required"),

  locationLink: z
    .string()
    .url("Enter a valid location URL"),

  fromTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Use HH:mm format"
    ),

  toTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Use HH:mm format"
    ),

  registrationCount: z.coerce
    .number()
    .min(0, "Cannot be negative"),

  deadline: z
    .string()
    .min(1, "Deadline is required"),
});

export default function EventModal({
  open,
  onClose,
  event,
  onEventSaved,
}) {
  const { toast } = useToast();

  const isEdit = Boolean(event);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventSchema),

    defaultValues: {
      eventName: "",
      malePrice: 0,
      femalePrice: 0,
      twoPeoplePrice: 0,
      dateofEvent: "",
      location: "",
      locationLink: "",
      fromTime: "",
      toTime: "",
      registrationCount: 0,
      deadline: "",
    },
  });

  /*
   * ==========================================
   * Convert date -> YYYY-MM-DD
   * ==========================================
   */

  const formatDateForInput = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getFullYear();

    const month = String(
      d.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      d.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*
   * ==========================================
   * Convert date -> datetime-local value
   * ==========================================
   */

  const formatDateTimeForInput = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getFullYear();

    const month = String(
      d.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      d.getDate()
    ).padStart(2, "0");

    const hours = String(
      d.getHours()
    ).padStart(2, "0");

    const minutes = String(
      d.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  /*
   * ==========================================
   * Populate form
   *
   * ADD:
   * empty form
   *
   * EDIT:
   * existing event values
   * ==========================================
   */

  useEffect(() => {
    if (!open) return;

    if (event) {
      reset({
        eventName: event.eventName || "",

        malePrice:
          event.malePrice ?? 0,

        femalePrice:
          event.femalePrice ?? 0,

        twoPeoplePrice:
          event.twoPeoplePrice ?? 0,

        dateofEvent:
          formatDateForInput(
            event.dateofEvent
          ),

        location:
          event.location || "",

        locationLink:
          event.locationLink || "",

        fromTime:
          event.fromTime || "",

        toTime:
          event.toTime || "",

        registrationCount:
          event.registrationCount ?? 0,

        deadline:
          formatDateTimeForInput(
            event.deadline
          ),
      });
    } else {
      reset({
        eventName: "",
        malePrice: 0,
        femalePrice: 0,
        twoPeoplePrice: 0,
        dateofEvent: "",
        location: "",
        locationLink: "",
        fromTime: "",
        toTime: "",
        registrationCount: 0,
        deadline: "",
      });
    }
  }, [open, event, reset]);

  /*
   * ==========================================
   * SUBMIT
   *
   * event exists -> UPDATE
   *
   * event doesn't exist -> CREATE
   * ==========================================
   */

  const onSubmit = async (data) => {
    try {
      const payload = {
        eventName: data.eventName,

        malePrice: Number(
          data.malePrice
        ),

        femalePrice: Number(
          data.femalePrice
        ),

        twoPeoplePrice: Number(
          data.twoPeoplePrice
        ),

        dateofEvent: new Date(
          data.dateofEvent
        ),

        location: data.location,

        locationLink:
          data.locationLink,

        /*
         * Keep these as HH:mm
         */
        fromTime: data.fromTime,

        toTime: data.toTime,

        registrationCount: Number(
          data.registrationCount
        ),

        deadline: new Date(
          data.deadline
        ),
        active:true
      };


      if (!isEdit) {
        const res = await fetch(
          `${BASE_URL}event/create`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

        const result =
          await res.json();

        if (!res.ok) {
          throw new Error(
            result?.message ||
              "Failed to create event"
          );
        }

        toast({
          title: "Success 🎉",
          description:
            "Event created successfully",
          variant: "success",
        });

        onEventSaved(
          result.data,
          "create"
        );
      }

      /*
       * ======================================
       * UPDATE
       * ======================================
       */

      else {
        const res = await fetch(
          `${BASE_URL}event/update/${event._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

        const result =
          await res.json();

        if (!res.ok) {
          throw new Error(
            result?.message ||
              "Failed to update event"
          );
        }

        toast({
          title: "Success 🎉",
          description:
            "Event updated successfully",
          variant: "success",
        });

        onEventSaved(
          result.data,
          "update"
        );
      }

      onClose();

    } catch (error) {
      console.error(
        "EVENT ERROR:",
        error
      );

      toast({
        title: "Error",
        variant: "destructive",
        description:
          error.message ||
          "Something went wrong",
      });
    }
  };

  /*
   * ==========================================
   * MODAL CLOSED
   * ==========================================
   */

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        bg-black/80
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
        overflow-y-auto custom-horizontal-scroll
      "
    >
      <div
        className="
          relative
          w-full
          max-w-2xl
          max-h-[80vh]
          overflow-y-auto
          rounded-2xl
          bg-[#0f0f0f]
          border
          border-purple-700
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            sticky
            top-0
            z-10
            bg-[#0f0f0f]
            border-b
            border-gray-800
            px-6
            py-4
            flex
            items-center
            justify-between
          "
        >
          <div>
            <p className="text-xs text-purple-400">
              {isEdit
                ? "✏️ Edit Event"
                : "✨ New Event"}
            </p>

            <h2 className="text-xl font-bold">
              {isEdit
                ? "Update Event"
                : "Add Event"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              p-2
              rounded-full
              hover:bg-gray-800
              transition
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="p-6 space-y-6"
        >

          {/* EVENT NAME */}

          <div>
            <label className="label">
              Event Name ✨
            </label>

            <input
              {...register(
                "eventName"
              )}
              className="input-dark"
            />

            {errors.eventName && (
              <p className="error">
                {
                  errors.eventName
                    .message
                }
              </p>
            )}
          </div>

          {/* PRICING */}

          <div>
            <h3 className="section-title">
              Pricing 💰
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div>
                <label className="label">
                  👨 Male Price
                </label>

                <input
                  type="number"
                  min="0"
                  {...register(
                    "malePrice"
                  )}
                  className="input-dark"
                />

                {errors.malePrice && (
                  <p className="error">
                    {
                      errors.malePrice
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="label">
                  👩 Female Price
                </label>

                <input
                  type="number"
                  min="0"
                  {...register(
                    "femalePrice"
                  )}
                  className="input-dark"
                />

                {errors.femalePrice && (
                  <p className="error">
                    {
                      errors.femalePrice
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="label">
                  👫 Couple Price
                </label>

                <input
                  type="number"
                  min="0"
                  {...register(
                    "twoPeoplePrice"
                  )}
                  className="input-dark"
                />

                {errors.twoPeoplePrice && (
                  <p className="error">
                    {
                      errors
                        .twoPeoplePrice
                        .message
                    }
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* DATE + TIME */}

          <div>
            <h3 className="section-title">
              Date & Time 📅
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div>
                <label className="label">
                  Event Date
                </label>

                <input
                  type="date"
                  {...register(
                    "dateofEvent"
                  )}
                  className="input-dark"
                />

                {errors.dateofEvent && (
                  <p className="error">
                    {
                      errors.dateofEvent
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="label">
                  From
                </label>

                <input
                  type="time"
                  {...register(
                    "fromTime"
                  )}
                  className="input-dark"
                />

                {errors.fromTime && (
                  <p className="error">
                    {
                      errors.fromTime
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="label">
                  To
                </label>

                <input
                  type="time"
                  {...register(
                    "toTime"
                  )}
                  className="input-dark"
                />

                {errors.toTime && (
                  <p className="error">
                    {
                      errors.toTime
                        .message
                    }
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* LOCATION */}

          <div>
            <h3 className="section-title">
              Location 📍
            </h3>

            <div className="space-y-3">

              <div>
                <label className="label">
                  Location
                </label>

                <input
                  {...register(
                    "location"
                  )}
                  className="input-dark"
                />

                {errors.location && (
                  <p className="error">
                    {
                      errors.location
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="label">
                  Google Maps Link
                </label>

                <input
                  type="url"
                  {...register(
                    "locationLink"
                  )}
                  className="input-dark"
                />

                {errors.locationLink && (
                  <p className="error">
                    {
                      errors.locationLink
                        .message
                    }
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* REGISTRATION */}

          <div>
            <h3 className="section-title">
              Registration 👥
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div>
                <label className="label">
                  Registration Count
                </label>

                <input
                  type="number"
                  min="0"
                  {...register(
                    "registrationCount"
                  )}
                  className="input-dark"
                />

                {errors.registrationCount && (
                  <p className="error">
                    {
                      errors
                        .registrationCount
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="label">
                  Registration Deadline
                </label>

                <input
                  type="datetime-local"
                  {...register(
                    "deadline"
                  )}
                  className="input-dark"
                />

                {errors.deadline && (
                  <p className="error">
                    {
                      errors.deadline
                        .message
                    }
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                py-3
                rounded-lg
                border
                border-gray-700
                text-gray-400
                hover:bg-gray-900
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1
                py-3
                rounded-lg
                bg-gradient-to-r
                from-purple-600
                to-pink-500
                font-semibold
                disabled:opacity-50
              "
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Event ✨"
                : "Create Event ✨"}
            </button>

          </div>

        </form>
      </div>

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

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #a855f7;
          margin-bottom: 10px;
        }

        input[type="date"],
        input[type="time"],
        input[type="datetime-local"] {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}
