import Center from "@/components/Center";
import Header from "@/components/header";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import styled from "styled-components"
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import Title from "@/components/Title";
import AddToCartButton from "@/components/AddToCartButton";


// 👉 Tách riêng function fetch product
async function getProduct(id: string) {
  const client = await clientPromise;
  const db = client.db("ecommerce");

  const product = await db.collection("products").findOne({
    _id: new ObjectId(id),
  });

  return product ? JSON.parse(JSON.stringify(product)) : null;
}
const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: .8fr 1.2fr;
    gap: 40px;
    margin-top: 40px;
`
const PriceRow = styled.div`
  gap: 20px;
  display: flex;
  align-items: center;
`
const Price = styled.span`
  font-size: 1.4rem;
`
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
            <WhiteBox>
                <ProductImages images={product.images} />
            </WhiteBox>
            <div>
                <Title>{product.title}</Title>
                <p>{product.description}</p>
                <PriceRow>
                  <div>

                  <Price>${product.price}</Price>
                  </div>
                <AddToCartButton product={product}/>
                </PriceRow>
            </div>
        </ColWrapper>
      </Center>
    </>
  );
}