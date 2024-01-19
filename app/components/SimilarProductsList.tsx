import React from "react";
import HorizontalMenu from "./HorizontalMenu";
import Link from "next/link";
import Image from "next/image";
import { rgbDataURL } from "../utils/blurDataUrl";

interface Props {
  products: {
    id: string;
    title: string;
    thumbnail: string;
    price: number;
  }[];
}

export default function SimilarProductsList({ products }: Props) {
  return (
    <HorizontalMenu title="">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/${product.title}/${product.id}`}
          scroll={false}
          className="mr-2 space-y-2"
        >
          {/* 작은 화면 */}
          <div className="md:hidden w-[80px]">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={80}
              height={80}
              priority
              style={{ width: "80px", height: "80px" }}
              placeholder="blur"
              blurDataURL={rgbDataURL(237, 181, 6)}
            />
          </div>
          <div className="hidden md:flex md:w-[150px]">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={150}
              height={150}
              priority
              style={{ width: "150px", height: "150px" }}
              placeholder="blur"
              blurDataURL={rgbDataURL(237, 181, 6)}
            />
          </div>
          <div className="hidden md:block">
            <h2 className="text-sm line-clamp-3">{product.title}</h2>
            <h2 className="text-sm line-clamp-3">{`${product.price.toLocaleString()}원`}</h2>
          </div>
        </Link>
      ))}
    </HorizontalMenu>
  );
}
