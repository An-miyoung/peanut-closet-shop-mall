"use client";

import { Button, Rating } from "@material-tailwind/react";
import { StarIcon as RatedIcon } from "@heroicons/react/24/solid";
import { StarIcon as UnratedIcon } from "@heroicons/react/24/outline";
import React, { useState, FormEventHandler, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  initialValue?: { rating: number; comment: string };
}

export default function ReviewForm({ productId, initialValue }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });

  // 특별히 FormEventHandler<HTMLFormElement> 선언한 이유는 event 를 가져오기 위해서
  const submitReview: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const { rating, comment } = review;
    if (!rating) {
      toast.warning("별점은 꼭 표시해주세요.");
    }

    setIsPending(true);
    const res = await fetch("/api/product/review", {
      method: "POST",
      body: JSON.stringify({
        productId,
        rating,
        comment,
      }),
    });

    const { error, success } = await res.json();

    setIsPending(false);
    if (!res.ok && error) {
      toast.warning(error);
    } else if (success) {
      router.back();
    }
  };

  useEffect(() => {
    if (initialValue) setReview({ ...initialValue });
  }, [initialValue]);

  return (
    <form onSubmit={submitReview} className="space-y-2">
      <div>
        <h3 className="font-semibold text-lg mb-1 text-blue-gray-600 opacity-80">
          별점주기
        </h3>
        <Rating
          placeholder=""
          ratedIcon={<RatedIcon className="h-8 w-8" />}
          unratedIcon={<UnratedIcon className="h-8 w-8" />}
          value={initialValue?.rating || review.rating}
          onChange={(rating) => setReview({ ...review, rating })}
        />
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-1  text-blue-gray-600 opacity-80">
          후기를 남겨주세요.
        </h3>
        <textarea
          placeholder="상품후기"
          className="w-full resize-none border p-2 rounded border-blue-gray-500 outline-blue-400 transition"
          rows={4}
          value={review.comment}
          onChange={({ target }) =>
            setReview({ ...review, comment: target.value })
          }
        />
      </div>
      <div className="text-right">
        <Button placeholder="" disabled={isPending} type="submit" color="blue">
          리뷰완성
        </Button>
      </div>
    </form>
  );
}
