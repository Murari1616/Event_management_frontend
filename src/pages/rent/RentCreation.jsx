//@ts-nocheck
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SpeechInputButton from "./SpeechTest";
import { zodResolver } from "@hookform/resolvers/zod";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useSelector, useDispatch } from "react-redux";
import * as z from "zod";
import { getAllTypesByProductId } from "@/redux/features/typeSlice";
import { getAllWorkByProductAndTypeId, getAllWorksByProductId, getWorkById } from "@/redux/features/workSlice";
import { getAllProducts } from "@/redux/features/productSlice";
import { createRent } from "@/redux/features/rentSlice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PaymentPopup from "./Payment";
import Loader from "@/components/Loader/Loader";

const getLocalTime = () => {
    const date = new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const rentSchema = z.object({
    date: z.string().min(1, "Date is required"),
    inTime: z.string().default(getLocalTime),
    productId: z.string().min(1, "Product is required"),
    typeId: z.string().min(1, "Type is required"),
    workId: z.string().min(1, "Work is required"),
    rent: z.string().min(1, "Rent is required"),
    advance: z.string().min(1, "Advance is required"),
    customerName: z.string().min(1, "Customer name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    AadharNo: z.string().optional(),
    Aadhar: z.enum(["true", "false"], {
        message: "Please select an option for Aadhar",
    }),
    address: z.string().optional(),
    referenceName: z.string().optional(),
    referencePhoneNumber: z.string().optional(),
    additionalInfo: z.string().optional(),
    extras: z.string().optional(),
    extraCost: z.string().optional(),
    local: z.boolean().optional(),
});

export default function RentDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const owner = localStorage.getItem('owner') == 100;
    const user = JSON.parse(localStorage.getItem('user'));
    const { products,isLoading } = useSelector((state) => state.products);
    const { types } = useSelector((state) => state.types);
    const { works } = useSelector((state) => state.works);
    const [showPopup, setShowPopup] = useState(false);
    const [paymentData, setPaymentData] = useState();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(rentSchema),
    });
    const productId = watch("productId");
    const typeId = watch("typeId");
    const workId = watch("workId");
    const getLocalTime = () => {
        const date = new Date();
        return date;
    };
    const onSubmit = async (data) => {
        if (!owner) {
            setPaymentData(data);
            setShowPopup(true);
            return
        }
        const formattedData = {
            ...data,
            inTime: new Date().toLocaleTimeString("en-IN", { hour12: false }),
            Aadhar: data.Aadhar === "true",
            approved: true
        };

        try {
            const response = await dispatch(createRent(formattedData))
            if (response.payload.success) {
                toast({
                    title: 'Success',
                    description: "Rent Created Successfully",
                    variant: "success"
                })
                navigate('/app/rent-list')
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
    useEffect(() => {
        if (productId) {
            dispatch(getAllTypesByProductId(productId));
            setValue("typeId", "");
        }
    }, [productId, dispatch, setValue]);

    useEffect(() => {
        if (typeId) {
            dispatch(getAllWorkByProductAndTypeId({ productId, typeId }));
            setValue("workId", "");
        }
    }, [typeId, productId, dispatch, setValue]);

    useEffect(() => {
        if (workId) {
            dispatch(getWorkById(workId))
        }
    }, [workId])

    useEffect(() => {
        if (!owner) {
            setValue("address", user.address);
            setValue("customerName", user.name);
            setValue("phoneNumber", user.phoneNumber);
            setValue("AadharNo", user.AadharNo);
            setValue('Aadhar', "true");
        }
        dispatch(getAllProducts());
    }, [])

    useEffect(() => {
        if (works.length < 2) {
            setValue("rent", works[0]?.rent);
            setValue('advance', works[0]?.advance)
        }
    }, [works])

    return (
        <Card className="w-full mx-auto p-4">
            {isLoading ? <><Loader /></>
                :
                <>
                    <CardContent className="space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col lg:gap-6 md:gap-6 gap-3">
                            <div className="flex gap-4 ">
                                <div>
                                    <Label>Date</Label>
                                    <Input type="date" {...register("date")} defaultValue={new Date().toLocaleDateString("en-CA")} disabled={!owner} />
                                </div>
                                <div>
                                    <Label>In Time</Label>
                                    <TimePicker
                                        onChange={(value) => {
                                            setValue("inTime", value);
                                        }}
                                        value={watch("inTime") || getLocalTime()}
                                        format="hh:mm a"
                                        disabled={!owner}
                                        clearIcon={null}
                                        className=' h-[36px] react-time-picker px-2 text-sm'
                                    />
                                    {errors.inTime && <p className="text-red-500">{errors.inTime.message}</p>}
                                </div>
                            </div>
                            <div className="flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                                <div className="w-full">
                                    <Label className='flex gap-[4px]' >Product<span className="star">*</span></Label>
                                    <Select onValueChange={(value) => {
                                        setValue("productId", value);
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products?.map((product) => (
                                                <SelectItem key={product._id} value={product._id}>
                                                    {product.productName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.productId && <p className="text-red-500 text-xs">{errors.productId.message}</p>}
                                </div>

                                <div className="w-full">
                                    <Label className='flex gap-[4px]' >Type<span className="star">*</span></Label>
                                    <Select onValueChange={(value) => {
                                        setValue("typeId", value);
                                    }}
                                        disabled={!productId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {types?.map((type) => (
                                                <SelectItem key={type._id} value={type._id}>
                                                    {type.typeName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.typeId && <p className="text-red-500 text-xs">{errors.typeId.message}</p>}
                                </div>

                                <div className="w-full">
                                    <Label className='flex gap-[4px]' >Work<span className="star">*</span></Label>
                                    <Select onValueChange={(value) => setValue("workId", value)} disabled={!productId || !typeId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a work" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {works?.map((work) => (
                                                <SelectItem key={work._id} value={work._id}>
                                                    {work.workName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.workId && <p className="text-red-500 text-xs">{errors.workId.message}</p>}
                                </div>
                            </div>
                            <div className="flex lg:flex-row md:flex-row flex-col gap-4">
                                <div className="w-full flex gap-4">
                                    <div className="w-full">
                                        <Label className='flex gap-[4px]' >Rent<span className="star">*</span></Label>
                                        <Input {...register("rent")} placeholder='Rent' disabled={!owner} />
                                        {errors.rent && <p className="text-red-500 text-xs">{errors.rent.message}</p>}
                                    </div>

                                    <div className="w-full">
                                        <Label className='flex gap-[4px]' >Advance<span className="star">*</span></Label>
                                        <Input {...register("advance")} placeholder='Advance' disabled={!owner} />
                                        {errors.advance && <p className="text-red-500 text-xs">{errors.advance.message}</p>}
                                    </div>
                                </div>
                                {owner &&
                                    <div className='w-full flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2'>
                                        <div className="w-full">
                                            <Label className='flex gap-[4px]' >Customer Name<span className="star">*</span></Label>
                                            <div className="flex gap-1">
                                                <Input {...register("customerName")} placeholder='Customer Name' disabled={!owner} />
                                                {owner &&
                                                    <SpeechInputButton onResult={(text) => setValue("customerName", text)} />}
                                            </div>
                                            {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName.message}</p>}
                                        </div>

                                        <div className="w-full">
                                            <Label className='flex gap-[4px]' >Phone Number<span className="star">*</span></Label>
                                            <div className="flex gap-1">
                                                <Input {...register("phoneNumber")} placeholder='Phone Number' disabled={!owner} />
                                                {owner &&
                                                    <SpeechInputButton onResult={(text) => setValue("phoneNumber", text)} />}
                                            </div>
                                            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                                {owner &&
                                    <>
                                        <div className="w-full flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                                            <div className="w-full">
                                                <Label>Aadhar No</Label>
                                                <Input {...register("AadharNo")} placeholder='Aadhar Number' />
                                            </div>
                                            <div className="w-full">
                                                <Label>Reference Name</Label>
                                                <div className="flex gap-1">
                                                    <Input {...register("referenceName")} placeholder='Reference Name' />
                                                    <SpeechInputButton onResult={(text) => setValue("referenceName", text)} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                <div className="w-full flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                                    {owner &&
                                        <>
                                            <div className="w-full">
                                                <Label>Reference Phone Number</Label>
                                                <div className="flex gap-1">
                                                    <Input {...register("referencePhoneNumber")} placeholder='Reference Phone Number' />
                                                    <SpeechInputButton onResult={(text) => setValue("referencePhoneNumber", text)} />
                                                </div>
                                            </div>
                                        </>}
                                    <div className="w-full">
                                        <Label>Extras</Label>
                                        <div className="flex gap-1">
                                            <Input {...register("extras")} placeholder='Extras' />
                                            {owner &&
                                                <SpeechInputButton onResult={(text) => setValue("extras", text)} />}
                                        </div>
                                    </div>
                                    {owner &&
                                        <>
                                            <div className="lg:w-[60%] md:w-[60%] w-full">
                                                <Label>Extra Cost</Label>
                                                <div className="flex gap-1">
                                                    <Input type="number" {...register("extraCost")} placeholder='Extra Cost' />
                                                    <SpeechInputButton onResult={(text) => setValue("extraCost", text)} />
                                                </div>
                                            </div>
                                        </>}
                                </div>
                            </div>
                            {owner &&
                                <>
                                    <div className="w-full flex lg:flex-row md:flex-row flex-col lg:gap-4 md:gap-4 gap-2">
                                        <div className="w-full">
                                            <Label>Address</Label>
                                            <div className="flex gap-1">
                                                <Input {...register("address")} placeholder='Address' />
                                                <SpeechInputButton onResult={(text) => setValue("address", text)} />
                                            </div>
                                        </div>


                                        <div className="w-full">
                                            <Label>Additional Info</Label>
                                            <div className="flex gap-1">
                                                <Input {...register("additionalInfo")} placeholder='Add Info' />
                                                <SpeechInputButton onResult={(text) => setValue("additionalInfo", text)} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex gap-16">
                                            <div className="w-[10%] flex gap-4">
                                                <Label>Local</Label>
                                                <input type="checkbox" {...register("local")} className="w-4 h-4 mt-2" />
                                            </div>
                                            <div className="flex flex-col mt-1">
                                                <div className="flex gap-4">
                                                    <Label>Aadhar<span className="star">*</span></Label>
                                                    <div className="flex gap-4">
                                                        <label className="flex items-cspace-x-2">
                                                            <input
                                                                type="radio"
                                                                value="true"
                                                                {...register("Aadhar", {
                                                                    setValueAs: (val) => val === true,
                                                                })}
                                                            />
                                                            <span>Yes</span>
                                                        </label>
                                                        <label className="flex items-cspace-x-2">
                                                            <input
                                                                type="radio"
                                                                value="false"
                                                                {...register("Aadhar", {
                                                                    setValueAs: (val) => val === false,
                                                                })}
                                                            />
                                                            <span>No</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors.Aadhar && <p className="text-red-500 text-xs">{errors.Aadhar.message}</p>}
                                            </div>

                                        </div>

                                    </div>
                                </>}
                            <div className="w-full flex justify-end">
                                <Button type="submit" className="lg:w-[12%] md:w-[12%] w-full">Submit</Button>
                            </div>
                        </form>
                        {showPopup && (
                            <PaymentPopup
                                paymentData={paymentData}
                                onClose={() => setShowPopup(false)}
                                onSubmit={() => {
                                    const formattedData = {
                                        ...paymentData,
                                        inTime: new Date().toLocaleTimeString("en-IN", { hour12: false }),
                                        Aadhar: paymentData.Aadhar === "true",
                                    };

                                    dispatch(createRent(formattedData)).then((response) => {
                                        if (response.payload.success) {
                                            toast({
                                                title: 'Success',
                                                description: "Rent Created Successfully",
                                                variant: "success",
                                            });
                                            navigate('/app/success');
                                        } else {
                                            toast({
                                                title: "Error",
                                                variant: 'destructive',
                                                description: response.payload,
                                            });
                                        }
                                    });


                                }}
                            />
                        )}
                    </CardContent>
                </>}
        </Card >
    );
}
