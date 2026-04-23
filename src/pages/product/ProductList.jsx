// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getAllWorksByProductId } from "@/redux/features/workSlice";
import { getAllProducts } from "@/redux/features/productSlice";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorksTable() {
  const { control, watch } = useForm();
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const selectedProductId = watch("product");
  const { products, isLoading: productLoading } = useSelector((state) => state.products)
  const { works, isLoading } = useSelector((state) => state.works);
  useEffect(() => {
    if (selectedProductId) {
      dispatch(getAllWorksByProductId(selectedProductId));
    }
  }, [selectedProductId, dispatch]);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [])

  return (
    <div className="w-full rounded-md bg-white p-4">
      {/* Dropdown */}
      <div className="w-full flex gap-2 x-2">
        <Button className='lg:hidden md:hidden flex-row' onClick={()=>navigate('/app/productCreation')}><Plus/> Product Creation</Button>
        <Controller
          name="product"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.productName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table className="border border-gray-300 w-full">
          <TableHeader className="bg-muted-light hover:bg-transparent">
            <TableRow>
              <TableHead>Work Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rent</TableHead>
              <TableHead>Advance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {works.length > 0 ? (
              works.map((work) => (
                <TableRow key={work._id}>
                  <TableCell>{work.workName}</TableCell>
                  <TableCell>{work.typeName}</TableCell>
                  <TableCell>{work.rent}</TableCell>
                  <TableCell>{work.advance}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="text-center">
                  No works found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
