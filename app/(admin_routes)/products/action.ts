// 클라이언트 컴포넌트 내에서 Server Actions을 사용하는 경우
// (page.tsx -> ProductForm.tsx 의 form tag 내부에서 action={} 라고 부르면, action.ts 가 필요)
// 파일 상단에 "use server" 지시사항이 있는 별도의 파일에 action을 작성합니다.
// 여기에 action 을 두고 api/product/create/route.ts 를 사용하지 않는 이유는
// 상품을 등록, 삭제, 수정하는 일은 admin 만이 할수 있는 일이라서 외부에 url 이 공개될 필요가 없어서이다.
// api/products route 에서는 장바구니, 후기, 찜하기관련 등 사용자관련 CRUD를 함
// 상품의 CRUD를 위해 이미지파일을 외부 클라우드 "cloudinary" 에 저장
// cloudinary 가 제공하는 upload 함수는 react 나 nextjs 에서 사용하지 못함. 따로 api에 전달해주는 함수가 필요

"use server";

import startDb from "@lib/db";
import { NewProduct, ProductToUpdate } from "@app/types";
import { v2 as cloudinary } from "cloudinary";
import ProductModel from "@models/productModel";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

// cloudinayUploadHelper 에서 formData 구성시 필요한 내용.
// cloudinayUploadHelper는 client 에서 움직이기 때문에 process.env 에 접근못하니 내보내주는 함수 필요
export const getCloudConfig = async () => {
  return {
    name: process.env.CLOUD_NAME!,
    key: process.env.CLOUD_API_KEY!,
  };
};

// generate cloud sinature to upload image from inside our front-end directly
// 시그니처가 없으면 프론트엔드에서 파일을 업로드시킬수 없다.
export const getCloudSignature = async () => {
  const secret = cloudinary.config().api_secret!;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp }, secret);

  return { timestamp, signature };
};

export const createProduct = async (values: NewProduct) => {
  try {
    await startDb();
    await ProductModel.create({ ...values });
  } catch (error: any) {
    console.log(error.message);
    throw new Error("새상품 등록에 실패했습니다.");
  }
};

export const updateProduct = async (
  id: string,
  productInfo: ProductToUpdate
) => {
  try {
    await startDb();
    // productInfo 내부의 images 를 다른 이름으로 보관하고 삭제해서 push operator 를 사용할때 충돌이 나지 않게 한다
    const updateImages = productInfo.images && [...productInfo.images];
    // delete 로 그냥 지울수 있다!!!!!!!
    delete productInfo.images;

    await ProductModel.findByIdAndUpdate(id, {
      ...productInfo,
      $push: {
        // {images: productInfo.images} 를 사용하면 충돌하면서 오류가 남
        images: updateImages,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    throw new Error("상품수정에 실패했습니다.");
  }
};

export const removeImageFromCloud = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    console.log(error.message);
    throw new Error("이미지삭제에 실패했습니다.");
  }
};

export const removeAndUpdateProductImages = async (
  id: string,
  publicId: string
) => {
  try {
    const { result } = await cloudinary.uploader.destroy(publicId);
    if (result === "ok") {
      await startDb();
      // await ProductModel.findByIdAndUpdate(id, {
      //   $pull: {
      //     images: { id: publicId },
      //   },
      // });
    }
  } catch (error: any) {
    console.log(error.message);
    throw new Error("이미지삭제에 실패했습니다.");
  }
};
