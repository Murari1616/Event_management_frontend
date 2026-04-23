import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, Info } from "lucide-react";
import AOP from "../assets/images/AOP.jpeg";
import { BASE_URL, testURL } from "@/appConstants";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().min(1),
  gender: z.enum(["King", "Queen"]),
  phoneNumber: z.string().min(10),
  place: z.string().min(2),
  talent: z.string().min(2),
  description: z.string().optional(),
  agree: z.boolean().refine((v) => v === true),
});

export default function EventRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [termsRead, setTermsRead] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const agree = watch("agree");
  const SECRET_CODE = "4110";

  const handleVerify = () => {
    if (adminCode === SECRET_CODE) {
      localStorage.setItem("code", "4110");
      navigate("/registered-users");
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Wrong Code",
      });
    }
  };

  const selectedGender = watch("gender");
  const onSubmit = async (data) => {
    const { agree, ...payload } = data;
    try {
      const res = await fetch(`${BASE_URL}guest/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast({
        title: "Success",
        description: "Registration Successfully",
        variant: "success",
      });
      navigate("/payment");
    } catch {
      toast({
        title: "Error",
        variant: "destructive",
        description: res.payload,
      });
    }
  };

  const wake = async () => {
    await fetch(`${testURL}/wake-up`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  };

  useEffect(() => {
    wake();
  });

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0f0f0f] border border-purple-700">
        {/* 🎬 Hero Section */}
        <div className="relative h-64 z-10">
          <img src={AOP} className="w-full h-full object-cover opacity-70" />
          <button
            onClick={() => {
              console.log("HIHI");
              setShowAdminModal(true);
            }}
            className="absolute top-3 right-3 bg-black/60 p-2 rounded-full hover:bg-black z-50"
          >
            <Info className="text-white w-5 h-5" />
          </button>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />

          <div className="absolute bottom-4 left-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
              Anaganaga Oka Parichayam
            </h1>
            <p className="text-sm text-purple-300">
              No Boundaries. No Filters.
            </p>
          </div>
        </div>

        {/* 💫 Content */}
        <div className="p-6 space-y-6">
          {/* 🌟 Description */}
          <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
            <p className="italic text-purple-300">
              Just You, Your Soul and Your Inner Child ✨
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <p className="text-green-400">💰 Price: ₹1199</p>
              <p className="text-yellow-300">🍽️ ₹500 Redeemable Food</p>
              <p className="text-pink-400">🎁 Surprise Gift Included</p>
              <p className="text-blue-400">📅 April 25, 2026</p>
              <p className="text-purple-400">🕡 6:30 PM onwards</p>
              <p className="text-red-400">📍The Grind Cafe, Banjara Hills</p>
            </div>

            <p className="text-purple-400 text-xs">
              Follow @anaganaga.oka.parichayam
            </p>
          </div>

          {/* 🧾 Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">What do your buddies call you? ✨</label>
              <input {...register("name")} className="input-dark" />
              {errors.name && <p className="error">Required</p>}
            </div>

            {/* Age */}
            <div>
              <label className="label">How young are you today? 🎂</label>
              <input
                type="number"
                {...register("age")}
                className="input-dark"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="label">Gender?</label>
              <div className="flex gap-4 mt-2">
                {["King", "Queen"].map((g) => (
                  <label
                    key={g}
                    className={`px-4 py-2 border rounded-full cursor-pointer transition 
        ${
          selectedGender === g
            ? "bg-purple-600 border-purple-600 text-white"
            : "border-purple-500 text-gray-300 hover:bg-purple-800"
        }`}
                  >
                    <input
                      type="radio"
                      value={g}
                      {...register("gender")}
                      className="hidden"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="label">Contact Number?</label>
              <input {...register("phoneNumber")} className="input-dark" />
            </div>

            {/* Place */}
            <div>
              <label className="label">
                Which fairy place are you from? 🌼
              </label>
              <input {...register("place")} className="input-dark" />
            </div>
            <div>
              <label className="label">What makes you super special? 🌟</label>
              <input {...register("talent")} className="input-dark" />
            </div>

            {/* Optional */}
            <div>
              <label className="label">
                What made your heart bring you here? 💖
              </label>
              <textarea
                {...register("description")}
                className="input-dark h-20"
              />
            </div>

            {/* Terms */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-purple-400 underline text-sm"
            >
              Read Terms & Conditions
            </button>

            <div className="flex items-center gap-3">
              <Checkbox.Root
                checked={agree}
                disabled={!termsRead}
                onCheckedChange={(val) => setValue("agree", !!val)}
                className="w-5 h-5 border rounded data-[state=checked]:bg-purple-600"
              >
                <Checkbox.Indicator>
                  <CheckIcon className="text-white w-4 h-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>

              <span className="text-sm">I agree</span>
            </div>

            {/* Submit */}
            <button
              disabled={!agree || isSubmitting}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Entering..." : "Reserve Your Spot"}
            </button>
          </form>
        </div>
      </div>

      {/* 🔒 Terms Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-[#1a1a1a] p-6 rounded-lg max-w-md text-sm space-y-4">
            <h2 className="text-lg font-bold text-purple-400">Terms</h2>

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
                setTermsRead(true);
                setShowModal(false);
              }}
              className="w-full bg-purple-600 py-2 rounded"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
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
        }
        .label {
          font-size: 12px;
          color: #aaa;
        }
        .error {
          color: red;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
