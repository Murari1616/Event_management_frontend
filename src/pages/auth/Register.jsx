//@ts-nocheck
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useDispatch } from "react-redux";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import Location from "./Location";
import { useState } from "react";
import { Eye, EyeOff, LocateFixed } from "lucide-react";
import { registerUser } from "@/redux/features/authSlice";
import customer from '../../assets/images/customerImage.jpg'

export const registerSchema = z
    .object({
        name: z.string().min(1, "Customer name is required"),
        phoneNumber: z
            .string()
            .regex(/^\d{10}$/, "Phone number must be a 10-digit number"),
        email: z.string().min(1, "Email is required").email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
        address: z.string().min(6, "Address must be at least 6 characters"),
        AadharNo: z
            .string()
            .optional()
            .refine((val) => !val || /^\d{12}$/.test(val), {
                message: "Aadhar number must be 12 digits",
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });


export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [addressValue, setAddressValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleAddressSelect = (selectedAddress) => {
        setAddressValue(selectedAddress);
        setValue("address", selectedAddress);
        setIsPopupOpen(false);
    };


    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await dispatch(registerUser(data))
            if (response.payload.data) {
                toast({
                    title: 'Success',
                    description: "User registered Successfully",
                    variant: "success"
                })
                navigate('/')
            } else {
                toast({
                    title: "Error",
                    variant: 'destructive',
                    description: response.payload
                })

            }
        }
        catch (error) {

        }
    }


    return (
        <div className="flex lg:flex-row md:flex-row flex-col justify-center lg:gap-32 items-center relative w-screen h-screen bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${customer})`,
              }}
            >
            <Card className="w-fit mx-auto p-4 m-24 bg-white/60">
                <CardContent className="space-y-8">
                    <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col lg:gap-6 md:gap-6 gap-3">
                        <div className="flex lg:flex-row md:flex-row flex-col gap-4">
                            <div className='w-full flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2'>
                                <div className="w-full">
                                    <Label className='flex gap-[4px]' >Customer Name<span className="star">*</span></Label>
                                    <div className="flex gap-1">
                                        <Input {...register("name")} placeholder='Customer Name' className="bg-white"/>
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                                </div>

                                <div className="w-full">
                                    <Label className='flex gap-[4px]' >Phone Number<span className="star">*</span></Label>
                                    <div className="flex gap-1">
                                        <Input {...register("phoneNumber")} placeholder='Phone Number' className="bg-white"/>
                                    </div>
                                    {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                            <div className="w-full flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                                <div className="w-full">
                                    <Label className='flex gap-[4px]'>Email<span className="star">*</span></Label>
                                    <Input {...register("email")} placeholder='Email' className="bg-white"/>
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                </div>
                                <div className="w-full">
                                    <Label>Aadhar No</Label>
                                    <div className="flex gap-1">
                                        <Input {...register("AadharNo")} placeholder='Aadhar No' className="bg-white"/>
                                    </div>
                                    {errors.AadharNo && <p className="text-red-500 text-xs">{errors.AadharNo.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                            <div className="w-full flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                                <div className="w-full">
                                    <Label className='flex gap-[4px]'>Password<span className="star">*</span></Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            {...register("password")}
                                            placeholder="password"
                                            className="pr-10 bg-white"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs text-red-500">{errors.password.message}</p>
                                    )}
                                </div>
                                <div className="w-full">
                                    <Label className='flex gap-[4px]'>Confirm Password<span className="star">*</span></Label>
                                    <div className="relative">
                                        <Input type={showPassword ? "text" : "password"} {...register("confirmPassword")} placeholder='Confirm Password' className="bg-white"/>
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                            <div className="w-full">
                                <Label className='flex gap-[4px]'>Address<span className="star">*</span></Label>
                                <div className="flex gap-4">
                                    <Controller
                                        control={control}
                                        name="address"
                                        render={({ field }) => (
                                            <div className="flex gap-4 w-full">
                                                <Textarea
                                                    {...field}
                                                    value={addressValue}
                                                    onChange={(e) => {
                                                        field.onChange(e); // notify react-hook-form
                                                        setAddressValue(e.target.value); // update local state
                                                    }}
                                                    placeholder="Address"
                                                    className="bg-white"
                                                />
                                                <Button
                                                    className="bg-white hover:bg-white border border-blue-500"
                                                    type="button"
                                                    onClick={() => setIsPopupOpen(true)}
                                                >
                                                    <LocateFixed className="text-blue-500" />
                                                </Button>
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                            </div>

                        </div>
                        <div className="w-full flex justify-between items-center gap-12">
                            <Link className="text-black underline hover:text-white w-full text-nowrap" to={'/'}>...back to login</Link>
                            <Button type="submit" className="lg:w-[20%] md:w-[12%] w-full">Register</Button>
                        </div>
                    </form>
                    {isPopupOpen && (
                        <Location
                            onClose={() => setIsPopupOpen(false)}
                            onSelect={handleAddressSelect}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
