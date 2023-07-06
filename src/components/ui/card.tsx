import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentProps } from "react";

export const styles = cva(
  "rounded-xl border-2 duration-200 overflow-hidden shadow-md",
  {
    variants: {
      border: {
        default: "border-slate-500",
        none: "border-transparent",
      },
      variant: {
        primary: "bg-slate-900 text-white",
        skeleton: "h-40 skeleton",
        glass: "backdrop-blur-lg bg-slate-900/50",
      },
      padding: {
        none: "p-0",
        md: "p-4",
      },
    },
    compoundVariants: [
      {
        variant: "skeleton",
        border: "default",
        className: "border-none",
      },
    ],
    defaultVariants: {
      border: "default",
      padding: "md",
    },
  }
);

export interface Props
  extends VariantProps<typeof styles>,
    ComponentProps<"div"> {
  className?: string;
}

export const Card = ({ variant, className, padding, ...props }: Props) => {
  return <div className={styles({ variant, className, padding })} {...props} />;
};
