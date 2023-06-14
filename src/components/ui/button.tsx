import { type VariantProps, cva } from "class-variance-authority";
import { ButtonOrLink, type Props as ButtonOrLinkProps } from "./buttonOrLink";

export const styles = cva(
  "rounded-full px-4 py-1 duration-200 flex items-center",
  {
    variants: {
      intent: {
        primary: "bg-slate-900 hover:bg-slate-700",
        skeleton: "skeleton w-36",
      },
      border: {
        default: "border-2 border-slate-500",
        none: "border-0",
      },
      color: {
        red: "bg-red-700 hover:bg-red-500",
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
    Omit<ButtonOrLinkProps, "color"> {}

export const Button = ({ intent, color, border, ...props }: Props) => {
  return (
    <ButtonOrLink className={styles({ intent, color, border })} {...props} />
  );
};
