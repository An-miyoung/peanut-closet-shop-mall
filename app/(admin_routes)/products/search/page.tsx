import ProductTable from "@components/ProductTable";
import startDb from "@lib/db";
import { Product } from "@app/types";
import React from "react";
import ProductModel from "@/app/models/productModel";

interface Props {
  searchParams: { query: string };
}

const searchProducts = async (query: string): Promise<Product[]> => {
  await startDb();
  const products = await ProductModel.find({
    title: { $regex: query, $options: "i" },
  })
    .sort("-createdAt")
    .limit(10);

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

export default async function AdminSearchPage({ searchParams }: Props) {
  const { query } = searchParams;

  const products = await searchProducts(query);

  return (
    <div>
      <ProductTable
        products={products}
        currentPageNo={1}
        hasMore={false}
        showPageNavigator={false}
      />
    </div>
  );
}
