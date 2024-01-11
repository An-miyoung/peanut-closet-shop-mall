import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { NewUserRequest } from "@/app/types";
import crypto from "crypto";
import { NextResponse } from "next/server";
import EmailVerificationToken from "@models/emailVerificationToken";
import { sendEmail } from "@lib/email";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;

  await startDb();
  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const verificationUrl = `${process.env.EMAIL_VERIFICATION_URL}?token=${token}&userId=${newUser._id}`;

  await sendEmail({
    profile: { name: newUser.name, email: newUser.email },
    subject: "verification",
    linkUrl: verificationUrl,
  });

  return NextResponse.json({
    message: "회원가입을 마무리하려면, 이메일을 확인해주세요",
  });
};
