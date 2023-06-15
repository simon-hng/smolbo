import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentProps } from "react";

export const styles = cva(
  "rounded-2xl border-2 border-slate-500 duration-200 overflow-hidden",
  {
    variants: {
      color: {
        primary: "bg-slate-900",
        skeleton: "h-40 skeleton",
        glass: "backdrop-blur-lg bg-slate-900/50",
      },
      padding: {
        none: "p-0",
        md: "p-4",
      },
    },
    defaultVariants: {
      padding: "md",
    },
  }
);

export interface Props
  extends VariantProps<typeof styles>,
    Omit<ComponentProps<"div">, "color"> {
  className?: string;
}

export const Card = ({ color, className, padding, ...props }: Props) => {
  return <div className={styles({ color, className, padding })} {...props} />;
};
