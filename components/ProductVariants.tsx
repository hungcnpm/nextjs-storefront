"use client";

import { useState } from "react";
import styled from "styled-components";

const VariantGroup = styled.div`
  margin-top: 20px;
`;

const VariantTitle = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
`;

const VariantOptions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const VariantButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  cursor: pointer;

  background: ${(props) => (props.active ? "#6c47ff" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
`;

export default function ProductVariants({ properties }: any) {
  const [selected, setSelected] = useState(properties);

  return (
    <div>
      {Object.entries(properties || {}).map(([key, value]) => (
        <VariantGroup key={key}>
          <VariantTitle>{key}</VariantTitle>

          <VariantOptions>
            {/* hiện tại mỗi property chỉ có 1 value */}
            <VariantButton active>
              {value as string}
            </VariantButton>
          </VariantOptions>
        </VariantGroup>
      ))}
    </div>
  );
}