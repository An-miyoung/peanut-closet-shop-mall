import React from "react";

interface Props {
  errorMessage: string;
}

const ErrorsRender = ({ errorMessage }: Props) => {
  return (
    <span className=" text-red-500 text-xs px-3 py-1">{errorMessage}</span>
  );
};

export default ErrorsRender;
