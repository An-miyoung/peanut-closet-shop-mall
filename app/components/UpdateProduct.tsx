"use client";

import React from "react";
import ProductForm, { InitialValue } from "@components/ProductForm";
import { NewProductInfo, ProductResponse, ProductToUpdate } from "@app/types";
import {
  removeAndUpdateProductImages,
  removeImageFromCloud,
  updateProduct,
} from "@app/(admin_routes)/products/action";
import { updateProductInfoSchema } from "@utils/validationSchema";
import { uplaodImage } from "@utils/cloudinaryUplaodHelper";
import { ValidationError } from "yup";
import { toast } from "react-toastify";
import { extractPublicId } from "@utils/extractPublicIdHelper";
import { useRouter } from "next/navigation";

interface Props {
  product: ProductResponse;
}

export default function UpdateProduct({ product }: Props) {
  const router = useRouter();
  const initialValue: InitialValue = {
    ...product,
    bulletPoints: product.bulletPoints || [],
    thumbnail: product.thumbnail.url,
    images: product.images?.map((image) => image.url),
    mrp: product.price.base,
    salePrice: product.price.discounted,
  };

  const handleUpdateProduct = async (values: NewProductInfo) => {
    const { thumbnail, images } = values;
    try {
      // abortEarly: false 로 하면 모든 검사를 끝낸 후 마지막에 에러를 표시
      await updateProductInfoSchema.validate(values, { abortEarly: false });

      //  type 을 {[key:string]:any} 라고 한 후 나중에 정확한 type을 만들어서 재정의할 수 있다.
      const dataToUpdate: ProductToUpdate = {
        title: values.title,
        description: values.description,
        bulletPoints: values.bulletPoints,
        price: {
          base: values.mrp,
          discounted: values.salePrice,
        },
        category: values.category,
        quantity: values.quantity,
      };
      // thumbnail 을 수정하는 경우
      if (thumbnail) {
        await removeImageFromCloud(product.thumbnail.id);
        const { id, url } = await uplaodImage(thumbnail!);
        dataToUpdate.thumbnail = { id, url };
      }

      if (images && images.length !== 0) {
        const uploadPromise = images?.map(async (imageFile) => {
          return await uplaodImage(imageFile);
        });
        dataToUpdate.images = await Promise.all(uploadPromise);
      }

      // update DB
      await updateProduct(product.id, dataToUpdate);

      router.refresh();
      router.push("/products");
    } catch (error: any) {
      if (error instanceof ValidationError) {
        error.inner.map((err) => {
          toast.warning(err.message);
        });
      }
      console.log(error.message);
    }
  };

  const handleImageRemove = async (source: string) => {
    const publicId = extractPublicId(source);
    await removeAndUpdateProductImages(product.id, publicId);
  };

  return (
    <ProductForm
      initialValue={initialValue}
      onSubmit={handleUpdateProduct}
      onImageRemove={handleImageRemove}
    />
  );
}
