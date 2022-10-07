import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type FontSize = "xs" | "sm" | "base" | "lg" | "xl";

type TextRawProps = ButtonHTMLAttributes<HTMLParagraphElement>;
type TextCustomProps = { fontSize?: FontSize };

export type TextProps = TextCustomProps & TextRawProps;

export const Text = ({ fontSize = "base", ...props }: TextProps) => {
  return (
    <p {...props} className={classNames(`text-${fontSize}`, props.className)} />
  );
};
