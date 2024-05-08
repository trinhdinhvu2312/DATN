import styled from "styled-components";
import { md } from "~/utils/breakpoints";
import { Link } from "react-router-dom";

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

export const Hr = styled.hr`
  width: 100%;
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid hsl(0, 0%, 80%);
  margin: 0.5 0;
  padding: 0;
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
