import React from "react";
import startDb from "@lib/db";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";
import StickySearch from "@components/StickySearchBar";
import CategoryMenu from "@components/CategoryMenu";
import ProductModel from "@models/productModel";
import FeaturedProductModel from "@models/featuredProductModel";
import FeaturedProductsSlider from "@components/FeaturedProductSlider";

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

const fetchFeaturedProduct = async () => {
  try {
    await startDb();
    const products = await FeaturedProductModel.find().sort({ createdAt: -1 });
    const finalProducts = products.map((product) => ({
      id: product._id.toString(),
      title: product.title,
      banner: product.banner.url,
      link: product.link,
      linkTitle: product.linkTitle,
    }));

    return JSON.stringify(finalProducts);
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`상품목록을 읽어오는데 실패했습니다. ${error.message}`);
  }
};

const fetchLatestProducts = async () => {
  try {
    await startDb();
    const products = await ProductModel.find().sort("-createdAt").limit(20);

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
    throw new Error(`featured목록을 읽어오는데 실패했습니다. ${error.message}`);
  }
};

export default async function Home() {
  const featuredProducts = JSON.parse(await fetchFeaturedProduct());
  const products: FetchedProduct[] = JSON.parse(await fetchLatestProducts());
  return (
    <>
      <StickySearch />
      <div className="py-4 space-y-4">
        <div className="hidden md:block">
          <CategoryMenu />
        </div>
        <FeaturedProductsSlider products={featuredProducts} />
        <GridView>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </GridView>
      </div>
    </>
  );
}
