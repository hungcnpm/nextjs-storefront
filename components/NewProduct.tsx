"use client";

import styled from "styled-components";
import Center from "@/components/Center";
import ProductBox from "@/components/ProductBox";

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`;

type Product = {
  _id: string;
  title: string;
  images: string[];
};

type NewProductsProps = {
  products: Product[];
};
const Title = styled.h2`
  font-size: 2rem;
  margin: 0 0 20px;
  font-weight: 500;
`
export default function NewProducts({ products }: NewProductsProps) {
  return (
    <Center>
      <Title>New Arivals</Title>
      <ProductsGrid>
        {products?.length > 0 &&
          products.map((product) => (
            <ProductBox key={product._id} {...product} />
          ))}
      </ProductsGrid>
    </Center>
  );
}