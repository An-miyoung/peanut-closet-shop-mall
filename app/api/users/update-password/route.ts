// db 에 들어가 새로운 비밀번호로 바꾼다

import startDb from "@lib/db";
import { sendEmail } from "@lib/email";
import PasswordResetToken from "@models/passwordResetToken";
import UserModel from "@models/userModel";
import { UpdatePasswordRequest } from "@app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId, token, password } =
      (await req.json()) as UpdatePasswordRequest;
    if (!isValidObjectId(userId) || !token || !password) {
      return NextResponse.json(
        {
          error: "userId 혹은 token 혹은 비밀번호가 비어있습니다.",
        },
        {
          status: 401,
        }
      );
    }

    await startDb();
    const resetToken = await PasswordResetToken.findOne({ user: userId });
    if (!resetToken) {
      return NextResponse.json(
        {
          error: "DB에 token이 존재하지 않습니다.",
        },
        {
          status: 404,
        }
      );
    }

    const isMatched = await resetToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json(
        {
          error: "token이 다릅니다.",
        },
        {
          status: 404,
        }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          error: "존재하지 않는 사용자입니다.",
        },
        {
          status: 404,
        }
      );
    }

    // 비밀번호를 바꾸기 전에 구 비밀번호와 신 비밀번호가 같으면 에러를 보낸다.
    const isSamePassword = await user.comparePassword(password);
    if (isSamePassword) {
      {
        return NextResponse.json(
          {
            error: "기존 비밀번호와 새 비밀번호가 같습니다.",
          },
          {
            status: 401,
          }
        );
      }
    }

    user.password = password;
    await user.save();
    await PasswordResetToken.findByIdAndDelete(resetToken._id);
    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "password-changed",
    });

    return NextResponse.json(
      {
        message: "비밀번호 재설정됐습니다. 확인메일을 보냈습니다.",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
