import { useEffect } from "react";
import {
  Container,
  TrelloIconContainer,
  FormSection,
  FormCard,
  Form,
  Title,
  Icon,
  Hr,
  StyledLink,
} from "./Styled";
import { Link } from "react-router-dom";
import { Button, TextField } from "@mui/material";

const Login = () => {
  useEffect(() => {
    document.title = "Log in to Trello Clone";
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Container>
      <TrelloIconContainer>
        <Link to="/">
          <Icon src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/trello-header-logos/167dc7b9900a5b241b15ba21f8037cf8/trello-logo-blue.svg" />
        </Link>
      </TrelloIconContainer>
      <FormSection>
        <FormCard>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Title>Log in to Trello</Title>
            <TextField
              type="email"
              label="Email"
              placeholder="Enter email"
              variant="outlined"
              sx={{ width: "100%" }}
              required
            />
            <TextField
              type="password"
              label="Password"
              placeholder="Enter password"
              variant="outlined"
              sx={{ width: "100%" }}
              required
            />
            <Button variant="contained" color="success" sx={{ width: "100%" }}>
              Log in
            </Button>
            <Hr />
            <StyledLink fontSize="0.85rem" to="/register">
              Sign up for an account
            </StyledLink>
          </Form>
        </FormCard>
      </FormSection>
    </Container>
  );
};

export default Login;
