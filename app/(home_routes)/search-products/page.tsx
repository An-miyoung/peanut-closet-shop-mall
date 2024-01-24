import startDb from "@lib/db";
import ProductModel, { ProductDocument } from "@models/productModel";
import React from "react";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";
import { SearchProductNotFound } from "@components/404";
import SearchFilter from "@components/SearchFilter";
import { FilterQuery } from "mongoose";

type options = {
  query: string;
  priceSort?: "asc" | "desc";
  maxRating?: number;
  minRating?: number;
};

interface Props {
  searchParams: options;
}

interface SearchProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  sale: number;
  price: {
    base: number;
    discounted: number;
  };
  rating?: number;
  outOfStock: boolean;
}

const searchProducts = async (options: options): Promise<SearchProduct[]> => {
  const { query, priceSort, maxRating, minRating } = options;

  await startDb();
  // 적용할 필터를 object 로 만든다. ProductModel.find 에 마우스를 대고 type을 찾아낸다.
  const filter: FilterQuery<ProductDocument> = {
    title: { $regex: query, $options: "i" },
  };
  // minRating 과 maxRating 이 존재하는 것만 체크해서는 안되고 숫자값이 들어와있는지 확인
  if (typeof minRating === "number" && typeof maxRating === "number") {
    const minCondition = minRating >= 0;
    const maxCondition = maxRating <= 5;
    if (minCondition && maxCondition) {
      // ProductModel.find({filter: {$gte: minRating, $lte: maxRating }}) 로 바로 쓸수 있도록 코딩
      filter.rating = { $gte: minRating, $lte: maxRating };
    }
  }

  // sort({'price.discounted': priceSort}) 라고 하면 priceSort 가 undefined 할 가능성때문에 error
  const products = await ProductModel.find({ ...filter })
    .sort({ "price.discounted": priceSort === "asc" ? 1 : -1 })
    .limit(10);

  return products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      thumbnail: product.thumbnail.url,
      description: product.description,
      price: {
        base: product.price.base,
        discounted: product.price.discounted,
      },
      sale: product.sale,
      category: product.category,
      rating: product.rating,
      outOfStock: product.quantity <= 0,
    };
  });
};

export default async function SearchProductPage({ searchParams }: Props) {
  const { query, maxRating, minRating } = searchParams;
  // maxRating 과 minRating이 숫자로 들어가도록 한번 더 바꿔서 넣어준다.
  const products = await searchProducts({
    ...searchParams,
    maxRating: maxRating ? +maxRating : undefined,
    minRating: minRating ? +minRating : undefined,
  });

  return (
    <div className="p-4">
      <SearchFilter>
        <div className="flex justify-start items-baseline  text-blue-gray-600 mb-2">
          <h1 className=" font-semibold text-lg">{`"${query}" `}</h1>
          <h3 className=" pl-2 text-sm">검색 결과</h3>
        </div>
        {products.length > 0 ? (
          <GridView>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </GridView>
        ) : (
          <SearchProductNotFound />
        )}
      </SearchFilter>
    </div>
  );
}
