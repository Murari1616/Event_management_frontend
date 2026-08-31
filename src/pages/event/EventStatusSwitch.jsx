import React, { useState } from "react";
import { BASE_URL } from "@/appConstants";
import { useToast } from "@/hooks/use-toast";

export default function EventStatusSwitch({ event, onStatusChange }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}event/updateStatus/${event._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result?.message || "Failed to update event status"
        );
      }

      // Send updated event back to parent
      onStatusChange(result.data);

      toast({
        title: "Success",
        description: `Event is now ${
          result.data.active ? "Active" : "Inactive"
        }`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`
          relative
          w-12
          h-6
          rounded-full
          transition-colors
          duration-300
          disabled:opacity-50
          ${
            event.active
              ? "bg-green-600"
              : "bg-gray-700"
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            left-1
            w-4
            h-4
            bg-white
            rounded-full
            transition-transform
            duration-300
            ${
              event.active
                ? "translate-x-6"
                : "translate-x-0"
            }
          `}
        />
      </button>

      <span
        className={`text-sm font-medium ${
          event.active
            ? "text-green-400"
            : "text-gray-500"
        }`}
      >
        {loading
          ? "Updating..."
          : event.active
            ? "Active"
            : "Inactive"}
      </span>
    </div>
  );
}
