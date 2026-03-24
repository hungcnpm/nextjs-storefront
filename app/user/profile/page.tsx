"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasGender, setHasGender] = useState(false);
  const [image, setImage] = useState(session?.user?.image || null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }

    if (session?.user) {
      setName(session.user.name || "");

      const g = (session.user as any).gender;
      if (g) {
        setGender(g);
        setHasGender(true);
      }
    }
  }, [session]);

  const submitUpdate = async () => {
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, gender, image }),
    });

    if (res.ok) {
      await update({ name, gender, image });
      toast.success("Cập nhật thành công");
    } else {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleUpdate = async () => {
    if (!hasGender) {
      setShowConfirm(true);
      return;
    }
    await submitUpdate();
  };

  return (
    <Wrapper>
      <Card>
        <Header>
          <div>
            <Title>Hồ Sơ Của Tôi</Title>
            <Sub>Quản lý thông tin hồ sơ để bảo mật tài khoản</Sub>
          </div>
        </Header>

        <Body>
          {/* LEFT */}
          <Form>
            <Row>
              <Label>Tên đăng nhập</Label>
              <Value>{session?.user?.username}</Value>
            </Row>

            <Row>
              <Label>Tên</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Row>

            <Row>
              <Label>Email</Label>
              <Value>{session?.user?.email}</Value>
            </Row>

            <Row>
              <Label>Số điện thoại</Label>
              <Value>
                {(session?.user as any)?.phone || "Chưa cập nhật"}
              </Value>
            </Row>

            <Row>
              <Label>Giới tính</Label>

              {hasGender ? (
                <Value>
                  {(session?.user as any)?.gender === "male" && "Nam"}
                  {(session?.user as any)?.gender === "female" && "Nữ"}
                  {(session?.user as any)?.gender === "other" && "Khác"}
                </Value>
              ) : (
                <GenderBox>
                  <label>
                    <input
                      type="radio"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Nam
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Nữ
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="other"
                      checked={gender === "other"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    Khác
                  </label>

                  <Note>(Chỉ có thể chọn 1 lần)</Note>
                </GenderBox>
              )}
            </Row>

            <Row>
              <Label />
              <SaveButton onClick={handleUpdate}>Lưu</SaveButton>
            </Row>
          </Form>

          {/* RIGHT */}
          <AvatarSection>
            <Avatar>
              {image ? (
                <img src={image} />
              ) : (
                <span>Avatar</span>
              )}
            </Avatar>

            <UploadBtn>Chọn Ảnh</UploadBtn>
            <Hint>Dung lượng file tối đa 1 MB</Hint>
            <Hint>Định dạng: JPEG, PNG</Hint>
          </AvatarSection>
        </Body>
      </Card>

      {/* CONFIRM */}
      {showConfirm && (
        <ConfirmModal
          message="Bạn chỉ có thể chọn giới tính một lần. Bạn có chắc chắn không?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            setShowConfirm(false);
            await submitUpdate();
          }}
        />
      )}
    </Wrapper>
  );
}

/* ================= UI SHOPEE STYLE ================= */

const Wrapper = styled.div`
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Card = styled.div`
  background: white;
  border-radius: 6px;
  padding: 20px 30px;
`;

const Header = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

const Sub = styled.p`
  color: #888;
  font-size: 14px;
`;

const Body = styled.div`
  display: flex;
  gap: 60px;
  margin-top: 20px;
`;

const Form = styled.div`
  flex: 2;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
`;

const Label = styled.div`
  width: 160px;
  color: #555;
  font-size: 14px;
  text-align: right;
    margin-right: 20px;
`;

const Value = styled.div`
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  width: 300px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:focus {
    border-color: #ee4d2d;
    outline: none;
  }
`;

const GenderBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  label {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const Note = styled.div`
  font-size: 12px;
  color: #999;
  margin-left: 10px;
`;

const SaveButton = styled.button`
  background: #ee4d2d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const AvatarSection = styled.div`
  flex: 1;
  border-left: 1px solid #eee;
  padding-left: 40px;
  text-align: center;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f5f5f5;
  margin: auto;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    line-height: 120px;
    color: #999;
  }
`;

const UploadBtn = styled.button`
  margin-top: 16px;
  padding: 8px 14px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;

  &:hover {
    border-color: #ee4d2d;
    color: #ee4d2d;
  }
`;

const Hint = styled.p`
  font-size: 12px;
  color: #999;
  margin-top: 6px;
`;