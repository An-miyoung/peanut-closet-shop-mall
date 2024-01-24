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
  const user = await UserModel.findOne({ email: session.user.email });

  if (!user && !isValidObjectId(session.user.id)) {
    const values = {
      name: session.user.name || "소셜로그인회원",
      email: session.user.email,
      avatar: { id: undefined, url: session.user.image },
      verified: true,
      role: "user",
      password: await hashPassword("0000000"),
      socialId: session.user.id,
    };

    const newUser = await UserModel.create({ ...values });

    return {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar?.url,
      verified: newUser.verified,
      socialId: newUser.socialId,
    };
  }
  // app에서 회원가입한 경우
  else if (user) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar?.url,
      verified: user.verified,
    };
  } else if (!user) return null;
};
