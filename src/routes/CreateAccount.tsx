import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import GithubBtn from "../components/GithubBtn";
import { auth } from "./firebase";

const Wrapper = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding-top: 80px;
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600px;
  color: tomato;
`;

const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #1d9bf1;
  }
`;

const CreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!name || !password || !email || isLoading) return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Join Lwitter</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "Loading" : "Create Account"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        이미 계정이 있으세요? <Link to="/login">여기 &rarr;</Link>를 클릭하세요!
      </Switcher>
      <GithubBtn />
    </Wrapper>
  );
};

export default CreateAccount;
