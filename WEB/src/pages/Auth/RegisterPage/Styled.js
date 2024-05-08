import { Link } from "react-router-dom";
import styled from "styled-components";
import { md } from "~/utils/breakpoints";

export const BgContainer = styled.div`
  display: initial;
  ${md({
    display: "none",
  })}
`;

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  ${md({
    backgroundColor: "#F9FAFC",
  })}
`;
export const TrelloIconContainer = styled.div`
  cursor: pointer;
  padding-top: 2.5rem;
  ${md({
    paddingTop: "1rem",
  })}
`;
export const Icon = styled.img`
  display: block;
  height: 2.6rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2.5rem;
  ${md({
    marginBottom: "1rem",
  })}
`;

export const Title = styled.h1`
  color: #5e6c84;
  font-size: 1rem;
  padding: 1rem;
`;
export const Input = styled.input`
  width: 100%;
  outline: none;
  font-size: 0.85rem;
  border-radius: 0.2rem;
  padding: 0.6rem;
  border: 2px solid #dfe1e6;
  background-color: #fafbfc;
  &:focus {
    transition: background-color 0.2s ease-in-out 0s,
      border-color 0.2s ease-in-out 0s;
    border: 2px solid #68bcff;
  }
`;
export const Button = styled.button`
  background-color: #5aac44;
  width: 100%;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: ${(props) =>
      props.disabled
        ? "lightgrey"
        : "linear-gradient(to bottom, #61bd4f 0%, #5aac44 100%)"};
  }
  &:disabled {
    background-color: lightgray;
    cursor: default;
  }
`;
export const Hr = styled.hr`
  width: 100%;
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid hsl(0, 0%, 80%);
  margin: 0.5 0;
  padding: 0;
`;
export const Text = styled.p`
  font-size: 0.75rem;
  line-height: 1rem;
  color: #5e6c84;
`;
export const StyledLink = styled(Link)`
  text-decoration: none;
  color: #0052cc;
  cursor: pointer;
  font-size: ${(props) => props.fontSize};
  &:hover {
    color: #0052cc;
  }
`;
