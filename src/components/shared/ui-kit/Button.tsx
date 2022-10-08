import { PropsWithChildren, ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type Sizing = "sm" | "md" | "lg";
type Variant = keyof typeof variants;

const sizings = {
  sm: "py-1 px-3",
  md: "py-2 px-5",
  lg: "py-3 px-7",
};

const variants = {
  main: "bg-cyan-600 text-slate-50",
  danger: "bg-red-400 text-white",
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
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const sizingClassName = sizings[sizing];
  const variantClassName = variants[variant];

  return (
    <button
      {...props}
      disabled={disabled}
      className={classNames(
        sizingClassName,
        variantClassName,
        "rounded-md",
        "bordered",
        { "bg-gray-400 text-white": disabled },
        { "text-cyan-600 bg-transparent": ghost },
        props.className
      )}
    >
      {children}
    </button>
  );
};
