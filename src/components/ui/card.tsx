import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentProps } from "react";

export const styles = cva(
  "rounded-2xl border-2 border-slate-500 p-4 duration-200",
  {
    variants: {
      color: {
        primary: "bg-slate-900",
        skeleton: "h-40 skeleton",
      },
    },
  }
);

export interface Props
  extends VariantProps<typeof styles>,
    Omit<ComponentProps<"div">, "color"> {
  className?: string;
}

export const Card = ({ color, className, ...props }: Props) => {
  return <div className={styles({ color, className })} {...props} />;
};
