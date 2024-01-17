"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@material-tailwind/react";
import CartCountUpdater from "@components/CartCountUpdater";
import { useParams, useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
// import { Wishlist } from "@ui/WishList";

interface Props {
  wishList?: boolean;
}

export default function BuyingOptions({ wishList }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // 자신은 page.tsx 가 아니라 params 가 없지만 useParams 로 부르는 컴포넌트의 params 가져올수 있다.
  const params = useParams();
  const router = useRouter();

  const { product } = params;
  const productId = product[1];
  const { loggedIn } = useAuth();

  const handleIncrement = () => {
    setQuantity((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    if (quantity === 0) return;
    setQuantity((prevCount) => prevCount - 1);
  };

  const addToCart = async () => {
    if (!productId) return;
    if (!loggedIn) return router.push("/auth/signin");

    const res = await fetch("/api/product/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.warning(error.message);

    router.refresh();
  };

  const updateWishlist = async () => {
    if (!productId) return;
    if (!loggedIn) return router.push("/auth/signin");

    const res = await fetch("/api/product/wishList", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.warning(error.message);

    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2">
      <CartCountUpdater
        onDecrement={handleDecrement}
        onIncrement={handleIncrement}
        value={quantity}
      />

      <Button
        placeholder=""
        variant="text"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => await addToCart());
        }}
      >
        장바구니
      </Button>
      <Button
        placeholder=""
        color="amber"
        disabled={isPending}
        className="rounded-full"
      >
        구매하기
      </Button>
      {/* <Button
        placeholder=""
        variant="text"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => await updateWishlist());
        }}
      >
        <Wishlist isActive={wishList} />
      </Button> */}
    </div>
  );
}
