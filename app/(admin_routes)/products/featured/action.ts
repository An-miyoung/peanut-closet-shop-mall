"use server";

import startDb from "@lib/db";
import FeaturedProductModel from "@models/featuredProductModel";
import { NewFeaturedProduct, UpdateFeaturedProduct } from "@app/types";
import { removeImageFromCloud } from "@app/(admin_routes)/products/action";

export const createFeaturedProduct = async (info: NewFeaturedProduct) => {
  try {
    await startDb();
    await FeaturedProductModel.create({ ...info });
  } catch (error: any) {
    console.log(error.message);
    throw new Error("featured 생성에 실패했습니다.");
  }
};

export const updateFeaturedProduct = async (
  id: string,
  info: UpdateFeaturedProduct
) => {
  try {
    await startDb();
    await FeaturedProductModel.findByIdAndUpdate(id, { ...info });
  } catch (error: any) {
    console.log(error.message);
    throw new Error("featured 수정에 실패했습니다.");
  }
};

export const deleteFeaturedProduct = async (id: string) => {
  try {
    await startDb();
    // 삭제하기 위해 DB 에서 찾은 값을 local에서 갖고 있는 동안 사용가능!!!!!
    const product = await FeaturedProductModel.findByIdAndDelete(id);
    if (product) {
      await removeImageFromCloud(product.banner.id);
    }
  } catch (error: any) {
    console.log(error.message);
    throw new Error("featured 삭제에 실패했습니다.");
  }
};
