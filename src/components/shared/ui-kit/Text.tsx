import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type FontSize = "xs" | "sm" | "base" | "lg" | "xl";

type TextRawProps = ButtonHTMLAttributes<HTMLParagraphElement>;
type TextCustomProps = { fontSize?: FontSize; inline?: boolean };

export type TextProps = TextCustomProps & TextRawProps;

export const Text = ({
  fontSize = "base",
  inline = false,
  ...props
}: TextProps) => {
  return (
    <p
      {...props}
      className={classNames(
        `text-${fontSize}`,
        { inline: inline },
        props.className
      )}
    />
  );
};
