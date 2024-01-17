"use client";

import Link from "next/link";
import React, { ReactNode } from "react";
import {
  Squares2X2Icon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  SparklesIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import SignOutButton from "@components/SignOut";
import MobileAdminMenuBar from "@components/MobileAdminMenubar";

interface Props {
  children: ReactNode;
}

const AdminSidebar = ({ children }: Props) => {
  return (
    <>
      {/* PC 화면 */}
      <div className="hidden md:flex">
        <div className="flex flex-col justify-between bg-blue-100 h-screen sticky top-0 w-64 p-10">
          <ul className="space-y-4 text-blue-gray-900">
            <li>
              <Link
                className="font-semibold text-lg text-blue-gray-900"
                href="/"
              >
                Next Shop
              </Link>
            </li>
            <li>
              <Link className="flex items-center space-x-1" href="/dashboard">
                <Squares2X2Icon className="w-4 h-4" />
                <span>관리자전용 정보</span>
              </Link>
              <hr className="w-full " />
            </li>
            <li>
              <Link className="flex items-center space-x-1" href="/products">
                <ShoppingCartIcon className="w-4 h-4" />
                <span>상품 정보</span>
              </Link>
              <hr className="w-full " />
            </li>
            <li>
              <Link
                className="flex items-center space-x-1"
                href="/products/featured/add"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Featured</span>
              </Link>
              <hr className="w-full " />
            </li>
            <li>
              <Link className="flex items-center space-x-1" href="/sales">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span>매출 정보</span>
              </Link>
              <hr className="w-full " />
            </li>
            <li>
              <Link className="flex items-center space-x-1" href="/orders">
                <ShoppingBagIcon className="h-4 w-4" />
                <span>주문 정보</span>
              </Link>
              <hr className="w-full " />
            </li>
          </ul>

          <div>
            <SignOutButton>
              <div className="cursor-pointertext-blue-gray-900 cursor-pointer">
                로그아웃
              </div>
            </SignOutButton>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto flex-1 p-4 overflow-y-auto">
          {children}
        </div>
      </div>
      {/* mobile 화면 */}
      <div className=" md:hidden">
        <div>
          <MobileAdminMenuBar />
        </div>
        <div className="max-w-screen-xl mx-auto flex-1 p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
