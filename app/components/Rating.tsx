import React from "react";
import StarIcon from "@ui/StarIcon";

interface Props {
  value: number;
}

export default function Rating({ value }: Props) {
  const data = Array(5).fill("");
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars >= 0.1;

  return (
    <div className="flex items-center space-x-0">
      {data.map((_, idx) => {
        return idx + 1 <= fullStars ? (
          <StarIcon.Full key={idx} />
        ) : halfStars && idx === fullStars ? (
          <StarIcon.Half key={idx} />
        ) : (
          <StarIcon.Empty key={idx} />
        );
      })}
    </div>
  );
}
