import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { SessionUserProfile, SigninCredentials } from "@app/types";

// getServerSession 으로 받는 session.user 에 우리가 원하는 필드를 넣도록
// next-auth 의 module 을 재선언해준다.
declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      // signin/page.tsx 에서 submit 할때 signin("credentials", vales) 를 부르면 authorize 가 실행
      async authorize(credentials, req) {
        const { email, password } = credentials as SigninCredentials;
        const res = await fetch("http://localhost:3000/api/users/signin", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        });
        const { user, error } = await res.json();

        if (res.ok && user) {
          return { id: user.id, ...user };
        }

        if (error) return null;
      },
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  // callback 을 정하면 반환받는 data 내용을 정할 수 있다.
  // credential 이 제공하는 user 정보는 email, name 뿐이어서
  // id, role, avatar, verified 를 전달하려면 이 부분에서 수정
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      // jwt token 에서 user 를 가져오기 때문에 불필요한 필드가 따라온다
      // 필요한 필드만을 지정하기 위해 타입을 알려주고 session 안에 항목별로 넣어준다.
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }
      return session;
    },
  },
};

// 인증에 필요한 POST, GET 을 NextAuth 에서 빼놓는다.

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
