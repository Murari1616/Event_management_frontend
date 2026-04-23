//@ts-nocheck
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import qr from '../../assets/images/paymentQR.png'
import { getWorkById } from "@/redux/features/workSlice";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Copy } from "lucide-react";
import { upiId, phoneNumber } from "@/appConstants";

const PaymentPopup = ({ onClose, onSubmit, paymentData }) => {
    const dispatch = useDispatch();
    const { works } = useSelector((state) => state.works);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const [copied, setCopied] = useState({ type: "", status: false });

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied({ type, status: true });
            setTimeout(() => setCopied({ type: "", status: false }), 1500);
        });
    };
    const handleCheckboxChange = () => {
        setIsConfirmed(!isConfirmed);
    };

    const handleSubmit = () => {
        if (isConfirmed) {
            onSubmit();
        }
    };
    useEffect(() => {
        dispatch(getWorkById(paymentData?.workId))
    }, []);

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                >
                    ✖
                </button>
                <p className="text-sm text-center text-gray-700 bg-blue-50 border border-blue-200 px-4 py-2 rounded-md mb-4 shadow-sm">
                    📱 <span className="font-medium">Scan the QR code using any UPI app</span>, make the advance payment, then tick the checkbox below and click the <span className="font-semibold">Submit</span> button to confirm the payment.
                    <br></br>
                    📱 <span className="font-medium">ఎదైనా UPI యాప్‌ను ఉపయోగించి QR కోడ్‌ను స్కాన్ చేయండి</span>, అడ్వాన్స్ చెల్లించండి, తర్వాత క్రింద ఉన్న చెక్‌బాక్స్‌ను టిక్ చేసి <span className="font-semibold">Submit</span> బటన్‌ను క్లిక్ చేయండి.
                </p>

                <div className="flex gap-4">
                    {/* QR Image */}
                    <img
                        src={qr}
                        alt="QR Code"
                        className="w-48 h-48 mx-auto mb-4"
                    />
                    <div className="flex flex-col justify-center gap-4">
                        <div className="flex gap-2 justify-between items-center border p-3 rounded-md">
                            <div>
                                <p className="text-gray-500 text-xs">Phone Number</p>
                                <p className="font-medium text-sm">{phoneNumber}</p>
                            </div>
                            <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleCopy(phoneNumber, "phone")}
                            >
                                {copied.status && copied.type === "phone" ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Copy className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <div className="flex gap-2 justify-between items-center border p-3 rounded-md">
                            <div>
                                <p className="text-gray-500 text-xs">UPI ID</p>
                                <p className="font-medium text-sm">{upiId}</p>
                            </div>
                            <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleCopy(upiId, "upi")}
                            >
                                {copied.status && copied.type === "upi" ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Copy className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6 bg-green-100 px-3 py-1 rounded-full shadow-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700 text-sm font-medium">Hanumantharao Kunchapu</span>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 space-y-1 text-center text-sm sm:text-base">
                    <p><span className="font-semibold">Date:</span> {paymentData.date}</p>
                    <p><span className="font-semibold">Product:</span> {works[0].productName}</p>
                    <p><span className="font-semibold">Rent:</span> ₹{paymentData.rent}</p>
                    <p><span className="font-semibold">Type:</span> {works[0].typeName}</p>
                    <p><span className="font-semibold">Advance:</span> ₹{paymentData.advance}</p>
                    <p><span className="font-semibold">Work:</span> {works[0].workName}</p>
                </div>

                {/* Checkbox */}
                <div className="mt-4 text-left text-sm">
                    <label className="inline-flex items-start gap-2">
                        <input
                            type="checkbox"
                            checked={isConfirmed}
                            onChange={handleCheckboxChange}
                            className="mt-1"
                        />
                        <div>
                            <span>I confirm that advance is paid to the UPI QR code above.</span>
                            <span>పై UPI QR కోడ్‌కి అడ్వాన్స్ చెల్లించానని కన్‌ఫర్మ్ చేస్తున్నాను.</span>
                        </div>
                    </label>
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    disabled={!isConfirmed}
                    className={`w-full mt-6 py-2 px-4 rounded-md text-white font-semibold transition ${isConfirmed
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    Submit
                </button>
            </div>
        </div>,
        document.body
    );
};

export default PaymentPopup;
