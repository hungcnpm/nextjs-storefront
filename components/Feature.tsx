"use client";

import Center from "@/components/Center";
import styled from "styled-components";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CardIcon from "./icons/card";
import { useContext } from "react";
import { CartContext } from "./cartContext";
const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
`;
const Desc = styled.p`
  font-size: .8rem;
  color: #aaa;
  `
const ColumnWrapper = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 40px;
img {
    max-width: 100%;
}
`
const ButtonWrapper = styled.div`
display: flex;
gap: 10px;
margin-top: 25px;`
const Column = styled.div`
display: flex;
align-items: center;
flex-direction: column;`
export default function Featured({product}) {
    const {addProducts} = useContext(CartContext); 
    function addFeaturedToCard() {
      if (!product?._id) return;
      addProducts(product._id);
    }
  return (
    <Bg>
      <Center>
        <ColumnWrapper>
            <Column>
                <div>
                <Title>{product.title}</Title>
                <Desc>
                    {product.description}
                </Desc> 
                <ButtonWrapper>
                <ButtonLink href={`/products/${product._id}`} outline white>Read more</ButtonLink>
                <Button white onClick={addFeaturedToCard}>
                  <CardIcon />

                    Add to card</Button>
                </ButtonWrapper>
                </div>
            </Column>
            <Column>
               <img src="https://res.cloudinary.com/dzh5qpgpr/image/upload/v1773684525/jjtonxds5wvfro2wfio3.jpg" alt="" />
            </Column>
        </ColumnWrapper>
        
      </Center>
    </Bg>
  );
}