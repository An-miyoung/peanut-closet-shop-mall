import React from "react";
import NavUI from "@components/navbar/NavUI";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth";
import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { isValidObjectId } from "mongoose";
import { hashPassword } from "@utils/hashPassword";

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

// const getCartItemsCount = async () => {
//   try {
//     const session = await getServerSession(authConfig);
//     if (!session?.user) return 0;

//     await startDb();

//     const user = await UserModel.findOne({ email: session.user.email });
//     if (!user) return 0;

//     // user.id 는 string 이고 db 에 접근하려면 objectId 여야해서 조작한다.
//     const cart = await CartModel.aggregate([
//       // user 에 맞는 장바구니를 찾고
//       { $match: { userId: new Types.ObjectId(user.id) } },
//       // items 를 열어서 내용을 뽑아낸다.
//       { $unwind: "$items" },
//       // id별로 그룹화해서 quantity를 모두 더한후 totalQuantity 라는 필드에 넣어준다.
//       {
//         $group: {
//           _id: "$_id",
//           totalQuantity: { $sum: "$items.quantity" },
//         },
//       },
//     ]);

//     if (cart.length) {
//       return cart[0].totalQuantity;
//     } else return 0;
//   } catch (error: any) {
//     console.log(`장바구니를 읽어오는데 실패했습니다. ${error.message}`);
//     return 0;
//   }

// };

export default async function Navbar() {
  const session = await getServerSession(authConfig);

  // const count = await getCartItemsCount();
  const profile = await fetchUserProfile();

  return <NavUI cartItemsCount={2} avatar={profile?.avatar} />;
}
