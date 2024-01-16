"use client";

import React, { useState, useTransition } from "react";
import { Button, Input } from "@material-tailwind/react";
import { toast } from "react-toastify";
// import { uplaodImage } from "../utils/cloudinaryUplaodHelper";
// import { updateUserProfile } from "../(private_route)/profile/action";
import { UserProfileToUpdate } from "../types";
import { useRouter } from "next/navigation";
import ProfileAvatarInput from "./ProfileAvatarInput";

interface Props {
  avatar: string | undefined;
  name: string;
  email: string;
  id: string;
}

export default function ProfileForm({ id, name, avatar, email }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [avatarFile, setAvatarFile] = useState<File>();
  const [userName, setUserName] = useState(name);

  const avatarSource = avatarFile ? URL.createObjectURL(avatarFile) : avatar;
  const showSubmitButton = avatarSource !== avatar || userName !== name;

  const updateUserInfo = async () => {
    // user name 은 최소3글자이상
    if (userName.trim().length < 3)
      return toast.warning("이름은 3글자이상이어여 합니다.");

    const info: UserProfileToUpdate = {
      id,
      name: userName,
    };

    // if (avatarFile) {
    //   info.avatar = await uplaodImage(avatarFile);
    // }

    // await updateUserProfile(info);
    // router.refresh();
  };

  return (
    <form
      className="space-y-6"
      action={() =>
        startTransition(async () => {
          await updateUserInfo();
        })
      }
    >
      <ProfileAvatarInput
        onChange={setAvatarFile}
        nameInitial={name[0]}
        avatar={avatarSource}
      />
      <div className="text-sm">Email: {email}</div>
      <Input
        onChange={({ target }) => setUserName(target.value)}
        label="Name"
        value={userName}
        className="font-semibold"
        crossOrigin={undefined}
      />
      {showSubmitButton ? (
        <Button
          placeholder=""
          type="submit"
          className="w-full shadow-none hover:shadow-none hover:scale-[0.98]"
          color="blue"
          disabled={isPending}
        >
          수정하기
        </Button>
      ) : null}
    </form>
  );
}
