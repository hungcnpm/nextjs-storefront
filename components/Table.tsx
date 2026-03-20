"use client";

import styled from "styled-components";
import React from "react";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 10px;
    font-size: 14px;
    color: #555;
  }

  td {
    padding: 10px;
    border-top: 1px solid #eee;
    vertical-align: middle;
  }

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;


export default function Table({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StyledTable>{children}</StyledTable>;
}