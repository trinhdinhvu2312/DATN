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
  Link,
} from "./Styled";
import { useEffect } from "react";

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
          <Icon src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/trello-header-logos/167dc7b9900a5b241b15ba21f8037cf8/trello-logo-blue.svg" />
        </TrelloIconContainer>
        <FormSection>
          <FormCard>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Title>Sign up for your account</Title>
              <Input type="text" placeholder="Enter name" required />
              <Input type="text" placeholder="Enter surname" required />
              <Input type="email" placeholder="Enter email" required />
              <Input type="password" placeholder="Enter password" required />
              <Input type="password" placeholder="Confirm password" required />
              <Text>
                By signing up, you confirm that you have read and accepted our{" "}
                <Link fontSize="0.75rem">Terms of Service</Link> and{" "}
                <Link fontSize="0.75rem">Privacy Policy</Link>.
              </Text>
              <Button type="submit">Complete</Button>
              <Hr />
              <Link fontSize="0.85rem" onClick={() => history.push("/login")}>
                Already have an account? Log In
              </Link>
            </Form>
          </FormCard>
        </FormSection>
      </Container>
    </>
  );
};

export default Register;
