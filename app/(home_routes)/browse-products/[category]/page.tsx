import React from "react";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";
import StickySearch from "@components/StickySearchBar";
import CategoryMenu from "@components/CategoryMenu";

interface Props {
  params: { category: string };
}

interface FetchedProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: { base: number; discounted: number };
  sale: number;
  rating: number;
  outOfStock: boolean;
}

const fetchProductsByCategory = async (category: string) => {
  try {
    await startDb();
    const products = await ProductModel.find({ category })
      .sort({ "-createdAt": -1 })
      .limit(20);

    const finalProducts = products.map((product) => ({
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail.url,
      price: product.price,
      sale: product.sale,
      rating: product.rating,
      outOfStock: product.quantity <= 0,
    }));

    return JSON.stringify(finalProducts);
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`카테고리를 읽어오는데 실패했습니다. ${error.message}`);
  }
};

export default async function ProductByCategory({ params }: Props) {
  const category = decodeURIComponent(params.category);
  const products: FetchedProduct[] = JSON.parse(
    await fetchProductsByCategory(category)
  );

  return (
    <>
      <StickySearch />
      <div className="py-4 space-y-4">
        <div className="hidden md:block">
          <CategoryMenu />
        </div>
        {products.length ? (
          <GridView>
            {products.map((product: FetchedProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </GridView>
        ) : (
          <div className=" md:m-10 md:pt-10 mx-auto text-center">
            <p className=" text-blue-900 font-semibold text-lg md:text-2xl opacity-80">
              {`${category} 상품을 준비중입니다.`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
