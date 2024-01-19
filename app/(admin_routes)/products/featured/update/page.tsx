import FeaturedProductForm from "@/app/components/FeaturedProductForm";
import startDb from "@/app/lib/db";
import FeaturedProductModel from "@/app/models/featuredProductModel";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  searchParams: { id: string };
}

const fetchFeaturedProduct = async (id: string) => {
  if (!isValidObjectId(id)) return redirect("404");

  await startDb();
  const product = await FeaturedProductModel.findById(id);
  if (!product) return redirect("/404");

  return JSON.stringify({
    id: product._id.toString(),
    banner: product.banner.url,
    title: product.title,
    link: product.link,
    linkTitle: product.linkTitle,
  });
};

export default async function UpdatePage({ searchParams }: Props) {
  const { id } = searchParams;
  const product = JSON.parse(await fetchFeaturedProduct(id));

  return <FeaturedProductForm initialValue={product} />;
}
