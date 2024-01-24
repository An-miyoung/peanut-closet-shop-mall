"use client";

import { Avatar } from "@material-tailwind/react";
import React from "react";

interface Props {
  name: string;
  avatar?: string;
}

export default function ReviewAvatar({ name, avatar }: Props) {
  return (
    <Avatar
      placeholder=""
      variant="circular"
      size="sm"
      alt={name}
      src={avatar || "/guest.jpeg"}
    />
  );
}
