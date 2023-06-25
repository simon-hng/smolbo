import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { ComponentPropsWithRef } from "react";

export const styles = cva(
  "rounded-full px-4 py-1 duration-500 flex items-center",
  {
    variants: {
      border: {
        default: "border-2 border-slate-500",
        none: "border-0",
      },
      variant: {
        skeleton: "skeleton w-36",
        primary: "bg-slate-900 hover:bg-slate-500 disabled:bg-slate-800 disabled:text-slate-500",
        red: "bg-red-700",
      },
      fullWidth: {
        true: "w-full",
        false: "w-max",
      },
    },
    compoundVariants: [
      {
        border: "default",
        variant: "skeleton",
        className: "border-none",
      },
    ],
    defaultVariants: {
      border: "default",
    },
  }
);

export interface Props
  extends VariantProps<typeof styles>,
    ComponentPropsWithRef<"button"> {
  asChild?: boolean;
  className?: string;
}

export const Button = ({
  variant,
  border,
  fullWidth,
  asChild,
  className,
  ...props
}: Props) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={styles({ variant, border, fullWidth, className })}
      {...props}
    />
  );
};
