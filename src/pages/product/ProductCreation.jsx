// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProduct, getAllProducts } from "@/redux/features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { createType, getAllTypesByProductId } from "@/redux/features/typeSlice";
import { createWork } from "@/redux/features/workSlice";

const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
});

const typeSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  typeName: z.string().min(1, "Type name is required"),
});

const workSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  typeId: z.string().min(1, "Select a type"),
  workName: z.string().min(1, "Work name is required"),
  advance: z.string().min(1, "Advance is required"),
  rent: z.string().min(1, "Rent is required"),
});

const ProductCreation = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { products } = useSelector((state) => state.products);
  const { types } = useSelector((state) => state.types)
  const [selectedProduct, setSelectedProduct] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productSchema) });

  const {
    register: registerType,
    handleSubmit: handleSubmitType,
    setValue: setValueType,
    formState: { errors: errorsType },
  } = useForm({ resolver: zodResolver(typeSchema) });

  const {
    register: registerWork,
    handleSubmit: handleSubmitWork,
    formState: { errors: errorsWork },
    setValue:setValueWork,
  } = useForm({ resolver: zodResolver(workSchema) });

  const onSubmitProduct = async (productData) => {
    try {
      const response = await dispatch(createProduct(productData));
      // console.log("response",response)
      if (response.payload.success) {
        toast({
          title: 'Success',
          description: "Product Created Successfully",
          variant: "success"
        })
      } else {
        console.log("ERROR", response)
        toast({
          title: "Error",
          variant: 'destructive',
          description: response.payload
        })

      }
    }
    catch (error) {
      console.log("ERROR", error)
    }
  };

  const onSubmitType = async (typeData) => {
    const response = await dispatch(createType(typeData))
    if (response.payload.success) {
      toast({
        title: 'Success',
        description: "Type Created Successfully",
        variant: "success"
      })
    } else {
      console.log("ERROR", response)
      toast({
        title: "Error",
        variant: 'destructive',
        description: response.payload
      })

    }
  };
  const onSubmitWork =async (data) => {
    try{
    const response = await dispatch(createWork(data))
    if (response.payload.success) {
      toast({
        title: 'Success',
        description: "Work Created Successfully",
        variant: "success"
      })
    } else {
      toast({
        title: "Error",
        variant: 'destructive',
        description: response.payload
      })

    }}
    catch(error){
      console.log("ERROR",error)
    }
  };

  useEffect(() => {
    dispatch(getAllProducts());
  }, [])
  useEffect(() => {
    if (selectedProduct) {
      dispatch(getAllTypesByProductId(selectedProduct))
    }
  }, [selectedProduct])


  return (
    <div className="flex flex-col gap-4 p-4 border bg-white rounded-lg shadow-md">
      <div>
        <Label className="text-xl mb-2">Create Product</Label>
      </div>
      {/* Add Product */}
      <div>
        <Label>Product Name</Label>
        <Input {...register("productName")} placeholder="Enter product name" />
        {errors.productName && <p className="text-red-500 text-xs">{errors.productName.message}</p>}
      </div>
      <Button onClick={handleSubmit(onSubmitProduct)}>Add Product</Button>

      {/* Add Type */}
      <div>
        <Label>Select Product</Label>
        <Select onValueChange={(value) => {
          setValueType("productId", value);
          setValueWork("productId",value);
          setSelectedProduct(value)
        }
        }>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products?.map((product, index) => (
              <SelectItem key={index} value={product._id}>
                {product.productName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorsType.productId && <p className="text-red-500 text-xs">{errorsType.productId.message}</p>}
      </div>
      <div>
        <Label>Type Name</Label>
        <Input {...registerType("typeName")} placeholder="Enter type name" />
        {errorsType.typeName && <p className="text-red-500 text-xs">{errorsType.typeName.message}</p>}
      </div>
      <Button onClick={handleSubmitType(onSubmitType)}>Add Type</Button>

      {/* Add Work */}
      <div>
        <Label>Type</Label>
        <Select onValueChange={(value) => {setValueWork("typeId", value)
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {types?.map((type, index) => (
              <SelectItem key={index} value={type._id}>
                {type.typeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorsWork.selectedType && <p className="text-red-500 text-xs">{errorsWork.selectedType.message}</p>}
      </div>

      <div>
        <Label>Work Name</Label>
        <Input {...registerWork("workName")} placeholder="Enter work name" />
        {errorsWork.workName && <p className="text-red-500 text-xs">{errorsWork.workName.message}</p>}
      </div>
      <div className="flex gap-2 w-full">
        <div className="w-full">
          <Label>Rent</Label>
          <Input {...registerWork("rent")} placeholder="Enter rent" />
          {errorsWork.rent && <p className="text-red-500 text-xs">{errorsWork.rent.message}</p>}
        </div>
        <div className="w-full">
          <Label>Advance</Label>
          <Input {...registerWork("advance")} placeholder="Enter advance" />
          {errorsWork.advance && <p className="text-red-500 text-xs">{errorsWork.advance.message}</p>}
        </div>
      </div>
      <Button onClick={handleSubmitWork(onSubmitWork)}>Add Work</Button>
    </div>
  );
};

export default ProductCreation;
