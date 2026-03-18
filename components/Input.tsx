"use client";

import styled from "styled-components";
import React from "react";

const StyledInput = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 5px;
  border-radius: 5px;
  box-sizing: border-box;
`;


export default function Input(
    props: React.InputHTMLAttributes<HTMLInputElement>
  ) {
    return <StyledInput {...props} />;
  }