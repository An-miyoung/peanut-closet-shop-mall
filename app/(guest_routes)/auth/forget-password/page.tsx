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

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("이메일형식에 맞지않습니다.")
    .required("이메일은 필수입력항목입니다."),
});

export default function ForgetPassword() {
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
      email: "",
    },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);

      const res = await fetch("/api/users/forget-password", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const { message, error } = await res.json();
      if (res.ok && message) {
        toast.success(message);
      }
      if (!res.ok && error) {
        toast.warning(error);
      }

      action.setSubmitting(false);
    },
  });

  const { email } = values;
  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="비밀번호를 재설정합니다." onSubmit={handleSubmit}>
      <Input
        name="email"
        label="이메일"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={email}
        autoComplete="email"
        error={error("email")}
      />
      {errors.email !== undefined && touched.email && (
        <ErrorsRender errorMessage={errors.email} />
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
