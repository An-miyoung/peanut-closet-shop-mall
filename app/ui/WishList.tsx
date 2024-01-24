import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import React from "react";

interface Props {
  isActive?: boolean;
}

export const Wishlist = ({ isActive }: Props) => {
  return (
    <div>
      {isActive ? (
        <HeartIconSolid className="w-6 h-6 text-red-500" />
      ) : (
        <HeartIcon className="w-6 h-6 text-blue-500" />
      )}
    </div>
  );
};
