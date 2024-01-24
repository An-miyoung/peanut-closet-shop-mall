"use client";

import { IconButton } from "@material-tailwind/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface Props {
  value: number;
  onDecrement?(): void;
  onIncrement?(): void;
  disabled?: boolean;
}

const CartCountUpdater = ({
  onDecrement,
  onIncrement,
  disabled,
  value,
}: Props) => {
  return (
    <div
      style={{ opacity: disabled ? "0.5" : "1" }}
      className="flex items-center md:space-x-1"
    >
      <IconButton
        placeholder=""
        disabled={disabled}
        onClick={onDecrement}
        variant="text"
      >
        <MinusIcon className="w-3 h-3 md:w-4 md:h-4" />
      </IconButton>

      <span className="text-sm md:text-lg font-medium">{value}</span>
      <IconButton
        placeholder=""
        disabled={disabled}
        onClick={onIncrement}
        variant="text"
      >
        <PlusIcon className="w-3 h-3 md:w-4 md:h-4" />
      </IconButton>
    </div>
  );
};

export default CartCountUpdater;
