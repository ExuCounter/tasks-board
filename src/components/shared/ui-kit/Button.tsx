import { PropsWithChildren, ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type Sizing = "sm" | "md" | "lg";
type Variant = "main";

const sizings = {
  sm: "py-1 px-3",
  md: "py-2 px-5",
  lg: "py-3 px-7",
};

const variants = {
  main: {
    default: "bg-cyan-600 bordered text-slate-50",
    ghost: "text-cyan-600 bordered",
  },
};

type ButtonRawProps = ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonCustomProps = {
  sizing?: Sizing;
  variant?: Variant;
  ghost?: boolean;
  children: any;
};

type ButtonProps = PropsWithChildren<ButtonRawProps & ButtonCustomProps>;

export const Button = ({
  sizing = "md",
  variant = "main",
  ghost = false,
  children,
  ...props
}: ButtonProps) => {
  const sizingClassName = sizings[sizing];
  const variantClassName = variants[variant][ghost ? "ghost" : "default"];

  return (
    <button
      {...props}
      className={classNames(
        sizingClassName,
        variantClassName,
        "rounded-md",
        props.className
      )}
    >
      {children}
    </button>
  );
};
