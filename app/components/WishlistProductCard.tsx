"use client";

import Image from "next/image";
import React, { useTransition } from "react";
import { rgbDataURL } from "@utils/blurDataUrl";
import { Button } from "@material-tailwind/react";
import { Wishlist } from "@ui/WishList";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  product: {
    id: string;
    title: string;
    thumbnail: string;
    price: number;
  };
}

export default function WishlistProductCard({ product }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { id, title, thumbnail, price } = product;

  const updateWishlist = async () => {
    if (!id) return;

    const res = await fetch("/api/product/wishList", {
      method: "POST",
      body: JSON.stringify({ productId: id }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.warning(error.message);

    router.refresh();
  };

  return (
    <div className="md:w-1/3 flex space-x-2 items-center">
      <Image
        src={thumbnail}
        alt={title}
        width={100}
        height={100}
        priority
        style={{ width: "100px", height: "100px" }}
        placeholder="blur"
        blurDataURL={rgbDataURL(128, 138, 156)}
      />
      <Link href={`/${title}/${id}`} className="flex-1 h-full" scroll={false}>
        <h1 className="font-semibold text-blue-gray-700">{title}</h1>
        <p>{`${price.toLocaleString()}원`}</p>
      </Link>

      <Button
        placeholder=""
        variant="text"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => await updateWishlist());
        }}
      >
        <Wishlist isActive />
      </Button>
    </div>
  );
}
