import { useEffect } from "react";
import {
  Container,
  TrelloIconContainer,
  FormSection,
  FormCard,
  Form,
  Title,
  Input,
  Button,
  Icon,
  Hr,
  Link,
} from "./Styled";

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
        <Icon src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/trello-header-logos/167dc7b9900a5b241b15ba21f8037cf8/trello-logo-blue.svg" />
      </TrelloIconContainer>
      <FormSection>
        <FormCard>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Title>Log in to Trello</Title>
            <Input type="email" placeholder="Enter email" required />
            <Input type="password" placeholder="Enter password" required />
            <Button>Log in</Button>
            <Hr />
            <Link fontSize="0.85rem">Sign up for an account</Link>
          </Form>
        </FormCard>
      </FormSection>
    </Container>
  );
};

export default Login;
