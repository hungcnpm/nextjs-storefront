"use client";

import styled from "styled-components";

interface Props {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title = "Xác nhận",
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>

        <Actions>
          <Cancel onClick={onCancel}>Hủy</Cancel>
          <Confirm onClick={onConfirm}>Đồng ý</Confirm>
        </Actions>
      </Modal>
    </Overlay>
  );
}

/* ===== STYLE XỊN ===== */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;  
  align-items: center;
  z-index: 999;

  backdrop-filter: blur(2px);
`;

const Modal = styled.div`
  width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  animation: fadeIn 0.2s ease;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  @keyframes fadeIn {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
`;

const Message = styled.p`
  text-align: center;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

const Cancel = styled.button`
  min-width: 100px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;

  &:hover {
    background: #eaeaea;
  }
`;

const Confirm = styled.button`
  min-width: 100px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background: #ee4d2d;
  color: #fff;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #d8431f;
  }
`;