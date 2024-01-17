import React from "react";
import BuyingOptions from "@components/BuyingOptions";
import ProductImageGallery from "@components/ProductImageGallery";
import Rating from "./Rating";

interface Props {
  title: string;
  description: string;
  images: string[];
  points?: string[];
  price: { base: number; discounted: number };
  sale: number;
  rating?: number;
  outOfStock: boolean;
  isWishList?: boolean;
}

export default function ProductView({
  description,
  images,
  title,
  points,
  price,
  sale,
  rating,
  outOfStock,
  isWishList,
}: Props) {
  return (
    <div className="flex lg:flex-row flex-col md:gap-4 gap-2">
      <div className="flex-1 lg:self-start self-center">
        {/* Product Image Slider */}
        <ProductImageGallery images={images} />
      </div>

      <div className="flex-1 md:space-y-4 space-y-2">
        <h1 className="md:text-3xl text-xl font-semibold">{title}</h1>
        <p>{description}</p>

        <div className="pl-4 pb-2 space-y-2 text-sm md:text-base">
          {points?.map((point, index) => {
            return <li key={index}>{point}</li>;
          })}
        </div>

        <div>
          {rating ? (
            <Rating value={parseFloat(rating.toFixed(1))} />
          ) : (
            <Rating value={0} />
          )}
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <p className="line-through text-base text-gray-600">
            {`${price.base.toLocaleString()}원`}
          </p>
          <p className="font-bold uppercase whitespace-nowrap select-none bg-deep-orange-500 text-white py-1.5 px-3 text-xs rounded-lg">
            {`${sale}% 할인`}
          </p>
          <p className=" font-semibold text-xl">
            {`${price.discounted.toLocaleString()}원`}
          </p>
        </div>

        <div className="flex py-4">
          {outOfStock ? (
            <div className="text-center text-red-500 text-lg pt-4">
              <p>품절입니다.</p>
              <p>빠르게 상품을 준비하겠습니다.</p>
            </div>
          ) : (
            <BuyingOptions wishList={isWishList} />
          )}
        </div>
      </div>
    </div>
  );
}
