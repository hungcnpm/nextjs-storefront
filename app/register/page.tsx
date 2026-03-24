"use client";

import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00c6ff, #6c47ff);
`;

const Card = styled.form`
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 360px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
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

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [gender, setGender] = useState("");
  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        username,
        name,
        email,
        password,
        gender,
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      toast(data.error);
      return;
    }
  
    toast("Register success");
  
    // 👉 auto login luôn
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <Wrapper>
      <Card onSubmit={handleRegister}>
        <Title>Create Account</Title>
        <Input
          type="name"
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          type="username"
          placeholder="Username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button>Register</Button>

        <BottomText>
          Already have an account?{" "}
          <Link href="/login">Login</Link>
        </BottomText>
      </Card>
    </Wrapper>
  );
}