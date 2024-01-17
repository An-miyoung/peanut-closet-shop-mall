"use client";

import Link from "next/link";
import React from "react";
import {
  Navbar as MaterialNav,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SparklesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function MobileAdminMenuBar() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <MaterialNav className="mx-auto max-w-screen-xl px-4 py-2" placeholder="">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link className="font-semibold text-lg text-blue-gray-900" href="/">
            Next Shop
          </Link>
          <div className="flex gap-2 items-center justify-between">
            <>
              <Link className="px-4 py-1 text-blue-gray-800 " href="/dashboard">
                <Tooltip
                  content={
                    <Typography
                      placeholder=""
                      color="blue-gray"
                      variant="small"
                      className="font-normal opacity-80"
                    >
                      관리현황판
                    </Typography>
                  }
                  placement="bottom"
                  className="border border-blue-gray-50 bg-white p-1 shadow-xl shadow-black/10"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                  }}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </Tooltip>
              </Link>
              <Link className="px-4 py-1 text-blue-gray-800 " href="/products">
                <Tooltip
                  content={
                    <Typography
                      placeholder=""
                      color="blue-gray"
                      variant="small"
                      className="font-normal opacity-80"
                    >
                      상품 정보
                    </Typography>
                  }
                  placement="bottom"
                  className="border border-blue-gray-50 bg-white p-1 shadow-xl shadow-black/10"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                  }}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                </Tooltip>
              </Link>
              <Link
                className="px-4 py-1 text-blue-gray-800 "
                href="/products/featured/add"
              >
                <Tooltip
                  content={
                    <Typography
                      placeholder=""
                      color="blue-gray"
                      variant="small"
                      className="font-normal opacity-80"
                    >
                      Featured
                    </Typography>
                  }
                  placement="bottom"
                  className="border border-blue-gray-50 bg-white p-1 shadow-xl shadow-black/10"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                  }}
                >
                  <SparklesIcon className="w-5 h-5" />
                </Tooltip>
              </Link>
              <Link className="px-4 py-1 text-blue-gray-800 " href="/sales">
                <Tooltip
                  content={
                    <Typography
                      placeholder=""
                      color="blue-gray"
                      variant="small"
                      className="font-normal opacity-80"
                    >
                      매출 정보
                    </Typography>
                  }
                  placement="bottom"
                  className="border border-blue-gray-50 bg-white p-1 shadow-xl shadow-black/10"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                  }}
                >
                  <CurrencyDollarIcon className="w-5 h-5" />
                </Tooltip>
              </Link>
              <Link className="px-4 py-1 text-blue-gray-800 " href="/orders">
                <Tooltip
                  content={
                    <Typography
                      placeholder=""
                      color="blue-gray"
                      variant="small"
                      className="font-normal opacity-80"
                    >
                      주문 정보
                    </Typography>
                  }
                  placement="bottom"
                  className="border border-blue-gray-50 bg-white p-1 shadow-xl shadow-black/10"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                  }}
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                </Tooltip>
              </Link>
            </>
          </div>
        </div>
      </MaterialNav>
    </>
  );
}
