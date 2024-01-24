// CartModel을 불러온 후 cart의 items 들을 조정하고 cart.save()

import CartModel from "@models/cartModel";
import { authConfig } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import startDb from "@lib/db";
import { NewCartRequest } from "@app/types";
import { isValidObjectId } from "mongoose";
import UserModel from "@models/userModel";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user)
      return NextResponse.json(
        {
          error: "로그인해야 접근할 수 메뉴입니다.",
        },
        { status: 401 }
      );

    const { productId, quantity } = (await req.json()) as NewCartRequest;
    if (!isValidObjectId(productId) || isNaN(quantity))
      return NextResponse.json(
        {
          error: "상품정보가 올바르지 않습니다.",
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

    const cart = await CartModel.findOne({ userId: user.id });
    // 장바구니를 새로 만들때
    if (!cart) {
      await CartModel.create({
        userId: user.id,
        items: [{ productId, quantity }],
      });
      return NextResponse.json({ success: true });
    }
    // cart의 productId 와 req 에서 받은 productId 가 같으면 true를 return
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    // 이미 장바구니와 상품이 있고, 수량을 변경할때
    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity <= 0) {
        // 수량이 0이면 상품을 제거한다.
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    } else {
      // 이미 장바구니만 있고, 새 상품과 수량을 넣을때
      //  productId 가 objectId 라서 오류가 남. type 을 any 로
      cart.items.push({ productId: productId as any, quantity });
    }
    // CartModel 을 불러오지 않고도 저장할수 있다!!!
    await cart.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        error: `장바구니넣기에 실패했습니다. ${error.message}`,
      },
      { status: 500 }
    );
  }
};
