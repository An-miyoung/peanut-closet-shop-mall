"use client";

import React, { useState } from "react";
import CartCountUpdater from "@components/CartCountUpdater";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { rgbDataURL } from "@utils/blurDataUrl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface Product {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  totalPrice: number;
  quantity: number;
}

interface CartItemsProps {
  products: Product[];
  cartTotal: number;
  totalQty: number;
  cartId: string;
}

const CartItems: React.FC<CartItemsProps> = ({
  products = [],
  totalQty,
  cartTotal,
  cartId,
}) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const updateCart = async (productId: string, quantity: number) => {
    setBusy(true);

    await fetch("/api/product/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });

    router.refresh();
    setBusy(false);
  };

  const handleCheckout = async () => {
    setBusy(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ cartId }),
    });

    const { error, url } = await res.json();
    if (!res.ok) {
      toast.warning(error);
      router.refresh();
    } else {
      // 결제 url 로 이용
      window.location.href = url;
    }
    setBusy(false);
  };

  return (
    <div>
      {/* 큰 화면 */}
      <div className="hidden md:flex md:px-2">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-4">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    height={50}
                    width={50}
                    priority
                    style={{ width: "50px", height: "50px" }}
                    placeholder="blur"
                    blurDataURL={rgbDataURL(128, 138, 156)}
                  />
                </td>
                <td className="py-4 ">{product.title}</td>
                <td className="py-4 text-sm font-semibold">
                  {`${product.totalPrice.toLocaleString()}원`}
                </td>
                <td className="py-4 ">
                  <CartCountUpdater
                    onDecrement={() => {
                      updateCart(product.id, -1);
                    }}
                    onIncrement={() => {
                      updateCart(product.id, 1);
                    }}
                    value={product.quantity}
                    disabled={busy}
                  />
                </td>
                <td className="py-4 text-right">
                  <button
                    disabled={busy}
                    className="text-blue-gray-500"
                    style={{ opacity: busy ? "0.5" : "1" }}
                    onClick={() => {
                      updateCart(product.id, -product.quantity);
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 모바일 화면 */}
      <div className=" md:hidden px-2 pb-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-row p-4 border-b border-blue-gray-200"
          >
            <div className="flex items-center justify-between pb-3">
              <div className="text-lg font-semibold">{product.title}</div>
              <button
                disabled={busy}
                className="text-blue-gray-500"
                style={{ opacity: busy ? "0.5" : "1" }}
                onClick={() => {
                  updateCart(product.id, -product.quantity);
                }}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2">
              <Image
                src={product.thumbnail}
                alt={product.title}
                height={40}
                width={40}
                priority
                style={{ width: "40px", height: "40px" }}
                placeholder="blur"
                blurDataURL={rgbDataURL(128, 138, 156)}
              />
              <div>
                <div className="text-base font-semibold">
                  {`${product.totalPrice.toLocaleString()}원`}
                </div>
                <div className="">
                  <CartCountUpdater
                    onDecrement={() => {
                      updateCart(product.id, -1);
                    }}
                    onIncrement={() => {
                      updateCart(product.id, 1);
                    }}
                    value={product.quantity}
                    disabled={busy}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-end items-end space-y-4">
        <div className="flex justify-end space-x-4 text-blue-gray-800">
          <p className="font-semibold text-2xl">총합</p>
          <div>
            <p className="font-semibold text-2xl">{`${cartTotal.toLocaleString()}원`}</p>
            <p className="text-right text-sm">{totalQty} 개</p>
          </div>
        </div>
        <Button
          placeholder=""
          className="shadow-none hover:shadow-none  focus:shadow-none focus:scale-105 active:scale-100"
          color="green"
          disabled={busy}
          onClick={handleCheckout}
        >
          결제하기
        </Button>
      </div>
    </div>
  );
};

export default CartItems;
