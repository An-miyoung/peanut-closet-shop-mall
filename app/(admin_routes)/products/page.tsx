import startDb from "@lib/db";
import ProductTable from "@components/ProductTable";
import React from "react";
import { Product } from "@app/types";
import { redirect } from "next/navigation";
import ProductModel from "@models/productModel";

const PRODUCT_PER_PAGE = 10;

interface Props {
  searchParams: { page: string };
}

const fetchProducts = async (
  pageNo: number,
  perPage: number
): Promise<Product[]> => {
  const skipCount = (pageNo - 1) * perPage;

  await startDb();
  const products = await ProductModel.find()
    // .sort({ createdAt: -1 })
    .skip(skipCount)
    .limit(perPage);

  return products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      thumbnail: product.thumbnail.url,
      description: product.description,
      price: {
        mrp: product.price.base,
        salePrice: product.price.discounted,
        saleOff: product.sale,
      },
      category: product.category,
      quantity: product.quantity,
    };
  });
};

export default async function Products({ searchParams }: Props) {
  // 최초의 페이지는 '?page=1"라고 url 에 붙지 않으니 default 값을 준다.
  const { page = "1" } = searchParams;
  if (isNaN(+page)) return redirect("/404");

  const products = await fetchProducts(+page, PRODUCT_PER_PAGE);
  let hasMore = true;

  // 매 페이지마다 10개의 상품을 fetch 해 오는데, 10개보다 적은 상품이 있는 경우 마지막이리고 인지
  if (products.length < PRODUCT_PER_PAGE) hasMore = false;
  else hasMore = true;

  return (
    <ProductTable
      products={products}
      currentPageNo={+page}
      hasMore={hasMore}
      showPageNavigator={true}
    />
  );
}
