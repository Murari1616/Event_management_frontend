//@ts-nocheck
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllRentsByName } from "@/redux/features/rentSlice";
import {Loader} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RentList = () => {
    const dispatch = useDispatch();
       const { rents, isLoading } = useSelector((state) => state.rent);

    // Function to calculate days rented
    const calculateDays = (rentDate) => {
        const startDate = new Date(rentDate);
        const today = new Date();
        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    };

    // Function to calculate total rent
    const calculateTotalRent = (rent) => {
        return rent.rent * calculateDays(rent.date) + (rent.extraCost || 0);
    };

    //function to convert date and time to local
    const formatDateTime = (date, time) => {
        const formattedDate = date
            ? new Date(date).toLocaleDateString("en-GB").split("/").join("-")
            : "N/A";

        const formattedTime = time
            ? new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
            : "";

        return `${formattedDate} / ${formattedTime}`;
    };


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user)
            dispatch(getAllRentsByName(user.name));
    }, []);

    if (isLoading) {
        return (<div className="mt-72"><Loader /></div>)
    }

    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex flex-col bg-white rounded-lg">

                <div className="w-full h-full rounded-md bg-white mt-4 px-2">
                    {/* Table */}
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <Table className="w-full">
                            <TableHeader className="bg-muted-light hover:bg-transparent">
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Product & Type</TableHead>
                                    <TableHead>Extras</TableHead>
                                    <TableHead>Rent</TableHead>
                                    <TableHead>Advance</TableHead>
                                    <TableHead>Extras Cost</TableHead>
                                    <TableHead>Return Date</TableHead>
                                    <TableHead>Rent Days</TableHead>
                                    <TableHead>Total Rent</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rents?.length > 0 ? (
                                    rents.map((rent) => (
                                        <TableRow key={rent._id}>
                                            <TableCell>{formatDateTime(rent.date, rent.inTime)}</TableCell>
                                            <TableCell>{rent.productName} - {rent.typeName}</TableCell>
                                            <TableCell>{rent.extras || "N/A"}</TableCell>
                                            <TableCell>Rs.{rent.rent}/-</TableCell>
                                            <TableCell>Rs.{rent.advance}/-</TableCell>
                                            <TableCell>{rent.extraCost ? `Rs.${rent.extraCost}/-` : "N/A"}</TableCell>
                                            <TableCell>{rent.returnDate ? formatDateTime(rent.returnDate, rent.outTime) : "Not Returned"}</TableCell>
                                            <TableCell>{calculateDays(rent.date)} days</TableCell>
                                            <TableCell>Rs.{calculateTotalRent(rent)}/-</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="13" className="text-center">
                                            No Rents found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>.

            </div>

        </div>
    );
};

export default RentList;
