"use client";

import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: #f5f5f5;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
`;

export const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #eee;
  vertical-align: middle;
`;

export const Tr = styled.tr``;

export const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
`;

export const ProductName = styled.div`
  font-size: 14px;
`;

export const QuantityInput = styled.input`
  width: 60px;
  padding: 6px;
  text-align: center;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
`;