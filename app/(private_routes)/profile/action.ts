"use server";

import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { UserProfileToUpdate } from "@app/types";
import { redirect } from "next/navigation";

export const updateUserProfile = async (info: UserProfileToUpdate) => {
  try {
    if (!info) return redirect("/404");

    await startDb();
    await UserModel.findByIdAndUpdate(info.id, {
      name: info.name,
      avatar: info.avatar,
    });
  } catch (error: any) {
    console.log(error.message);
    throw new Error("profile 수정에 실패했습니다.");
  }
};
