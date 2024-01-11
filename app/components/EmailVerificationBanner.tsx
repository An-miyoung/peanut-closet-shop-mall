"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  id?: string;
  verified?: boolean;
}

export default function EmailVerificationBanner({ id, verified }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const applyForReverification = async () => {
    setSubmitting(true);
    const res = await fetch(`/api/users/verify?userId=${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const { message, error } = await res.json();
    if (!res.ok && error) {
      toast.warning(error);
    }
    if (res.ok && message) {
      toast.success(message);
    }

    setSubmitting(false);
  };

  if (verified) return null;

  return (
    <div className=" p-2 text-center bg-blue-100">
      <span>이메일을 인증해 주세요.</span>
      <button
        onClick={applyForReverification}
        disabled={submitting}
        className="ml-2 font-semibold underline"
      >
        {submitting ? "인증하는 중..." : "이메일 인증하기"}
      </button>
    </div>
  );
}
