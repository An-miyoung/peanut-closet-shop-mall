//  앱내에서 이메일과 비밀번호로 회원가입을 하면 이메일인증을 위한 토큰을 만들어 mailTrap 을 통해
// 가입자에게 멜을 보내고 거기에 토큰, userId 등을 넣어 만든 URL 을 보내는데,
// 사용자가 그 URL 을 클릭하면 이화면으로 들어와서 token 값이 맞는지 검사하는 로직으로 보낸다

"use client";

import React, { useEffect } from "react";
import { PageNotFound } from "@components/404";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

export default function Verify({ searchParams }: Props) {
  const { token, userId } = searchParams;
  const router = useRouter();

  // useEffect 는 aync, await 를 내부에 쓸수 없어서, fetch().then() 사용.
  // then 내부에서는 aync, await 사용가능
  useEffect(() => {
    fetch(`/api/users/verify`, {
      method: "POST",
      body: JSON.stringify({ token, userId }),
    }).then(async (res) => {
      const result = await res.json();
      const { message, error } = result as { message: string; error: string };
      if (res.ok) {
        toast.success(message);
      }
      if (!res.ok && error) {
        toast.warning(error);
      }
      router.replace("/");
    });
  }, [token, userId, router]);

  if (!token || !userId) return <PageNotFound />;

  return (
    <div className="text-xl md:text-2xl opacity-70 text-center p-8 animate-pulse">
      잠깐만 기다려주세요...
      <p className="p-6">이메일 인증중입니다.</p>
    </div>
  );
}
