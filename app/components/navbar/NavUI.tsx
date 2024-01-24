"use client";

import Link from "next/link";
import React from "react";
import {
  Navbar as MaterialNav,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import { Bars3Icon, HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import useAuth from "@hooks/useAuth";
import SearchForm from "@components/SearchForm";
import CartIcon from "@components/CartIcon";
import ProfileMenu from "@components/ProfileMenu";
import { MobileNav } from "@components/MobileNav";

interface Props {
  cartItemsCount: number;
  avatar?: string;
}

export const menuItems = [
  {
    href: "/profile",
    icon: <UserCircleIcon className="h-4 w-4" />,
    label: "나의 정보",
  },
  {
    href: "/profile/orders",
    icon: <ShoppingBagIcon className="h-4 w-4" />,
    label: "주문 내역",
  },
  {
    href: "/profile/wishlist",
    icon: <HeartIcon className="h-4 w-4" />,
    label: "찜한 내역",
  },
];

export default function NavUI({ cartItemsCount, avatar }: Props) {
  const [open, setOpen] = React.useState(false);
  const { loading, loggedIn } = useAuth();

  React.useEffect(() => {
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <MaterialNav className="mx-auto max-w-screen-xl px-4 py-2" placeholder="">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link
            href="/"
            className="mr-4 cursor-pointer py-1.5 md:ml-2 font-semibold"
          >
            Peanut Closet
          </Link>
          {/* 큰 화면일 때  */}
          <div className="hidden md:flex gap-2 items-center">
            <SearchForm submitTo="/search-products?query=" />
            <CartIcon cartItems={cartItemsCount} />
            {loggedIn ? (
              <ProfileMenu menuItems={menuItems} avatar={avatar} />
            ) : loading ? (
              <Spinner />
            ) : (
              <>
                <Link
                  className="px-4 py-1 text-blue-gray-800 text-sm font-semibold"
                  href="/auth/signin"
                >
                  로그인
                </Link>
                <Link
                  className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
                  href="/auth/signup"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
          {/* 작은 화면일 때는 드로워가 열렸으면 X, 닫혔으면 샌드위치  */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIcon cartItems={cartItemsCount} />
            <IconButton
              placeholder=""
              variant="text"
              color="blue-gray"
              className="md:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <XMarkIcon className="h-6 w-6" strokeWidth={2} />
              ) : (
                <Bars3Icon className="h-6 w-6" strokeWidth={2} />
              )}
            </IconButton>
          </div>
        </div>
      </MaterialNav>
      {/* 모바일화면 */}
      <div className="md:hidden">
        <MobileNav
          menuItems={menuItems}
          onClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </>
  );
}
