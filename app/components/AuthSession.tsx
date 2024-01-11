"use client";

// session provider 는 context API 이기 때문에 front에서 돌아야 하고
// nextjs 에서는 use client 를 선언해야만 가능.
// 이것을 직접 server-side rendering 인 layout.tsx 에 적용할 수 없기때문에
// AuthSession 이라는 컴포넌트로 감싸서 root-layout에 넣어준다
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthSession({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
