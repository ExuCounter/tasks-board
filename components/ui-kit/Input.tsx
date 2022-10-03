import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type Sizing = "sm" | "md" | "lg";

const sizings = {
  sm: "py-1 px-3",
  md: "py-2 px-5",
  lg: "py-3 px-7",
};

type InputRawProps = ButtonHTMLAttributes<HTMLInputElement>;
type InputCustomProps = { sizing?: Sizing };

export type InputProps = InputRawProps & InputCustomProps;

export const Input = ({ sizing = "md", ...props }: InputProps) => {
  const sizingClassName = sizings[sizing];

  return (
    <input
      {...props}
      className={classNames(sizingClassName, props.className)}
    />
  );
};
