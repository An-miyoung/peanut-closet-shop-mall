import startDb from "@lib/db";
import CartModel from "@models/cartModel";
import { Types } from "mongoose";
import { CartItems } from "@app/types";

export const getCartItems = async (
  userId: string,
  cartId?: string
): Promise<CartItems> => {
  await startDb();

  // aggregate 한 결과값이 array 형태로 나오기 때문에 분해해서 실제 필요한 내용만 render 하기 위해
  const [cartItems] = await CartModel.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        _id: new Types.ObjectId(cartId),
      },
    },
    { $unwind: "$items" },
    // productId 로 DB 에서 그 product 를 찾아온다
    {
      $lookup: {
        from: "products",
        foreignField: "_id",
        localField: "items.productId",
        as: "product",
      },
    },
    {
      // lookup 에서 만든 product field 를 정의
      $project: {
        _id: 0,
        // objectId 로 전달하면 불편함이 있어서 string으로 바꿔주는 operator
        id: { $toString: "$_id" },
        totalQty: { $sum: "$items.quantity" },
        products: {
          // product 라는 이름으로 위에서 찾아낸 products들을 _id 별로 0번째부터 array 로 만듬
          id: { $toString: { $arrayElemAt: ["$product._id", 0] } },
          thumbnail: { $arrayElemAt: ["$product.thumbnail.url", 0] },
          title: { $arrayElemAt: ["$product.title", 0] },
          price: { $arrayElemAt: ["$product.price.discounted", 0] },
          // productModel 에는 quantity 가 없다.
          quantity: "$items.quantity",
          totalPrice: {
            $multiply: [
              "$items.quantity",
              { $arrayElemAt: ["$product.price.discounted", 0] },
            ],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        id: { $first: "$id" },
        totalQty: { $sum: "$totalQty" },
        totalPrice: { $sum: "$products.totalPrice" },
        products: { $push: "$products" },
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        totalQty: 1,
        totalPrice: 1,
        products: 1,
      },
    },
  ]);
  return cartItems;
};
