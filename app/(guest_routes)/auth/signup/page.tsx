"use client";

import React from "react";
import { Button, Input } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import AuthFormContainer from "@components/AuthFormContainer";
import ErrorsRender from "@components/ErrorsRender";

const validationSchema = yup.object().shape({
  name: yup.string().required("이름은 필수입력항목입니다."),
  email: yup
    .string()
    .email("이메일형식에 맞지않습니다.")
    .required("이메일은 필수입력항목입니다."),
  password: yup
    .string()
    .min(7, "7글자이상 입력해주세요.")
    .required("비밀번호는 필수입력항목입니다."),
});

export default function SignUp() {
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
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const { message, error } = (await res.json()) as {
        message: string;
        error: string;
      };
      if (res.ok && message) {
        toast.success(message);
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
      }
      if (!res.ok && error) {
        toast.warning(error);
        throw new Error(error);
      }
      action.setSubmitting(false);
    },
  });

  const { name, email, password } = values;
  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="회원가입을 합니다." onSubmit={handleSubmit}>
      <Input
        name="name"
        label="이름"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={name}
        autoComplete="username"
        error={error("name")}
      />
      {errors.name !== undefined && touched.name && (
        <ErrorsRender errorMessage={errors.name} />
      )}
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
      <Input
        name="password"
        label="비밀번호"
        type="password"
        crossOrigin={undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        value={password}
        autoComplete="off"
        error={error("password")}
      />
      {errors.password !== undefined && touched.password && (
        <ErrorsRender errorMessage={errors.password} />
      )}
      <Button
        placeholder="signup"
        type="submit"
        className="w-full"
        color="blue"
        disabled={isSubmitting}
      >
        가입하기
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signin" className="text-sm text-blue-gray-800">
          로그인
        </Link>
        <Link href="/" className="text-sm text-blue-gray-800">
          쇼핑몰로 이동
        </Link>
      </div>
    </AuthFormContainer>
  );
}
