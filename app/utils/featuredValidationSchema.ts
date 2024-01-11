import * as Yup from "yup";

const commonValidationFeaturedProduct = {
  title: Yup.string().required("제목은 필수입니다."),
  link: Yup.string().required("링크주소는 필수입니다."),
  linkTitle: Yup.string().required("링크주소제목은 필수입니다."),
};

export const newFeaturedProductValidationSchema = Yup.object().shape({
  file: Yup.mixed<File>()
    .required("File is required")
    .test("fileType", "오직 이미지파일만 가능합니다.", (value) => {
      if (value) {
        const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
        return supportedFormats.includes((value as File).type);
      }
      return true;
    }),
  ...commonValidationFeaturedProduct,
});

export const oldFeaturedProductValidationSchema = Yup.object().shape({
  file: Yup.mixed<File>().test(
    "fileType",
    "Invalid file format. Only image files are allowed.",
    (value) => {
      if (value) {
        const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
        return supportedFormats.includes((value as File).type);
      }
      return true;
    }
  ),
  ...commonValidationFeaturedProduct,
});
