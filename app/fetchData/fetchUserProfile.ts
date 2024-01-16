import { authConfig } from "@/auth";
import { getServerSession } from "next-auth";
import startDb from "@lib/db";
import { isValidObjectId } from "mongoose";
import { hashPassword } from "@utils/hashPassword";
import UserModel from "@models/userModel";

export const fetchUserProfile = async () => {
  const session = await getServerSession(authConfig);
  if (!session) return null;
  if (!session.user) return null;

  await startDb();

  if (!isValidObjectId(session.user.id)) {
    const values = {
      name: session.user.name || "소셜로그인회원",
      email: session.user.email,
      avatar: { id: undefined, url: session.user.image },
      verified: true,
      role: "user",
      password: await hashPassword("0000000"),
      socialId: session.user.id,
    };

    const user = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      {
        ...values,
      },
      { upsert: true }
    );

    if (!user) return null;
    return {
      id: user?._id.toString(),
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar?.url,
      verified: user?.verified,
      socialId: user?.socialId,
    };
  } else {
    const user = await UserModel.findById(session.user.id);
    if (!user) return null;
    return {
      id: user?._id.toString(),
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar?.url,
      verified: user?.verified,
    };
  }
};
