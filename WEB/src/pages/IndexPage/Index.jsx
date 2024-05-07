import { useEffect } from "react";
import IndexNav from "~/pages/IndexPage/IndexNav";
import {
  Container,
  Content,
  LeftSide,
  RightSide,
  LeftWrapper,
  Title,
  Text,
  Button,
  SvgItem,
} from "./Styled";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ButtonLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: white;
`;

const Index = () => {
  useEffect(() => {
    document.title = "Trello Clone";
  }, []);
  return (
    <>
      <IndexNav />
      <Container>
        <Content>
          <LeftSide>
            <LeftWrapper>
              <Title>Trello helps teams move work forward.</Title>
              <Text>
                Collaborate, manage projects, and reach new productivity peaks.
                From high rises to the home office, the way your team works is
                unique—accomplish it all with Trello.
              </Text>
              <Button>
                <ButtonLink to="/register">Sign up - it is free</ButtonLink>
              </Button>
            </LeftWrapper>
          </LeftSide>
          <RightSide>
            <SvgItem src="https://images.ctfassets.net/rz1oowkt5gyp/5QIzYxue6b7raOnVFtMyQs/113acb8633ee8f0c9cb305d3a228823c/hero.png?w=1200&fm=webp" />
          </RightSide>
        </Content>
      </Container>
    </>
  );
};

export default Index;
