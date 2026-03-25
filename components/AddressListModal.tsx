"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import AddressModal from "./AddressModal";

export default function AddressListModal({ onClose, onSelect }: any) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [editing, setEditing] = useState<any>(null);

  async function load() {
    const res = await fetch("/api/user/address");
    const data = await res.json();
    setAddresses(data);

    const defaultAddr = data.find((a: any) => a.isDefault);
    if (defaultAddr) setSelectedId(defaultAddr._id);
  }

  useEffect(() => {
    load();
  }, []);

  // 👉 mở form edit
  if (editing) {
    return (
      <AddressModal
        initialData={editing}
        onClose={() => setEditing(null)}
        onSuccess={load}
      />
    );
  }

  return (
    <Overlay>
      <Modal>
        <Header>
          My Address
          <Close onClick={onClose}>✕</Close>
        </Header>

        <List>
          {addresses.map((addr: any) => (
            <Item key={addr._id}>
              <Left>
                <input
                  type="radio"
                  checked={selectedId === addr._id}
                  onChange={() => setSelectedId(addr._id)}
                />

                <Info>
                  <b>{addr.name}</b> {addr.phone}
                  <br />
                  {addr.detail}, {addr.ward}, {addr.district}, {addr.city}
                  {addr.isDefault && <Default>Default</Default>}
                </Info>
              </Left>

              <Edit onClick={() => setEditing(addr)}>Edit</Edit>
            </Item>
          ))}
        </List>

        <Footer>
          <button onClick={() => setEditing({})}>
            + Add New Address
          </button>

          <Confirm
            onClick={() => {
              const selected = addresses.find(
                (a: any) => a._id === selectedId
              );
              onSelect(selected);
              onClose();
            }}
          >
            Confirm
          </Confirm>
        </Footer>
      </Modal>
    </Overlay>
  );
}

/* styles */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 600px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`;

const Close = styled.span`
  cursor: pointer;
`;

const List = styled.div`
  margin-top: 20px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Left = styled.div`
  display: flex;
  gap: 10px;
`;

const Info = styled.div`
  font-size: 14px;
`;

const Default = styled.span`
  border: 1px solid #ee4d2d;
  color: #ee4d2d;
  padding: 2px 6px;
  margin-left: 8px;
  font-size: 12px;
`;

const Edit = styled.span`
  color: #1677ff;
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Confirm = styled.button`
  background: #ee4d2d;
  color: white;
  padding: 8px 16px;
  border: none;
`;