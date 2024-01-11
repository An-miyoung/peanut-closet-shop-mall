"use client";

import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorsRender from "@components/ErrorsRender";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  token: string;
  userId: string;
}

const validationSchema = yup.object().shape({
  password1: yup.string().required("비밀번호는 필수입력항목입니다."),
  password2: yup
    .string()
    .oneOf([yup.ref("password1")], "비밀번호가 다릅니다.")
    .required("비밀번호는 필수입력항목입니다."),
});

export default function UpdatePassword({ token, userId }: Props) {
  const router = useRouter();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      password1: "",
      password2: "",
    },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);

      const res = await fetch("/api/users/update-password", {
        method: "POST",
        body: JSON.stringify({
          userId,
          token,
          password: values.password1,
        }),
      });

      const { message, error } = await res.json();
      if (res.ok && message) {
        toast.success(message);
        router.replace("/auth/signin");
      }
      if (!res.ok && error) {
        toast.warning(error);
      }

      action.setSubmitting(false);
    },
  });

  console.log("token: ", token, "userId: ", userId);
  const { password1, password2 } = values;
  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="비밀번호를 재설정합니다." onSubmit={handleSubmit}>
      <Input
        name="password1"
        label="비밀번호"
        type="password"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={password1}
        autoComplete="password"
        error={error("password1")}
      />
      {errors.password1 !== undefined && touched.password1 && (
        <ErrorsRender errorMessage={errors.password1} />
      )}
      <Input
        name="password2"
        label="비밀번호 확인"
        type="password"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={password2}
        autoComplete="password"
        error={error("password2")}
      />
      {errors.password2 !== undefined && touched.password2 && (
        <ErrorsRender errorMessage={errors.password2} />
      )}
      <Button
        placeholder="password"
        type="submit"
        className="w-full"
        color="blue"
        disabled={isSubmitting}
      >
        비밀번호 재설정
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signin" className="text-sm text-blue-gray-800">
          로그인
        </Link>
        <Link href="/auth/signup" className="text-sm text-blue-gray-800">
          회원가입
        </Link>
      </div>
    </AuthFormContainer>
  );
}
