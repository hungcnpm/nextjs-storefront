"use client";

import styled from "styled-components";
import Button from "./Button";
import CardIcon from "./icons/card";
import  Link  from "next/link";
import { useContext } from "react"; 
import { CartContext } from "./cartContext";
const ProductWrapper = styled.div``;

const WhiteBox = styled(Link)`
  background-color: #000;
  padding: 20px;
  height: 120;
  text-align: center;
  display: flex;
  align-items: center; 
  justify-content: center;
    border-radius: 10px;
  img {
    max-width: 100%;
    max-height: 80px;
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  margin: 0;
  font-size: .9rem;
  coloer:inherit;
  text-decoration: none;
`;

type ProductBoxProps = { 
  _id: string;
  title: string;
  description?: string;
  price?: number;
  images: string[];
};
const ProductInfoBox = styled.div`
    margin-top: 5px;
`
const PriceRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
`
const Price= styled.div`
    font-size: 1.5rem;
    font-weight: 600;
`
export default function ProductBox({
  _id,
  title,
  description,
  price,
  images,
}: ProductBoxProps) {
  const url = '/products/'+_id;
  const { addProduct } = useContext(CartContext);
  return (
    
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
        <img src={images?.[0] || "/placeholder.png"} alt={title} />
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
        <div>
        <Price>
         ${price}
        </Price>
        </div>
        <div>
        <Button onClick={()=> addProduct(_id)} primary outline>Add to card</Button>
        </div>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}