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
import QR from "../assets/images/payment.jpeg";

const schema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().min(1),
  gender: z.enum(["King", "Queen"]),
  phoneNumber: z.string().min(10),
  instaId: z.string().min(2, "Instagram ID is required"),
  place: z.string().min(2),
  talent: z.string().min(2),
  description: z.string().optional(),
  agree: z.boolean().refine((v) => v === true),
  paid: z.boolean().refine((v) => v === true, {
    message: "Please complete payment first",
  }),
});

export default function EventRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const isClosed = false;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const agree = watch("agree");
  const paid = watch("paid");
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
    const { agree, paid, ...payload } = data;
    console.log("object", payload);
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
      navigate("/success");
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
  if (isClosed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center">
        <div>
          <h1 className="text-4xl font-bold text-purple-400">
            Event is Officially Closed
          </h1>
          <p className="text-gray-400 text-xl">
            Tickets are sold out. Thank you for your interest 🙏
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0f0f0f] border border-purple-700">
        {/* 🎬 Hero Section */}
        <div className="relative h-64 z-10">
          <img src={AOP} className="w-full h-full object-cover opacity-70" />
          <button
            onClick={() => {
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
              <p className="text-green-400">💰 Price: ₹899</p>
              {/* <p className="text-yellow-300">🍽️ ₹500 Redeemable Food</p> */}
              <p className="text-pink-400">🎁 Surprise Gift Included</p>
              <p className="text-blue-400">📅 May 2, 2026</p>
              <p className="text-purple-400">🕡 5:30 PM onwards</p>
              <a
                href="https://maps.app.goo.gl/dsXE2q2Vgau3vrHfA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-red-400 underline"
              >
                📍The Game Room Cafe, Gachibowli
              </a>

              {/* ✅ NEW */}
              <p className="text-orange-400">🎮 Gaming</p>
              <p className="text-cyan-400">🤝 Strangers Meet</p>
              <a
                href="https://www.instagram.com/anaganaga.oka.parichayam?igsh=MWc1cnNneWFteWY5OA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 text-xs flex flex-row gap-2"
              >
                Follow{" "}
                <p className="text-purple-400 underline">
                  @anaganaga.oka.parichayam
                </p>
              </a>
            </div>
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

            <div>
              <label className="label">Your Instagram ID? 📸</label>
              <input {...register("instaId")} className="input-dark" />
              {errors.instaId && (
                <p className="error">{errors.instaId.message}</p>
              )}
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

            <div className="border border-purple-700 rounded-xl p-4 text-center space-y-4 bg-black">
              <h2 className="text-lg font-semibold text-purple-400">
                Complete Payment for Registration 💫
              </h2>

              {/* 💰 Price */}
              <p className="text-2xl font-bold text-green-400">₹899</p>

              <div className="flex justify-center">
                <img
                  src={QR}
                  alt="payment-qr"
                  className="w-56 h-56 object-contain rounded-lg border border-gray-700"
                />
              </div>

              <p className="text-sm text-gray-300">
                <span className="text-purple-400 font-semibold">
                  Payment Name:
                </span>{" "}
                Devarakonda Sri Laxmi Durga
              </p>

              <a
                href="https://wa.me/917382510118"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 font-semibold underline mt-2"
              >
                📱 Send your payment screenshot on WhatsApp to 7382510118
              </a>

              <p className="text-xs text-yellow-300">
                ⚠️ Complete payment before submitting the form
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox.Root
                checked={watch("paid")}
                onCheckedChange={(val) => setValue("paid", !!val)}
                className="w-5 h-5 border rounded data-[state=checked]:bg-green-600"
              >
                <Checkbox.Indicator>
                  <CheckIcon className="text-white w-4 h-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>

              <span className="text-sm text-green-400">
                I have completed the payment
              </span>
            </div>
            {/* Terms */}
            {/* ⚠️ Terms Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-300 p-3 rounded-lg text-xs">
              ⚠️ Please read the{" "}
              <span
                className="underline cursor-pointer text-yellow-200 font-semibold"
                onClick={() => setShowModal(true)}
              >
                Terms & Conditions
              </span>{" "}
              carefully before proceeding. You will only be able to agree after
              reading them.
            </div>

            <div className="flex items-center gap-3">
              <Checkbox.Root
                checked={agree}
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
              disabled={!agree || !paid || isSubmitting}
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
