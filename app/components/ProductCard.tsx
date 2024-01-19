"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  CardFooter,
  Chip,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import truncate from "truncate";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import { useTransition } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Rating from "./Rating";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Props {
  product: {
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
  };
}

export default function ProductCard({ product }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { loggedIn } = useAuth();

  const addToCart = async () => {
    if (!product.id) return;
    if (!loggedIn) return router.push("/auth/signin");

    const res = await fetch("/api/product/cart", {
      method: "POST",
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.warning(error.message);

    router.refresh();
  };

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout/instance", {
      method: "POST",
      body: JSON.stringify({ productId: product.id }),
      headers: { "Content-Type": "application/json" },
    });

    const { error, url } = await res.json();
    if (!res.ok) {
      toast.warning(error);
      router.refresh();
    } else {
      // 결제 url 로 이용
      router.push(url);
    }
  };

  return (
    <Card placeholder="" className="w-full">
      <Link
        className="w-full"
        href={`/${product.title}/${product.id}`}
        scroll={false}
      >
        <CardHeader
          placeholder=""
          shadow={false}
          floated={false}
          className="relative w-full aspect-square m-0"
        >
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute right-0 p-2">
            <Chip color="red" value={`${product.sale}% 할인`} />
          </div>
        </CardHeader>
        <CardBody placeholder="">
          <div className="mb-2">
            <h3 className="line-clamp-1 font-medium text-blue-gray-800">
              {truncate(product.title, 50)}
            </h3>
            <div className="flex justify-end">
              {product.rating ? (
                <Rating value={parseFloat(product.rating.toFixed(1))} />
              ) : (
                <Rating value={0} />
              )}
            </div>
          </div>
          <div className="flex justify-end items-center space-x-2 mb-2">
            <Typography
              placeholder=""
              color="blue-gray"
              className="font-medium line-through decoration-deep-orange-500"
            >
              {product.price.base.toLocaleString()}원
            </Typography>
            <Typography
              placeholder=""
              color="blue-gray"
              className="font-medium"
            >
              {product.price.discounted.toLocaleString()}원
            </Typography>
          </div>
          <div className="sm:h-14">
            <p className="font-normal text-sm opacity-75 line-clamp-3">
              {product.description}
            </p>
          </div>
        </CardBody>
      </Link>
      <CardFooter placeholder="" className="pt-0 space-y-4">
        {product.outOfStock ? (
          <div className=" text-red-500 text-lg lg:text-base pt-6">
            <p>품절입니다.</p>
            <p>빠르게 상품을 준비하겠습니다.</p>
          </div>
        ) : (
          <>
            <Button
              placeholder=""
              onClick={() => startTransition(async () => await addToCart())}
              ripple={false}
              fullWidth={true}
              className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
              disabled={isPending}
            >
              장바구니에 넣기
            </Button>
            <Button
              placeholder=""
              onClick={() =>
                startTransition(async () => await handleCheckout())
              }
              ripple={false}
              fullWidth={true}
              className="bg-blue-400 text-white shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
              disabled={isPending}
            >
              바로 구매하기
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
