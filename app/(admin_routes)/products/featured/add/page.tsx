import startDb from "@lib/db";
import FeaturedProductModel from "@models/featuredProductModel";
import FeaturedProductForm from "@components/FeaturedProductForm";
import FeaturedProductTable from "@components/FeaturedProductTable";
import React from "react";

const fetchFeaturedProduct = async () => {
  await startDb();
  const products = await FeaturedProductModel.find();

  return JSON.stringify(
    products.map((product) => {
      return {
        id: product._id.toString(),
        banner: product.banner,
        title: product.title,
        link: product.link,
        linkTitle: product.linkTitle,
      };
    })
  );
};

export default async function AddFeaturedProduct() {
  const products = JSON.parse(await fetchFeaturedProduct());
  return (
    <>
      <FeaturedProductForm />
      <FeaturedProductTable products={products} />
    </>
  );
}
