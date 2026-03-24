"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import styled from "styled-components";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6c47ff, #00c6ff);
`;

const Card = styled.form`
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 360px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Toggle = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 12px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #6c47ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #5a3de0;
  }
`;

const BottomText = styled.p`
  margin-top: 15px;
  text-align: center;
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  async function handleLogin(e: any) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Welcome back!");
      router.push(callbackUrl);
    }
  }

  return (
    <Wrapper>
      <Card onSubmit={handleLogin}>
        <Title>Welcome Back</Title>

        <Input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputWrapper>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Toggle onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </Toggle>
        </InputWrapper>

        <Button>Login</Button>

        <BottomText>
          Don’t have an account?{" "}
          <Link href="/register">Register</Link>
        </BottomText>
      </Card>
    </Wrapper>
  );
}