import EmptyPage from "@components/EmptyPage";
import WishlistProductCard from "@components/WishlistProductCard";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import UserModel from "@models/userModel";
import WishlistModel from "@models/wishListModel";
import { authConfig } from "@/auth";
import { ObjectId, isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const fetchWishlist = async () => {
  const session = await getServerSession(authConfig);
  if (!session?.user) return redirect("/auth/signin");

  await startDb();
  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) return redirect("/404");

  const wishlist = await WishlistModel.findOne({
    user: user.id,
  }).populate<{
    products: {
      _id: ObjectId;
      title: string;
      thumbnail: { url: string };
      price: { discounted: number };
    }[];
  }>({
    path: "products",
    select: "title thumbnail.url price.discounted",
    model: ProductModel,
  });

  if (!wishlist) return [];

  return wishlist.products.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    thumbnail: product.thumbnail.url,
    price: product.price.discounted,
  }));
};

export default async function WishList() {
  const products = await fetchWishlist();

  if (products.length === 0) return <EmptyPage title="찜한 상품" />;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-blue-gray-600 text-lg pt-4">찜한 목록</h1>
      {products.map((product) => (
        <WishlistProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
