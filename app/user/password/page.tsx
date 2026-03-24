"use client";

import styled from "styled-components";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    const res = await fetch("/api/user/change-password", {
      method: "PUT",
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Đổi mật khẩu thành công");
      setOld("");
      setNew("");
      setConfirm("");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <Wrapper>
      <Title>Đổi Mật Khẩu</Title>
      <Sub>
        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
      </Sub>

      <Content>
        <Form>
          <Field>
            <label>Mật khẩu cũ</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOld(e.target.value)}
            />
          </Field>

          <Field>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNew(e.target.value)}
            />
          </Field>

          <Field>
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Field>

          <Button onClick={handleSubmit}>
            Xác nhận
          </Button>
        </Form>

        {/* Giữ layout giống profile */}
        <AvatarBox>
          <Note>
            🔒 Hãy đặt mật khẩu mạnh gồm chữ, số và ký tự đặc biệt
          </Note>
        </AvatarBox>
      </Content>
    </Wrapper>
  );
}

/* 🔁 reuse 100% style từ profile */

const Wrapper = styled.div``;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 4px;
`;

const Sub = styled.p`
  color: gray;
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  gap: 40px;
`;

const Form = styled.div`
  flex: 1;
`;

const Field = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 4px;
  }

  input {
    width: 100%;
    padding: 8px;
  }
`;

const Button = styled.button`
  background: #ee4d2d;
  color: white;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
`;

const AvatarBox = styled.div`
  width: 200px;
`;

const Note = styled.p`
  font-size: 14px;
  color: gray;
`;