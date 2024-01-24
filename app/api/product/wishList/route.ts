import startDb from "@lib/db";
import WishlistModel from "@models/wishListModel";
import { authConfig } from "@/auth";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import UserModel from "@models/userModel";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user)
      return NextResponse.json(
        {
          error: "로그인해야 접근할 수 있는 메뉴입니다.",
        },
        { status: 403 }
      );

    const { productId } = await req.json();
    if (!isValidObjectId(productId))
      return NextResponse.json(
        {
          error: "상품정보가 올바르지 않아 찜하기에 실패했습니다.",
        },
        { status: 422 }
      );

    await startDb();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user)
      return NextResponse.json(
        {
          error: "회원정보를 가져오는데 실패했습니다.",
        },
        { status: 404 }
      );
    const wishList = await WishlistModel.findOne({
      user: user.id,
      products: productId,
    });

    if (wishList) {
      await WishlistModel.findByIdAndUpdate(wishList._id, {
        $pull: { products: productId },
      });
    } else {
      await WishlistModel.findOneAndUpdate(
        { user: user.id },
        { user: user.id, $push: { products: productId } },
        { upsert: true }
      );
    }

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    NextResponse.json(
      {
        error: "찜하기에 실패했습니다.",
      },
      { status: 500 }
    );
  }
};
