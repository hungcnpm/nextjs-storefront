"use client";

import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductGrid";

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
      <ProductsGrid products={products} />
    </Center>
  );
}