import React, { ReactNode } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function SignOutButton({ children }: Props) {
  const router = useRouter();
  return (
    <div
      onClick={async () => {
        await signOut();
        router.refresh();
      }}
    >
      {children}
    </div>
  );
}
