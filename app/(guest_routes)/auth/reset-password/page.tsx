import PasswordResetToken from "@models/passwordResetToken";
import { PasswordResetFailed } from "@components/404";
import UpdatePassword from "@components/UpdatePassword";
import startDb from "@lib/db";
import React from "react";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

const fetchTokenValidation = async (token: string, userId: string) => {
  const resetToken = await PasswordResetToken.findOne({ user: userId });
  if (!resetToken) return null;

  const isMatched = await resetToken.compareToken(token);
  if (!isMatched) return null;

  return true;
};

export default async function ResetPassword({ searchParams }: Props) {
  const { token, userId } = searchParams;
  if (!token || !userId) return <PasswordResetFailed />;

  await startDb();
  const isValid = await fetchTokenValidation(token, userId);
  if (!isValid) return <PasswordResetFailed />;

  return <UpdatePassword token={token} userId={userId} />;
}
