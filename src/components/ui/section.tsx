import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentProps } from "react";

export const styles = cva("container mx-auto p-8 lg:p-16", {
  variants: {},
});

export interface Props
  extends VariantProps<typeof styles>,
    Omit<ComponentProps<"section">, "color"> {
  className?: string;
}

export const Section = ({ className, ...props }: Props) => {
  return <section className={styles({ className })} {...props} />;
};
