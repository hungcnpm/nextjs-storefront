"use client";

import Center from "@/components/Center";
import styled from "styled-components";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CardIcon from "./icons/card";
import { useContext } from "react";
import { CartContext } from "./cartContext";

const Bg = styled.div`  background-color: #222;
  color: #fff;
  padding: 50px 0;`;

const Title = styled.h1`  margin: 0;
  font-weight: normal;
  font-size: 3rem;`;

const Desc = styled.p`  font-size: .8rem;
  color: #aaa;`;

const ColumnWrapper = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 40px;

img {
max-width: 100%;
}
`;

const ButtonWrapper = styled.div`  display: flex;
  gap: 10px;
  margin-top: 25px;`;

const Column = styled.div`  display: flex;
  align-items: center;
  flex-direction: column;`;

export default function Featured({ product }) {
// ✅ FIX: đổi addProducts -> addProduct
const { addProduct } = useContext(CartContext);

function addFeaturedToCart() {
if (!product?._id) return;
addProduct(product._id);
}

return ( 
  <>
<Bg> 
  <Center> 
    <ColumnWrapper> 
    <Column> 
    <div> 
      <Title>{product.title}</Title> 
      <Desc>{product.description}</Desc>
          <ButtonWrapper>
            <ButtonLink href={`/products/${product._id}`} outline white>
              Read more
            </ButtonLink>

            <Button white onClick={addFeaturedToCart}>
              <CardIcon />
              Add to cart
            </Button>
          </ButtonWrapper>
        </div>
      </Column>

      <Column>
        <img
          src={product.images?.[0] }
          alt=""
        />
      </Column>
    </ColumnWrapper>
  </Center>
</Bg>
</>

);
}

