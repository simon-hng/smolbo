import type { ComponentProps } from "react";
import Link, { type LinkProps } from "next/link";

export type Props = ComponentProps<"button"> & Partial<LinkProps>;
/**
 * This is a base component that will render either a button or a link,
 * depending on the props that are passed to it. The link rendered will
 * also correctly get wrapped in a next/link component to ensure ideal
 * page-to-page transitions.
 */
export function ButtonOrLink({ href, children, ...props }: Props) {
  const isLink = typeof href !== "undefined";

  if (isLink) {
    const linkProps = { href, children, ...props } as LinkProps;
    return <Link {...linkProps}>{children}</Link>;
  }

  return <button {...props}>{children}</button>;
}
