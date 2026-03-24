"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { useSession } from "next-auth/react";

const menu = [
  { name: "Hồ Sơ", href: "/user/profile" },
  { name: "Ngân Hàng", href: "/user/bank" },
  { name: "Địa Chỉ", href: "/user/address" },
  { name: "Đổi Mật Khẩu", href: "/user/password" },
  { name: "Đơn Mua", href: "/user/orders" },
];

export default function UserNavBar() {
    const pathname = usePathname();
    const { data: session } = useSession();

  return (
    <Wrapper>
      <UserBox>
        <Avatar />
        <Info>
          <Name>Chouser</Name>
          <Edit>Sửa hồ sơ</Edit>
        </Info>
      </UserBox>

      <Menu>
        {menu.map((item) => (
          <MenuItem
            key={item.href}
            $active={pathname === item.href}
          >
            <Link href={item.href}>{item.name}</Link>   
          </MenuItem>
        ))}
      </Menu>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
`;

const UserBox = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #ddd;
`;

const Info = styled.div``;

const Name = styled.div`
  font-weight: bold;
`;

const Edit = styled.div`
  font-size: 12px;
  color: gray;
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
`;

const MenuItem = styled.li<{ $active: boolean }>`
  padding: 10px;
  border-left: ${(p) => (p.$active ? "3px solid #ee4d2d" : "none")};
  color: ${(p) => (p.$active ? "#ee4d2d" : "#333")};

  a {
    text-decoration: none;
    color: inherit;
  }

  &:hover {
    background: #f5f5f5;
  }
`;