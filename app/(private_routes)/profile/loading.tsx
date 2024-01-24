import React from "react";

export default function LoadingProfile() {
  return (
    <div>
      <div className="md:flex p-4 space-y-4 space-x-4">
        <div className=" w-48 aspect-square bg-gray-300"></div>
        <div className=" md:border-r md:border-gray-700 p-2 space-y-2 md:p-4 md:space-y-4 "></div>

        <div className="p-4 flex-1 pl-4">
          {/* for title */}
          <div className="space-y-4">
            <div className="w-full h-4 aspect-square bg-gray-300" />
          </div>

          {/* for description */}
          <div className="space-y-4">
            <div className="w-full h-2 aspect-square bg-gray-300" />

            <div className="w-1/2 h-2 aspect-square bg-gray-300" />
            <div className="w-1/2 h-2 aspect-square bg-gray-300" />
            <div className="w-1/2 h-2 aspect-square bg-gray-300" />
            <div className="w-1/2 h-2 aspect-square bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
