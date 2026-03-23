import Center from "@/components/Center";
import Header from "@/components/header";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import AddToCartButton from "@/components/AddToCartButton";
import ProductVariants from "@/components/ProductVariants";

// 👉 giữ nguyên fetch
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
  grid-template-columns: 0.9fr 1.1fr;
  gap: 40px;
  margin-top: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PriceRow = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Price = styled.span`
  font-size: 26px;
  font-weight: bold;
  color: #e53935;
`;

const Tabs = styled.div`
  margin-top: 50px;
`;

const SectionTitle = styled.h2`
  margin-top: 30px;
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

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
        {/* TOP */}
        <ColWrapper>
          {/* IMAGE */}
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>

          {/* INFO */}
          <div>
            <Title>{product.title}</Title>

            <p>{product.description}</p>

            <PriceRow>
              <Price>
                ${Number(product.price).toLocaleString()}
              </Price>

              <AddToCartButton product={product} />
            </PriceRow>

            {/* 👉 VARIANTS */}
            <ProductVariants properties={product.properties} />
          </div>
        </ColWrapper>

        {/* DETAIL */}
        <Tabs>
          <SectionTitle>Description</SectionTitle>
          <p>{product.description}</p>

          <SectionTitle>Specifications</SectionTitle>
          {Object.entries(product.properties || {}).map(
            ([key, value]) => (
              <SpecRow key={key}>
                <span>{key}</span>
                <span>{value as string}</span>
              </SpecRow>  
            )
          )}
        </Tabs>
      </Center>
    </>
  );
}