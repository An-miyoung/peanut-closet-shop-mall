import * as yup from "yup";
import categories from "@utils/categories";

// file이 없거나 크기가 1MB이하이면 true 를 리턴해서 file validation 통과
// 만약 필수항목이라면 .required를 통과하지 못해서 file validation을 하지 않게 된다.
const fileValidator = (file: File) => {
  if (!file) return true;
  return file.size <= 1024 * 1024;
};

const commonSchema = {
  title: yup.string().required("상품명은 필수입력입니다."),
  description: yup.string().required("상품설명은 필수입력입니다."),
  bulletPoints: yup.array().of(yup.string()),
  mrp: yup.number().required("MRP는 필수입력입니다."),
  salePrice: yup
    .number()
    .required("판매가격은 필수입력입니다.")
    .lessThan(yup.ref("mrp"), "판매가격은 MRP보다 낮아야 합니다."),
  category: yup
    .string()
    .required("카테고리는 필수입력입니다.")
    .oneOf(categories, "유효하지 않은 카테고리"),
  quantity: yup
    .number()
    .required("재고수량은 필수입력입니다.")
    .integer("재고수량은 반드시 정수여야 합니다."),
  images: yup
    .array()
    .of(
      yup
        .mixed()
        .test(
          "fileSize",
          "이미지 크기는 1024X1024 보다 작아야 합니다.",
          (file) => fileValidator(file as File)
        )
    ),
};

export const newProductInfoSchema = yup.object().shape({
  ...commonSchema,
  thumbnail: yup
    .mixed()
    .required("대표이미지는 필수입력입니다.")
    .test("fileSize", "대표이미지는 1024X1024 보다 작아야 합니다.", (file) =>
      fileValidator(file as File)
    ),
});

export const updateProductInfoSchema = yup.object().shape({
  ...commonSchema,
});
