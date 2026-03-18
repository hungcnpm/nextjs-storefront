"use client";

import styled from "styled-components";
import React from "react";

const StyledTable = styled.div`
  width: 100%;
  th{
    text-align: left;
    text-transform: uppercase;
    font-size: 14px;
    color: #ccc;
    font-weight: 500;}
td{
    border-top: 1px solid rgba(0,0,0,0.1);

}
`;


export default function Table({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StyledTable>{children}</StyledTable>;
}