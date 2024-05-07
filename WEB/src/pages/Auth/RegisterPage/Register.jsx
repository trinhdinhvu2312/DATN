import { Link } from "react-router-dom";
import {
  Container,
  TrelloIconContainer,
  FormSection,
  FormCard,
  Form,
  Title,
  Input,
  Button,
  Text,
  Icon,
  Hr,
  StyledLink,
} from "./Styled";
import { useEffect } from "react";
import { TextField } from "@mui/material";

const Register = () => {
  useEffect(() => {
    document.title = "Create a Trello Account";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Container>
        <TrelloIconContainer>
          <Link to="/">
            <Icon src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/trello-header-logos/167dc7b9900a5b241b15ba21f8037cf8/trello-logo-blue.svg" />
          </Link>
        </TrelloIconContainer>
        <FormSection>
          <FormCard>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Title>Sign up for your account</Title>
              <TextField
                type="text"
                label="Username"
                placeholder="Enter username"
                variant="outlined"
                sx={{ width: "100%" }}
                required
              />
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
              <TextField
                type="password"
                label="Confirm Password"
                placeholder="Confirm password"
                variant="outlined"
                sx={{ width: "100%" }}
                required
              />
              <Text>
                By signing up, you confirm that you have read and accepted our{" "}
                <Link fontSize="0.75rem">Terms of Service</Link> and{" "}
                <Link fontSize="0.75rem">Privacy Policy</Link>.
              </Text>
              <Button type="submit">Complete</Button>
              <Hr />
              <StyledLink fontSize="0.85rem" to="/login">
                Already have an account? Log In
              </StyledLink>
            </Form>
          </FormCard>
        </FormSection>
      </Container>
    </>
  );
};

export default Register;
