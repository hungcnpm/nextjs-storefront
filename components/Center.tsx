"use client";

import styled from "styled-components";
import React from "react";

const StyledDiv = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
`;

export default function Center({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StyledDiv>{children}</StyledDiv>;
}