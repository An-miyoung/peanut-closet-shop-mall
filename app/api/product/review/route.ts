import startDb from "@lib/db";
import ReviewModel from "@models/reviewModel";
import { ReviewRequestBody } from "@/app/types";
import { authConfig } from "@/auth";
import { Types, isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import ProductModel from "@models/productModel";
import UserModel from "@/app/models/userModel";

const updateProductRating = async (productId: string) => {
  // console로 결과값을 찍어보니 [{_id:null, averagerating: 5}]형태
  const [result] = await ReviewModel.aggregate([
    { $match: { product: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (result?.averageRating) {
    await ProductModel.findByIdAndUpdate(productId, {
      rating: result.averageRating,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user)
      return NextResponse.json(
        {
          error: "로그인해야 접근할수 있는 메뉴입니다.",
        },
        { status: 401 }
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
    const userId = user.id;
    const { productId, rating, comment } =
      (await req.json()) as ReviewRequestBody;

    if (!isValidObjectId(productId))
      return NextResponse.json(
        {
          error: "상품정보가 올바르지 않아 후기작성에 실패했습니다.",
        },
        { status: 401 }
      );
    if (rating <= 0 || rating > 5)
      return NextResponse.json(
        {
          error: "별점은 0부터 5까지만 가능합니다.",
        },
        { status: 401 }
      );
    const data = {
      userId,
      product: productId,
      rating,
      comment,
    };

    await ReviewModel.findOneAndUpdate(
      {
        userId,
        product: productId,
      },
      data,
      {
        upsert: true,
      }
    );

    await updateProductRating(productId);

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        error: "후기작성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
};
