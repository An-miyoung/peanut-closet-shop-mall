// 이 페이지를 서버컴포넌트로 유지함으로써 render가 빨리 이뤄지게 하기 위해
// material-tailwind 를 사용하는 rating, avatar를 클라이언트 컴포넌트로 따로 반듬

import React from "react";
import dateFormat from "dateformat";
import ReviewStars from "./ReviewStars";
import ReviewAvatar from "./ReviewAvatar";

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  userInfo: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface Props {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: Props) {
  return (
    <div className="space-y-4">
      {reviews?.map((review) => {
        return (
          <div className="space-y-2" key={review.id}>
            <div className="flex items-center space-x-2">
              <ReviewAvatar
                name={review.userInfo.name}
                avatar={review.userInfo.avatar}
              />
              <div>
                <p className="font-semibold">{review.userInfo.name}</p>
                <p className="text-xs">
                  {dateFormat(review.date, "yyyy-mm-dd")}
                </p>
              </div>
            </div>
            <div>
              <ReviewStars rating={review.rating} />
              <p>{review.comment}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
