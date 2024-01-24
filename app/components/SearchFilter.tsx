"use client";

import { Radio } from "@material-tailwind/react";
import React, { ReactNode, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { StarIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function SearchFilter({ children }: Props) {
  const router = useRouter();
  const searchParms = useSearchParams();
  const query = searchParms.get("query");
  const priceSort = searchParms.get("priceSort");

  const [rating, setRating] = useState([0, 5]);
  const [priceFilter, setPriceFilter] = useState("asc");
  const [applyRatingFilter, setApplyRatingFilter] = useState(false);

  let lowToHigh = priceSort === "asc";
  let hiToLow = priceSort === "desc";

  const initializeState = () => {
    setRating([0, 5]);
    setPriceFilter("asc");
    setApplyRatingFilter(false);
    router.push(`/search-products?query=${query}`);
    router.refresh();
  };

  return (
    <div className="md:flex py-4 space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          let url = "";

          if (applyRatingFilter) {
            url = `/search-products?query=${query}&priceSort=${priceFilter}&minRating=${rating[0]}&maxRating=${rating[1]}`;
          } else {
            url = `/search-products?query=${query}&priceSort=${priceFilter}`;
          }
          router.push(url);
        }}
        className=" md:w-2/12  md:border-r md:border-b-0 border-b border-gray-700 p-4 md:space-y-4 sticky top-0 z-10 bg-white"
      >
        <div>
          <p className="font-semibold">가격</p>
          <div className="flex pr-4 pb-4 md:block md:pb-0">
            <div className="pr-4 md:pr-0">
              <Radio
                name="type"
                label="최저가부터"
                defaultChecked={lowToHigh}
                color="blue-gray"
                className="text-xs"
                crossOrigin={undefined}
                onChange={() => setPriceFilter("asc")}
              />
            </div>
            <div>
              <Radio
                name="type"
                label="최고가부터"
                defaultChecked={hiToLow}
                color="blue-gray"
                className="text-xs"
                crossOrigin={undefined}
                onChange={() => setPriceFilter("desc")}
              />
            </div>
          </div>
        </div>

        <div>
          <p className="font-semibold">
            별점 {rating[0]}-{rating[1]}
          </p>

          <Slider
            range
            allowCross={false}
            min={0}
            max={5}
            marks={{
              0: (
                <span className="flex items-center">
                  0<StarIcon className="w-3 h-3 text-yellow-700" />
                </span>
              ),
              5: (
                <span className="flex items-center">
                  5<StarIcon className="w-3 h-3 text-yellow-700" />
                </span>
              ),
            }}
            onChange={(value) => {
              setRating(value as number[]);
              setApplyRatingFilter(true);
            }}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className=" text-blue-gray-600 text-center w-full p-1 border rounded mt-6"
          >
            필터적용
          </button>
          <button
            type="button"
            onClick={initializeState}
            className="text-blue-gray-600 text-center w-full p-1 border rounded mt-6"
          >
            초기화
          </button>
        </div>
      </form>

      <div className="p-4 flex-1">{children}</div>
    </div>
  );
}
