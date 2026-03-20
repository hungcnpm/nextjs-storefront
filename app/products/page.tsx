import styled from "styled-components";
import Center from "@/components/Center";
import Header from "@/components/header";
import ProductsGrid from "@/components/ProductGrid";
import clientPromise from "@/lib/mongodb";
import Title from "@/components/Title";

async function getProducts() {
  const client = await clientPromise;
  const db = client.db("ecommerce");

  const products = await db
    .collection("products")
    .find({})
    .sort({ _id: -1 })
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <Center>
        <Title>All products</Title>
        <ProductsGrid products={products} />
      </Center>
    </>
  );
}