import Link from "next/link";
import React from "react";

interface Props {
  title: string;
}

export default function EmptyPage({ title }: Props) {
  return (
    <div className=" flex flex-col justify-center items-center py-10 md:py-20">
      <h1 className=" text-lg md:text-2xl font-semibold text-blue-gray-600">
        {`당신의 ${title}`}
      </h1>
      <h2 className="md:w-1/3 md:flex md:justify-between py-5">
        <div className="pb-2 md:pb-0 opacity-60">
          {title === "장바구니"
            ? `${title}에 상품이 없습니다.`
            : `${title}이 없습니다.`}
        </div>
        <Link href={"/"} className="pl-6 md:pl-0 text-blue-700 underline">
          쇼핑하러가기
        </Link>
      </h2>
    </div>
  );
}
