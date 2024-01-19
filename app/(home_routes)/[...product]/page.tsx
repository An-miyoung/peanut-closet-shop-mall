import ProductView from "@components/ProductView";
import startDb from "@lib/db";
// import ReviewModel from "@models/reviewModel";
import ProductModel from "@models/productModel";
import { ObjectId, isValidObjectId } from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import UserModel from "@/app/models/userModel";
// import ReviewsList from "@components/ReviewList";
import SimilarProductsList from "@components/SimilarProductsList";
// import { updateOrCreateHistory } from "@models/historyModel";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
// import WishlistModel from "@/app/models/wishListModel";

interface Props {
  params: { product: string[] };
}

const fetchOneProduct = async (productId: string) => {
  if (!isValidObjectId(productId)) return redirect("/404");
  await startDb();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");

  const session = await getServerSession(authConfig);
  if (!session?.user) return redirect("/auth/signin");

  await startDb();
  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) return redirect("/auth/signin");

  const userId = user.id;
  let isWishList = false;
  // // 방문기록 남기기
  // await updateOrCreateHistory(userId, product._id.toString());
  // // 찜한 내역 가져오기
  // const wishList = await WishlistModel.findOne({
  //   user: userId,
  //   products: product._id.toString(),
  // });
  // isWishList = wishList ? true : false;

  const finalProducts = {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    bulletPoints: product.bulletPoints,
    category: product.category,
    thumbnail: product.thumbnail.url,
    images: product.images?.map((image) => image.url),
    price: product.price,
    sale: product.sale,
    rating: product.rating,
    outOfStock: product.quantity <= 0,
    isWishList,
  };

  return JSON.stringify(finalProducts);
};

const fetchSimilarProduct = async (category: string) => {
  await startDb();
  const products = await ProductModel.find({ category })
    .sort({ rating: -1 })
    .limit(10);

  return products.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    thumbnail: product.thumbnail.url,
    price: product.price.discounted,
  }));
};

// const fetchProductReviews = async (productId: string) => {
//   await startDb();
//   const productReviews = await ReviewModel.find({
//     product: productId,
//   })
//     .populate<{
//       userId: { _id: ObjectId; name: string; avatar?: { url: string } };
//     }>({
//       path: "userId",
//       select: "_id name avatar.url",
//       model: UserModel,
//     })
//     .sort("-createdAt");

//   const finalReviews = productReviews.map((review) => ({
//     id: review._id.toString(),
//     rating: review.rating,
//     comment: review.comment,
//     date: review.createdAt,
//     userInfo: {
//       id: review._id.toString(),
//       name: review.userId.name,
//       avatar: review.userId.avatar?.url,
//     },
//   }));

//   return JSON.stringify(finalReviews);
// };

export default async function ProductPage({ params }: Props) {
  const { product } = params;
  const productId = product[1];

  const productInfo = JSON.parse(await fetchOneProduct(productId));

  // thumbnail 까지 모두 이미지로 넣어주기 위해서
  let productImages = [productInfo.thumbnail];
  if (productInfo.images) {
    productImages = productImages.concat(productInfo.images);
  }

  const similarProducts = await fetchSimilarProduct(productInfo.category);

  // const reviews = JSON.parse(await fetchProductReviews(productId));

  return (
    <div className="p-4">
      <ProductView
        title={productInfo.title}
        description={productInfo.description}
        images={productImages}
        points={productInfo.bulletPoints}
        price={productInfo.price}
        sale={productInfo.sale}
        rating={productInfo.rating}
        outOfStock={productInfo.outOfStock}
        isWishList={productInfo.isWishList}
      />
      <div>
        <h1 className="text-lg text-blue-gray-600 font-semibold mb-2">
          관심있을만한 상품
        </h1>
        <SimilarProductsList products={similarProducts} />
      </div>
      <div className="py-4 space-y-1">
        <div className="flex justify-between items-center ">
          <h1 className="text-lg text-blue-gray-600 font-semibold mb-2">
            상품후기
          </h1>
          <Link href={`/add-review/${productInfo.id}`}>
            <p className=" text-blue-gray-600 ">후기쓰기</p>
          </Link>
        </div>
        {/* <ReviewsList reviews={reviews} /> */}
      </div>
    </div>
  );
}
