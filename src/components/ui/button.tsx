import { type VariantProps, cva } from "class-variance-authority";
import { ButtonOrLink, type Props as ButtonOrLinkProps } from "./buttonOrLink";

export const styles = cva(
  "rounded-full px-4 py-1 duration-500 flex items-center hover:scale-110",
  {
    variants: {
      border: {
        default: "border-2 border-slate-500",
        none: "border-0",
      },
      color: {
        skeleton: "skeleton w-36",
        primary: "bg-slate-900",
        red: "bg-red-700",
      },
      fullWidth: {
        true: "w-full bg-green-500",
      },
    },
    defaultVariants: {
      border: "default",
    },
  }
);

export interface Props
  extends VariantProps<typeof styles>,
    Omit<ButtonOrLinkProps, "color"> {
  className?: string;
}

export const Button = ({ color, border, className, ...props }: Props) => {
  return (
    <ButtonOrLink className={styles({ color, border, className })} {...props} />
  );
};
