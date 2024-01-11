import { useSession } from "next-auth/react";

interface Auth {
  loggedIn: boolean;
  loading: boolean;
  isAdmin: boolean;
}

export default function useAuth(): Auth {
  const session = useSession();
  const user = session.data?.user;

  return {
    loggedIn: session.status === "authenticated",
    loading: session.status === "loading",
    // session.data.user의 DefaultSessionUser 는 role 등등의 필드가 없기 때문에
    // auth.ts 에서 모듈을 재선언해줘야 한다.
    isAdmin: user?.role === "admin",
  };
}
