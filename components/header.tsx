"use client";

import styled from "styled-components";
import Link from "next/link";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "./cartContext";
import MiniCart from "./MiniCart";
import { useSession, signOut } from "next-auth/react";

const StyledHeader = styled.header`  background-color: #222;
  position: sticky;
  top: 0;
  z-index: 1000;`;

const Logo = styled(Link)`  color: #fff;
  text-decoration: none;`;

const Nav = styled.nav`  display: flex;
  gap: 15px;`;

const NavLink = styled(Link)`  color: #fff;
  text-decoration: none;`;

const Wrapper = styled.div`  display: flex;
  justify-content: space-between;
  padding: 20px 0;`;

const CartWrapper = styled.div`  position: relative;
  padding-bottom: 10px;`;

const UserWrapper = styled.div`  position: relative;
  color: #fff;
  cursor: pointer;
  padding-bottom: 10px;`;

const UserInfo = styled.div`  display: flex;
  align-items: center;
  gap: 8px;`;

const Avatar = styled.img`  width: 28px;
  height: 28px;
  border-radius: 50%;`;

const Dropdown = styled.div`  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  color: #000;
  border-radius: 8px;
  padding: 10px;
  min-width: 160px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 999;`;

const DropdownItem = styled.div`
padding: 8px;
cursor: pointer;

&:hover {
background: #f5f5f5;
}
`;

const StyledLink = styled(Link)`  text-decoration: none;
  color: inherit;`;

export default function Header() {
const { cartItems = [] } = useContext(CartContext); // ✅ fix undefined
const [showCart, setShowCart] = useState(false);
const { data: session } = useSession();
const [openUser, setOpenUser] = useState(false);

// ✅ safe reduce
const cartCount = cartItems.reduce(
(sum, item) => sum + (item?.quantity || 0),
0
);

return ( 
    <>
    <StyledHeader> 
      <Center> 
        <Wrapper> 
          <Logo href="/">Ecommerce</Logo>
            <Nav>
              <NavLink href="/">Home</NavLink>
              <NavLink href="/products">All products</NavLink>
              <NavLink href="/categories">Categories</NavLink>
              {session ? (
                <>
                  <CartWrapper
                    onMouseEnter={() => setShowCart(true)}
                    onMouseLeave={() => setShowCart(false)}
                  >
                    <NavLink href="/cart">
                      Cart ({cartCount})
                    </NavLink>

                    {showCart && <MiniCart />}
                  </CartWrapper>

                  <UserWrapper
                    onMouseEnter={() => setOpenUser(true)}
                    onMouseLeave={() => setOpenUser(false)}
                  >
                    <UserInfo>
                      <Avatar
                        src={session.user?.image || "/default_image.jpg"}
                      />
                      <NavLink href="/user">  
                        {session.user?.username || session.user?.name}
                      </NavLink>
                    </UserInfo>

                    {openUser && (
                      <Dropdown>
                        <DropdownItem>
                          <StyledLink href="/user">
                            Tài khoản của tôi
                          </StyledLink>
                        </DropdownItem>
                        <DropdownItem>
                          <StyledLink href="/user/orders">
                            Đơn mua
                          </StyledLink>
                        </DropdownItem>
                        <DropdownItem onClick={() => signOut()}>
                          Đăng xuất
                        </DropdownItem>
                      </Dropdown>
                    )}
                  </UserWrapper>
                </>
              ) : (
                <>
                  <NavLink href="/login">Login</NavLink>
                  <NavLink href="/register">Register</NavLink>
                </>
              )}
            </Nav>
    </Wrapper>
  </Center>
</StyledHeader>
</>

);
}

