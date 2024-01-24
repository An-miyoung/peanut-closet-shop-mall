"use client";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { rgbDataURL } from "@utils/blurDataUrl";

export interface FeaturedProduct {
  id: string;
  banner: string;
  title: string;
  link: string;
  linkTitle: string;
}

interface Props {
  products: FeaturedProduct[];
}

const settings: Settings = {
  dots: true,
  lazyLoad: "anticipated",
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
};

export default function FeaturedProductsSlider({ products }: Props) {
  const router = useRouter();

  if (!products.length) return null;

  return (
    <div className=" w-11/12 mx-auto">
      <Slider {...settings}>
        {products.map(({ banner, title, link, linkTitle }, index) => {
          return (
            <div className="select-none relative" key={index}>
              <div
                className="w-full lg:h-[380px] md:h-[300px] h-[200px]"
                style={{ position: "relative" }}
              >
                <Image
                  fill
                  src={banner}
                  alt={title}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={rgbDataURL(128, 138, 156)}
                />
              </div>
              <div className="absolute inset-0 p-5">
                <div className="w-full md:w-1/2 h-full flex flex-col items-start justify-center">
                  <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold text-left mb-2">
                    {title}
                  </h1>
                  <Button
                    placeholder=""
                    color="blue-gray"
                    onClick={() => router.push(link)}
                  >
                    {linkTitle}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

/*
.slick-next::before,
.slick-prev::before {
  color: #000 !important;
}

.slick-dots {
  bottom: 6px !important;
}
*/
