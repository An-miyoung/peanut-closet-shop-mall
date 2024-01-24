import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import UserModel from "@models/userModel";
import { authConfig } from "@/auth";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user)
      return NextResponse.json(
        {
          error: "로그인해야 접근할 수 있는 메뉴입니다.",
        },
        { status: 401 }
      );

    const data = await req.json();
    const productId = data.productId as string;
    if (!isValidObjectId(productId))
      return NextResponse.json(
        {
          error: "상품번호가 정확하지 않습니다.",
        },
        { status: 401 }
      );

    await startDb();
    const product = await ProductModel.findById(productId);
    if (!product)
      return NextResponse.json(
        {
          error: "상품이 존재하지 않습니다.",
        },
        { status: 401 }
      );
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user)
      return NextResponse.json(
        {
          error: "회원정보를 가져오는데 실패했습니다.",
        },
        { status: 404 }
      );

    // stripe payment link 에 필요한 정보를 만들어 낸다. create-> params필요-> line_items 필요
    const line_items = [
      {
        price_data: {
          currency: "KRW",
          // 미국의 경우, 달러아래 센트까지 계산해주기 위해 price*100을 한다.
          unit_amount: product.price.discounted,
          product_data: {
            name: product.title,
            images: [product.thumbnail.url],
          },
        },
        quantity: 1,
      },
    ];

    const customer = await stripe.customers.create({
      metadata: {
        userId: user.id,
        type: "instance-checkout",
        product: JSON.stringify({
          id: productId,
          title: product.title,
          thumbnail: product.thumbnail.url,
          price: product.price.discounted,
          quantity: 1,
          totalPrice: product.price.discounted,
        }),
      },
    });

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: process.env.PAYMENT_SUCCESS_URL!,
      cancel_url: process.env.PAYMENT_CANCEL_URL!,
      shipping_address_collection: { allowed_countries: ["US", "JP", "KR"] },
      customer: customer.id,
    };
    // stripe link
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    return NextResponse.json({
      url: checkoutSession.url!,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      error: "결제에 실패했습니다.",
    });
  }
};
