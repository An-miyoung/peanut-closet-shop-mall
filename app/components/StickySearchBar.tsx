"use client";

import React, { useState } from "react";
import {
  Typography,
  MenuItem,
  Menu,
  MenuHandler,
  MenuList,
  Navbar,
} from "@material-tailwind/react";
import { Square3Stack3DIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import categories from "@utils/categories";
import SearchForm from "./SearchForm";
import { useSearchParams } from "next/navigation";

// 굳이 밖으로 빼서 만든 이유는 renderItems 형식이 [{},{}] 이기 때문
const navListItems = categories.map((category) => {
  return {
    category,
  };
});

const NavListMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderItems = navListItems.map(({ category }) => (
    <Link href={`/browse-products/${category}`} key={category} scroll={false}>
      <MenuItem placeholder="">
        <Typography
          placeholder=""
          variant="h6"
          color="blue-gray"
          className="mb-1"
        >
          {category}
        </Typography>
      </MenuItem>
    </Link>
  ));

  return (
    <>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography
            placeholder=""
            as="a"
            href="#"
            variant="small"
            className="font-normal"
          >
            <MenuItem
              placeholder=""
              className=" items-center font-medium gap-2 text-blue-gray-900 flex rounded-full"
            >
              <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
              카테고리로 찾기{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList
          placeholder=""
          className="w-[36rem] grid-cols-7 gap-3 overflow-visible grid"
        >
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
    </>
  );
};

function NavList() {
  return (
    <ul className="mt-2 flex flex-col">
      <NavListMenu />
    </ul>
  );
}

export default function StickySearch() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div className="p-5 sticky top-0 z-10 mx-auto md:hidden bg-white bg-opacity-90">
      <div className="flex-row items-center justify-start text-blue-gray-900">
        <SearchForm submitTo="/search-products?query=" />
        <NavList />
      </div>
    </div>
  );
}
