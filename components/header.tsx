"use client";

import styled from "styled-components";
import Link from "next/link";
import Center from "@/components/Center";
import { useContext } from "react";
import { CartContext } from "./cartContext";
const StyledHeader = styled.header`
  background-color: #222;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: 15px;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
`;  
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  `

export default function Header() {
  const {cartProducts} = useContext(CartContext); 
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
        <Logo href="/">Ecommerce</Logo>
            <Nav>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">All products</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/account">Account</NavLink>
            <NavLink href="/cart">Cart ({cartProducts.length})</NavLink>
            </Nav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}