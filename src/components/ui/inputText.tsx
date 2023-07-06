import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva, cx } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

const inputStyles = cva(
  "border-2 rounded-xl bg-transparent px-4 py-2 outline-none",
  {
    variants: {
      state: {
        default: "border-slate-500",
        error: "border-red-800 text-red-800 bg-red-800/20",
        skeleton: "skeleton",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface Props
  extends VariantProps<typeof inputStyles>,
    ComponentPropsWithRef<"input"> {
  label?: string;
  className?: string;
  asChild?: boolean;
}

export const InputText = ({
  asChild,
  className,
  label,
  state,
  fullWidth,
  ...props
}: Props) => {
  const Comp = asChild ? Slot : "input";

  return (
    <label className={cx("flex flex-col", fullWidth && "w-full")}>
      {!!label && <span className="mb-2 ml-2 inline-block">{label}</span>}
      <Comp
        className={inputStyles({ state, fullWidth, className })}
        {...props}
      />
    </label>
  );
};
