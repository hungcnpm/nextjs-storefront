"use client";

import Link from "next/link";
import styled from "styled-components";
import { ButtonStyle } from "@/components/Button";

// dùng transient props ($) giống Button
type StyledLinkProps = {
  $primary?: boolean;
  $size?: "l" | "m";
  $white?: boolean;
  $outline?: boolean;
  $block?: boolean;
};

// Styled Link dùng lại style của Button
const StyledLink = styled(Link)<StyledLinkProps>`
  ${ButtonStyle}
`;

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  primary?: boolean;
  size?: "l" | "m";
  white?: boolean;
  outline?: boolean;
  block?: boolean;
};

export default function ButtonLink({
  children,
  primary,
  size,
  white,
  outline,
  block,
  ...rest
}: React.PropsWithChildren<ButtonLinkProps>) {
  return (
    <StyledLink
      $primary={primary}
      $size={size}
      $white={white}
      $outline={outline}
      $block={block}
      {...rest}
    >
      {children}
    </StyledLink>
  );
}