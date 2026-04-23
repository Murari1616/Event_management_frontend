///@ts-nocheck
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, Phone, MapPin, ArrowRight } from "lucide-react";
import { emptyError, emptyStatus, getAllRents, getAllUnApprovedRents, updateRent } from "@/redux/features/rentSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader/Loader";

const UnApprovedRents = ({ onClose }) => {
    const dispatch = useDispatch();
    const { unapprovedrents: rents, error, status,isLoading } = useSelector((state) => state.rent);
    const [rentStates, setRentStates] = useState([]);

    const { toast } = useToast();

    useEffect(() => {
        dispatch(getAllUnApprovedRents());
    }, []);

    // Update local state when rents change
    useEffect(() => {
        const updated = rents.map((rent) => ({
            ...rent,
            extras: rent.extras || "",
            extraCost: "",
            isExtrasPresent: !!rent.extras,
        }));
        setRentStates(updated);
    }, [rents]);

    const handleExtrasToggle = (index) => {
        const updated = [...rentStates];
        updated[index].isExtrasPresent = !updated[index].isExtrasPresent;
        if (!updated[index].isExtrasPresent) {
            updated[index].extras = "";
            updated[index].extraCost = "";
        }
        setRentStates(updated);
    };

    const handleChange = (index, field, value) => {
        const updated = [...rentStates];
        updated[index][field] = value;
        setRentStates(updated);
    };

    const handleApprove = async (rent, index) => {
        const { extras, extraCost, isExtrasPresent } = rentStates[index];

        const getLocalTime = () => {
            const date = new Date();
            return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        };

        const updatedData = {
            approved: true,
            extras: isExtrasPresent ? extras : "",
            extraCost: isExtrasPresent ? extraCost : "",
            inTime: new Date().toLocaleTimeString("en-IN", { hour12: false }),
            date: new Date().toLocaleDateString("en-CA")
        };
        try {
            const response = await dispatch(updateRent({ id: rent._id, updatedData }));
            if (response.payload) {
                toast({
                    title: 'Success',
                    description: "Rent Created Successfully",
                    variant: "success"
                })
                dispatch(getAllRents({
                    page: 1,
                    limit: 10,
                }));
                onClose();

            }
            else {
                toast({
                    title: "Error",
                    variant: 'destructive',
                    description: response.payload
                })
            }
        } catch (err) {
            console.error("Approval failed", err);
            alert("Failed to approve rent ❌");
        }
    };

    useEffect(() => {
        if (status === null) {
            dispatch(emptyStatus());
        }
        if (status === "fail" || error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error,
            });
            dispatch(emptyError());
            dispatch(emptyStatus());
        }
    }, [status, error]);

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[70vh] overflow-y-auto m-4">
                {isLoading ?
                    <div><Loader/></div> :
                    <>
                        {/* Close button */}
                        < button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
                            <X className="w-5 h-5" />
                        </button>

                        {/* Rent Cards */}
                        <div className="space-y-4">
                            {rentStates.map((rent, index) => (
                                <div key={rent._id} className="relative border p-4 rounded-lg shadow-md">
                                    {/* Name */}
                                    <h2 className="text-lg font-semibold mb-2">{rent.customerName}</h2>

                                    {/* Phone */}
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                        <Phone className="w-4 h-4 mr-1" />
                                        {rent.phoneNumber}
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-center text-xs text-gray-600 mb-1">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        <address>{rent.address}</address>
                                    </div>

                                    {/* Product and type */}
                                    <div className="flex items-center text-sm text-gray-700 mt-2">
                                        <span>{rent.productName}</span>
                                        <ArrowRight className="mx-2 w-4 h-4" />
                                        <span>{rent.typeName} → {rent.workName}</span>
                                    </div>

                                    {/* Extras Toggle */}
                                    <div className="mt-3 space-y-2">
                                        <label className="flex items-center space-x-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={rent.isExtrasPresent}
                                                onChange={() => handleExtrasToggle(index)}
                                            />
                                            <span>Extras Present</span>
                                        </label>

                                        {rent.isExtrasPresent && (
                                            <>
                                                <Input
                                                    placeholder="Extras"
                                                    value={rent.extras}
                                                    onChange={(e) => handleChange(index, "extras", e.target.value)}
                                                />
                                                <Input
                                                    placeholder="Extra Cost"
                                                    type="number"
                                                    value={rent.extraCost}
                                                    onChange={(e) => handleChange(index, "extraCost", e.target.value)}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Approve Button */}
                                    <div className="mt-4 text-right">
                                        <Button onClick={() => handleApprove(rent, index)}>✅ Approve</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>}
            </div>
        </div >,
        document.body
    );
};

export default UnApprovedRents;
