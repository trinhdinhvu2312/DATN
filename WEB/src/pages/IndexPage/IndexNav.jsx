import styled from "styled-components";
import { lg } from "~/utils/breakpoints";
import { Link } from "react-router-dom";
import trelloLogo from "~/assets/images/trello-logo.svg";

const Container = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  z-index: 100;

  ${lg({
    justifyContent: "space-between",
  })}
`;

const Icon = styled.img`
  margin-left: 1rem;
  ${lg({
    marginLeft: "0",
  })}
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
  cursor: pointer;
  color: #0952cc;
`;

const Button = styled.button`
  background-color: #0065ff;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #0952cc;
  }
`;

const ButtonLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: white;
`;

const IndexNav = () => {
  return (
    <Container>
      <Icon src={trelloLogo} />
      <RightSide>
        <StyledLink to="/login">Log in</StyledLink>
        <Button>
          <ButtonLink to="/register">Sign up</ButtonLink>
        </Button>
      </RightSide>
    </Container>
  );
};

export default IndexNav;
