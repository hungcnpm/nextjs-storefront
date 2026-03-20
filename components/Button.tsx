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

// ✅ dùng transient props ($) để tránh leak ra DOM
type StyledButtonProps = {
  $primary?: boolean;
  $size?: "l" | "m";
  $white?: boolean;
  $outline?: boolean;
  $block?: boolean;
};

export const ButtonStyle = css<StyledButtonProps>`
  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-family: "Poppins", sans-serif;
  text-decoration: none;
  font-weight: 500;

  svg {
    height: 16px;
    margin-right: 5px;
  }

  ${({ $primary }) =>
    $primary &&
    css`
      background-color: ${primaryColor};
      color: #fff;
      border: 1px solid #fff;
    `}

  ${({ $block }) =>
    $block &&
    css`
      display: block;
      width: 100%;
    `}

  ${({ $primary, $outline }) =>
    $primary &&
    $outline &&
    css`
      background-color: transparent;
      color: ${primaryColor};
    `}

  ${({ $white, $outline }) =>
    $white &&
    !$outline &&
    css`
      background-color: #fff;
      color: #000;
    `}

  ${({ $outline }) =>
    $outline &&
    css`
      background-color: transparent;
      border: 1px solid ${primaryColor};
      color: ${primaryColor};
    `}

  ${({ $size }) =>
    $size === "l" &&
    css`
      font-size: 1.2rem;
      padding: 10px 20px;
    `}
`;

const StyledButton = styled.button<StyledButtonProps>`
  ${ButtonStyle}
`;

export default function Button({
  children,
  primary,
  size,
  white,
  outline,
  block,
  ...rest
}: React.PropsWithChildren<ButtonProps> &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <StyledButton
      $primary={primary}
      $size={size}
      $white={white}
      $outline={outline}
      $block={block}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}