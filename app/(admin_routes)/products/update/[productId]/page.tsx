import startDb from "@lib/db";
import React from "react";
import { isValidObjectId } from "mongoose";
import UpdateProduct from "@components/UpdateProduct";
import { ProductResponse } from "@app/types";
import { redirect } from "next/navigation";
import ProductModel from "@models/productModel";

interface Props {
  params: { productId: string };
}

const fetchProductInfo = async (productId: string): Promise<string> => {
  if (!isValidObjectId(productId)) return redirect("/404");

  await startDb();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");

  const finalProduct: ProductResponse = {
    id: product._id.toString(),
    title: product.title,
    bulletPoints: product.bulletPoints,
    thumbnail: product.thumbnail,
    images: product.images?.map(({ url, id }) => ({ url, id })),
    description: product.description,
    price: product.price,
    category: product.category,
    quantity: product.quantity,
  };

  return JSON.stringify(finalProduct);
};

export default async function UpdatePage(props: Props) {
  const { productId } = props.params;

  const product = JSON.parse(await fetchProductInfo(productId));

  return <UpdateProduct product={product} />;
}
