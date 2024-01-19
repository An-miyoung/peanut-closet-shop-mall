"use client";

import { Button, Input } from "@material-tailwind/react";
import * as Yup from "yup";
import Image from "next/image";
import React, {
  ChangeEventHandler,
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  newFeaturedProductValidationSchema,
  oldFeaturedProductValidationSchema,
} from "@utils/featuredValidationSchema";
import { toast } from "react-toastify";
import { uplaodImage } from "@utils/cloudinaryUplaodHelper";
import {
  createFeaturedProduct,
  updateFeaturedProduct,
} from "@/app/(admin_routes)/products/featured/action";
import { UpdateFeaturedProduct } from "@app/types";
import { useRouter } from "next/navigation";
import { removeImageFromCloud } from "@app/(admin_routes)/products/action";
import { extractPublicId } from "@utils/extractPublicIdHelper";

export interface FeaturedProduct {
  file?: File;
  title: string;
  link: string;
  linkTitle: string;
}

interface Props {
  initialValue?: any;
}

const defaultProduct = {
  title: "",
  link: "",
  linkTitle: "",
};

export default function FeaturedProductForm({ initialValue }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [featuredProduct, setFeaturedProduct] =
    useState<FeaturedProduct>(defaultProduct);

  // 들어오는 형식이 파일인지 아닌지 구분해서 처리한다.
  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value, files } = target;

    if (name === "file" && files) {
      const file = files[0];
      if (file) setFeaturedProduct({ ...featuredProduct, file });
    } else setFeaturedProduct({ ...featuredProduct, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const { file, title, link, linkTitle } =
        await oldFeaturedProductValidationSchema.validate(
          { ...featuredProduct },
          { abortEarly: false }
        );

      const newInfo: UpdateFeaturedProduct = { title, link, linkTitle };
      if (file) {
        const publicId = extractPublicId(initialValue.banner);
        await removeImageFromCloud(publicId);
        newInfo.banner = await uplaodImage(file);
      }

      await updateFeaturedProduct(initialValue!.id, newInfo);
      setFeaturedProduct({
        file: null || undefined,
        ...defaultProduct,
      });
      router.refresh();
      router.push("/products/featured/add");
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        error.inner.map((err) => {
          toast.warning(err.message);
        });
      }
    }
  };

  const handleCreate = async () => {
    try {
      const { file, title, link, linkTitle } =
        await newFeaturedProductValidationSchema.validate(
          { ...featuredProduct },
          { abortEarly: false }
        );

      const banner = await uplaodImage(file);
      await createFeaturedProduct({ banner, title, link, linkTitle });
      setFeaturedProduct({
        file: null || undefined,
        ...defaultProduct,
      });
      router.refresh();
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        error.inner.map((err) => {
          toast.warning(err.message);
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (isForUpdate) await handleUpdate();
    else await handleCreate();
  };

  useEffect(() => {
    if (initialValue) {
      setFeaturedProduct({ ...initialValue });
      setIsForUpdate(true);
    }
  }, [initialValue]);

  const poster = featuredProduct.file
    ? // URL.createObjectURL 는 올린 파일의 미리보기가 가능하게 해주는 메소드
      URL.createObjectURL(featuredProduct.file)
    : initialValue?.banner || "";

  const { link, linkTitle, title } = featuredProduct;

  return (
    <form
      className="py-4 space-y-4"
      action={() => startTransition(async () => await handleSubmit())}
    >
      {/* input 필드뿐만 아니라 label 전체를 클릭해도 파일을 선택할수 있도록 label로 묶음 */}
      <label htmlFor="banner-file">
        <input
          type="file"
          accept="image/*"
          id="banner-file"
          name="file"
          onChange={handleChange}
          hidden
        />
        <div className="h-[380px] w-full flex flex-col items-center justify-center border border-dashed border-blue-gray-400 rounded cursor-pointer relative">
          {poster ? (
            <Image
              alt="banner"
              src={poster || initialValue?.banner}
              fill
              priority
            />
          ) : (
            <>
              <span>배너이미지 선택</span>
              <span>1140 x 380</span>
            </>
          )}
        </div>
      </label>
      <Input
        label="제목"
        name="title"
        value={title}
        onChange={handleChange}
        crossOrigin={undefined}
      />
      <div className="flex space-x-4">
        <Input
          label="링크주소"
          name="link"
          value={link}
          onChange={handleChange}
          crossOrigin={undefined}
        />
        <Input
          label="링크제목"
          name="linkTitle"
          value={linkTitle}
          onChange={handleChange}
          crossOrigin={undefined}
        />
      </div>
      <div className="text-right">
        <Button placeholder="" type="submit" color="blue" disabled={isPending}>
          {isForUpdate ? "수정하기" : "만들기"}
        </Button>
      </div>
    </form>
  );
}
