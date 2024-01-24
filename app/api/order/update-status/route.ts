import startDb from "@lib/db";
import OrderModel from "@models/orderModel";
import { authConfig } from "@/auth";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const validStatus = ["delivered", "ordered", "shipped"];

export const POST = async (req: Request) => {
  const session = await getServerSession(authConfig);
  const user = session?.user;
  if (user?.role !== "admin")
    return NextResponse.json(
      {
        error: "관리자만 접근할수 있는 메뉴입니다.",
      },
      { status: 401 }
    );

  const { orderId, deliveryStatus } = await req.json();
  if (!isValidObjectId(orderId) || !validStatus.includes(deliveryStatus))
    return NextResponse.json(
      {
        error: "주문내역에 대한 정보가 올바르지 않아 가져오기에 실패했습니다.",
      },
      { status: 401 }
    );

  try {
    await startDb();
    await OrderModel.findByIdAndUpdate(orderId, { deliveryStatus });
    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "주문내역 업데이트에 실패했습니다.",
      },
      { status: 500 }
    );
  }
};
