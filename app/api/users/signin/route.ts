// root 의 auth.ts 를 통해 들어온 email, password 로 DB 를 찾아 로그인을 평가하고 실행한다.
//  auth.ts 내 authConfig 에서 Credentials.autorize() 에서 여기를 부르며 credential 을 넘겨준다.

import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { SigninCredentials } from "@app/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { email, password } = (await req.json()) as SigninCredentials;

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "이메일 혹은 비밀번호가 비어있습니다.",
        },
        {
          status: 404,
        }
      );
    }

    await startDb();
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          error: "가입하지 않은 이메일입니다.",
        },
        {
          status: 404,
        }
      );
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return NextResponse.json(
        {
          error: "비밀번호가 다릅니다.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar?.url,
          verified: user.verified,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
