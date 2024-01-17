"use client";

import ProductForm from "@components/ProductForm";
import { NewProductInfo } from "@app/types";
import { uplaodImage } from "@utils/cloudinaryUplaodHelper";
import { newProductInfoSchema } from "@utils/validationSchema";
import React from "react";
import { toast } from "react-toastify";
import { ValidationError } from "yup";
import { createProduct } from "@app/(admin_routes)/products/action";
import { useRouter } from "next/navigation";

export default function Create() {
  const router = useRouter();

  const handlCreateProduct = async (values: NewProductInfo) => {
    const { thumbnail, images } = values;
    try {
      // abortEarly: false 로 하면 모든 검사를 끝낸 후 마지막에 에러를 표시
      await newProductInfoSchema.validate(values, { abortEarly: false });

      const thumbnailRes = await uplaodImage(thumbnail!);

      let productImages: { url: string; id: string }[] = [];
      if (images) {
        const uploadPromise = images.map(async (imageFile) => {
          const { url, id } = await uplaodImage(imageFile);
          return { url, id };
        });
        productImages = await Promise.all(uploadPromise);
      }

      await createProduct({
        ...values,
        price: { base: values.mrp, discounted: values.salePrice },
        thumbnail: thumbnailRes,
        images: productImages,
      });

      router.refresh();
      router.push("/products");
    } catch (error: any) {
      if (error instanceof ValidationError) {
        error.inner.map((err) => {
          toast.warning(err.message);
        });
      }
    }
  };

  return (
    <div>
      {/* ProductForm 에서 onSubmit 함수를 내려줌으로써 */}
      {/* onSubmit 함수속에  cloudinary를 handling 하는 함수를 넣어서 내려보낸다.*/}
      <ProductForm onSubmit={handlCreateProduct} />
    </div>
  );
}
