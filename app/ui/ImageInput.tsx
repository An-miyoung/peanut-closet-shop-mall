// 상품을 입력할때 대표이미지와 이미지들의 입력아이콘을 다르게 구성하기 위한 컴포넌트
// rest 로 그림 아이콘이 1개일지 2개일지 결정한다.

import React, { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
}

export default function ImageInput({ id, onChange, children, ...rest }: Props) {
  // "이미지들"이면 최초의 input을 표시하되 밑으로 깔리게 하고
  if (children) rest.hidden = true;
  // "대표이미지" 이면 input 만 render 되게 한다.
  else rest.hidden = false;

  return (
    <label htmlFor={id}>
      <input
        type="file"
        id={id}
        name="file"
        onChange={onChange}
        accept="image/*"
        {...rest}
      />
      <div className="w-20 h-20 rounded flex items-center justify-center border border-gray-700 cursor-pointer">
        {children}
      </div>
    </label>
  );
}
