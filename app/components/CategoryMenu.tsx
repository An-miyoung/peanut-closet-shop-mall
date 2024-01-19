"use client";

import React from "react";
import categories from "@utils/categories";
import Link from "next/link";
import { Chip } from "@material-tailwind/react";
import HorizontalMenu from "@components/HorizontalMenu";

export default function CategoryMenu() {
  return (
    <div>
      <HorizontalMenu title="카테고리로 찾기">
        {/* children : JSX.Element 로 선언하면 error JSX.Element[] 도 함께 선언 */}
        {categories.map((c) => (
          <Link key={c} href={`/browse-products/${c}`} scroll={false}>
            <Chip color="teal" className="mr-2" variant="outlined" value={c} />
          </Link>
        ))}
      </HorizontalMenu>
    </div>
  );
}
