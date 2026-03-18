"use client";

import styled, { css } from "styled-components";
import React from "react";
import { primaryColor } from "@/lib/color";
type ButtonProps = {
  primary?: boolean;
  size?: "l" | "m";
  white?: boolean;
  outline?: boolean;
  block?: boolean;
};

// ✅ đây mới là ButtonStyle đúng
export const ButtonStyle = css<ButtonProps>`
  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
  font-weight: 500;
  svg {
    height: 16px;
    margin-right: 5px;
  }

  ${(props) =>
    props.primary &&
    css`
      background-color: ${primaryColor};
      color: #fff;
      border: 1px solid #fff;
    `}
  ${(props) =>
    props.block &&
    css`
      display: block;
      width: 100%;
    `}
    ${(props) =>
      props.primary && props.outline &&
      css`
        background-color: transparent;
        color: ${primaryColor};
      `}
  
  ${(props) =>
    props.white &&
    !props.outline &&
    css`
      background-color: #fff;
      color: #000;
    `}

  ${(props) =>
    props.outline &&
    css`
      background-color: transparent;
      border: 1px solid ${primaryColor};
      color: ${primaryColor};
    `}

  ${(props) =>
    props.size === "l" &&
    css`
      font-size: 1.2rem;
      padding: 10px 20px;
    `}
`;

// ✅ component chính
const StyledButton = styled.button<ButtonProps>`
  ${ButtonStyle}
`;

export default function Button({
  children,
  ...rest
}: React.PropsWithChildren<ButtonProps>) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}