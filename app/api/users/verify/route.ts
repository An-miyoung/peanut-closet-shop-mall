// signup/page -> verify/page 를 통해 들어온 token 과 userId 를 갖고
// DB 에 저장된 token과 입력값이 같은지 비교한 후
// 같으면 EmailVerificationToken 에 저장된 token 값을 지운다.

import startDb from "@lib/db";
import EmailVerificationToken from "@models/emailVerificationToken";
import UserModel from "@models/userModel";
import { EmailVerifyRequest } from "@app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@lib/email";

export const POST = async (req: Request) => {
  try {
    const { token, userId } = (await req.json()) as EmailVerifyRequest;

    // input value check
    if (!isValidObjectId(userId) || !token) {
      return NextResponse.json(
        {
          error: "userId 형식이 다르거나, token 이 없습니다.",
        },
        {
          status: 401,
        }
      );
    }

    // user check
    await startDb();
    const verifyToken = await EmailVerificationToken.findOne({ user: userId });
    if (!verifyToken) {
      return NextResponse.json(
        {
          error: "해당하는 user가 존재하지 않습니다.",
        },
        {
          status: 401,
        }
      );
    }

    // token compare
    const isMatched = await verifyToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json(
        {
          error: "token 이 서로 다릅니다.",
        },
        {
          status: 401,
        }
      );
    }

    // user verified 값 변경, EmailVerificationToken DB 에서 해당 token 삭제
    await UserModel.findByIdAndUpdate(userId, { verified: true });
    await EmailVerificationToken.findByIdAndDelete(verifyToken._id);
    return NextResponse.json(
      {
        message: "이메일 인증성공",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        error: "이메일 인증실패",
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    const userId = req.url.split("?userId=")[1];

    if (!isValidObjectId(userId))
      return NextResponse.json(
        {
          error: "사용자입력 오류",
        },
        { status: 401 }
      );

    await startDb();
    const user = await UserModel.findById(userId);
    if (!user)
      return NextResponse.json(
        {
          error: "존재하지 않는 사용자입니다.",
        },
        { status: 401 }
      );
    if (user.verified)
      return NextResponse.json(
        {
          error: "이메일인증이 이미 완료됐습니다.",
        },
        { status: 401 }
      );
    // 기존에 있을지도 모르는 토큰을 지운다
    await EmailVerificationToken.findOneAndDelete({ user: userId });
    const token = crypto.randomBytes(36).toString("hex");
    await EmailVerificationToken.create({
      user: userId,
      token,
    });

    const verificationUrl = `${process.env.EMAIL_VERIFICATION_URL}?token=${token}&userId=${userId}`;

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "verification",
      linkUrl: verificationUrl,
    });

    return NextResponse.json(
      {
        message: "이메일을 확인하세요.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "이메일인증에 실패했습니다.",
      },
      { status: 500 }
    );
  }
};
