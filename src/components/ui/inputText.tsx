import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

export const styles = cva("border-2 rounded-full bg-transparent px-6 py-2 outline-none", {
  variants: {
    state: {
      default: "border-slate-500",
      error: "border-red-800 text-red-800 bg-red-800/20",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export interface Props
  extends VariantProps<typeof styles>,
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
  ...props
}: Props) => {
  const Comp = asChild ? Slot : "input";

  return (
    <div>
      <label>
        <span className="mb-2 ml-6 inline-block">{label}</span>
        <Comp className={styles({ state, className })} {...props} />
      </label>
    </div>
  );
};
