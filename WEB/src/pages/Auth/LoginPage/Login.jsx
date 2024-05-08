import { useState } from "react";
import {
  Container,
  TrelloIconContainer,
  Title,
  Icon,
  Hr,
  StyledLink,
} from "./Styled";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, Card, Stack, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "~/redux/actions/authActions";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoggedIn } = useSelector((state) => state.auth);

  const validateEmailAndPassword = (email, password) => {
    return email.trim() !== "" && password.trim() !== "";
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateEmailAndPassword(email, password)) {
      toast.error("Email and password are required");
      return;
    }

    const credentials = { email, password };
    dispatch(login(credentials, navigate));
  };

  if (isLoggedIn) {
    return <Navigate to="/board" />;
  }

  return (
    <Container>
      <TrelloIconContainer>
        <Link to="/">
          <Icon src="https://d2k1ftgv7pobq7.cloudfront.net/meta/c/p/res/images/trello-header-logos/167dc7b9900a5b241b15ba21f8037cf8/trello-logo-blue.svg" />
        </Link>
      </TrelloIconContainer>
      <Stack alignItems="center" justifyContent="center">
        <Card
          elevation={6}
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
            gap: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack spacing={3} alignItems="center" width="100%">
            <Title>Log in to Trello</Title>
            <TextField
              type="email"
              label="Email"
              placeholder="Enter email"
              variant="outlined"
              sx={{ width: "100%" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              type="password"
              label="Password"
              placeholder="Enter password"
              variant="outlined"
              sx={{ width: "100%" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="contained"
              color="success"
              sx={{ width: "100%" }}
              onClick={handleLogin}
              type="submit"
            >
              Log in
            </Button>
            <Hr />
            <StyledLink fontSize="0.85rem" to="/register">
              Sign up for an account
            </StyledLink>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default Login;
