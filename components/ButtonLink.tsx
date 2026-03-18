"use client";

import Link from "next/link";
import styled from "styled-components";
import { ButtonStyle } from "@/components/Button";

// Styled Link dùng lại style của Button
const StyledLink = styled(Link)`
  ${ButtonStyle}
`;

// Lấy full props của Link + props của ButtonStyle
type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  primary?: boolean;
  size?: "l" | "m";
  white?: boolean;
  outline?: boolean;
};

export default function ButtonLink({
  children,
  ...rest
}: React.PropsWithChildren<ButtonLinkProps>) {
  return <StyledLink {...rest}>{children}</StyledLink>;
}