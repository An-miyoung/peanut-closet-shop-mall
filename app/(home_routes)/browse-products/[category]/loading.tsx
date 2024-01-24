import React from "react";
import GridView from "@components/GridView";

export default function Loading() {
  const dummyData = Array(12).fill("");

  return (
    <div className="max-w-screen-xl mx-auto lg:p-0 p-4">
      <div className="p-4 space-y-6 animate-pulse">
        {/* HorizontalMenu */}
        <div className="hidden md:h-[20px]  bg-gray-300"></div>
        {/* FeaturedProductSlider */}
        <div className="lg:h-[380px] md:h-[300px] h-[250px] bg-gray-300"></div>

        <GridView>
          {/* ProductCard */}
          {dummyData.map((_, index) => {
            return (
              <div key={index} className="w-full aspect-square bg-gray-300" />
            );
          })}
        </GridView>
      </div>
    </div>
  );
}
