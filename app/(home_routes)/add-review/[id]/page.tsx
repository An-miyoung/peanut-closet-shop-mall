import React from "react";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { authConfig } from "@/auth";
import startDb from "@lib/db";
import ReviewModel from "@models/reviewModel";
import ProductModel from "@models/productModel";
import { PageNotFound } from "@components/404";
import UserModel from "@models/userModel";
import ReviewForm from "@components/ReviewForm";

interface Props {
  params: { id: string };
}

const fetchMyReview = async (productId: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) return redirect("/auth/signin");

  await startDb();
  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) return redirect("/auth/signin");

  const userId = user.id;
  if (!isValidObjectId(productId)) return redirect("/404");

  const reviewContent = await ReviewModel.findOne({
    userId,
    product: productId,
  }).populate<{ product: { title: string; thumbnail: { url: string } } }>({
    path: "product",
    select: "title thumbnail.url",
    model: ProductModel,
  });

  if (!reviewContent) return null;

  return {
    id: reviewContent._id.toString(),
    rating: reviewContent.rating,
    comment: reviewContent.comment,
    product: {
      title: reviewContent.product.title,
      thumbnail: reviewContent.product.thumbnail.url,
    },
  };
};

const fetchProductInfo = async (productId: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) return redirect("/auth/signin");
  if (!isValidObjectId(productId)) return redirect("/404");

  await startDb();
  const productInfo = await ProductModel.findById(productId);

  if (!productInfo) return null;

  return {
    title: productInfo.title,
    thumbnail: productInfo.thumbnail.url,
  };
};

export default async function Review({ params }: Props) {
  const productId = params.id;
  if (!isValidObjectId(productId)) return <PageNotFound />;

  const review = await fetchMyReview(productId);

  const productInfo = await fetchProductInfo(productId);
  if (!productInfo) return <PageNotFound />;

  const initialValue = review
    ? {
        comment: review.comment || "",
        rating: review.rating,
      }
    : undefined;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Image
          src={productInfo.thumbnail}
          alt={productInfo.title}
          width={50}
          height={50}
          style={{ width: "auto", height: "auto" }}
          priority
          className=" rounded"
        />
        <h3 className="font-semibold">{productInfo.title}</h3>
      </div>
      <ReviewForm productId={productId} initialValue={initialValue} />
    </div>
  );
}
