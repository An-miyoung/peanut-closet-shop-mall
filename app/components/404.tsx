import React from "react";
import Link from "next/link";

export const PageNotFound = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-3 md:p-10">
      <h2 className=" text-xl mb-6  text-blue-gray-600">
        페이지가 존재하지 않습니다.
      </h2>
      <h4 className=" font-medium text-base mb-5  text-blue-gray-500">
        요청하신 페이지는 없어졌거나, 다른 주소로 이동한 페이지입니다.
      </h4>

      <div className="w-full md:w-1/3 flex items-center justify-between mt-3">
        <Link href="/" className="font-semibold  text-green-900 underline">
          Home 으로 이동
        </Link>
        <Link
          href="/auth/signup"
          className=" font-semibold  text-blue-900 underline"
        >
          로그인 으로 이동
        </Link>
      </div>
    </div>
  );
};

export const SearchProductNotFound = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-3 md:p-10">
      <h4 className=" text-xl mb-6  text-blue-gray-600">죄송합니다...</h4>
      <h2 className=" font-medium text-base mb-5  text-blue-gray-500">
        검색조건에 해당하는 상품이 존재하지 않습니다.
      </h2>
      <Link href="/" className="font-semibold  text-green-900 underline">
        Home 으로 이동
      </Link>
    </div>
  );
};

export const PasswordResetFailed = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-3 md:p-10">
      <h2 className=" text-xl mb-6  text-blue-gray-600">
        비밀번호 재설정이 실패했습니다.
      </h2>
      <h4 className=" font-medium text-sm mb-5  text-blue-gray-500">
        요청하신 비빌번호 재설정에 오류가 생겼거나
      </h4>
      <h4 className=" font-medium text-sm mb-5  text-blue-gray-500">
        요청하신 비빌번호 재설정 사용기한이 넘어서 폐기된 상태입니다.
      </h4>
      <h4 className=" font-medium text-sm mb-5  text-blue-gray-500">
        (비밀번호 재설정 요청후, 24시간이내 재설정하셔야 합니다.)
      </h4>

      <div className="w-full md:w-1/3 flex items-center justify-between mt-3">
        <Link href="/" className="font-semibold  text-green-900 underline">
          Home 으로 이동
        </Link>
        <Link
          href="/auth/signup"
          className=" font-semibold  text-blue-900 underline"
        >
          로그인 으로 이동
        </Link>
      </div>
    </div>
  );
};
