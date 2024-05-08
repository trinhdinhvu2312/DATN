import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  TrelloIconContainer,
  Title,
  Button,
  Text,
  Icon,
  Hr,
  StyledLink,
} from "./Styled";
import { useEffect, useState } from "react";
import { Card, Stack, TextField } from "@mui/material";
import { toast } from "react-toastify";
import UserServices from "~/apis/UserServices";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const validateRegisterForm = (username, email, password, confirmPassword) => {
    if (!username || !email || !password || !confirmPassword) {
      return { isValid: false, message: "All fields are required." };
    }

    if (password !== confirmPassword) {
      return { isValid: false, message: "Passwords do not match." };
    }

    if (password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long.",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Invalid email address." };
    }

    // Nếu tất cả các điều kiện đều được thoả mãn, trả về true
    return { isValid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = validateRegisterForm(
      username,
      email,
      password,
      confirmPassword
    );
    if (validationResult.isValid) {
      const response = await UserServices.register({
        username,
        email,
        password,
      });
      if (response.status === 201) {
        navigate("/login");
        toast.success("Register successfully");
      }
    } else {
      toast.error(validationResult.message);
    }
  };
  useEffect(() => {
    document.title = "Create a Trello Account";
  }, []);

  return (
    <>
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
              <Title>Sign up for your account</Title>
              <TextField
                type="text"
                label="Username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
                required
              />
              <TextField
                type="email"
                label="Email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                type="password"
                label="Confirm Password"
                placeholder="Confirm password"
                variant="outlined"
                sx={{ width: "100%" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Text>
                By signing up, you confirm that you have read and accepted our{" "}
                <Link fontSize="0.75rem">Terms of Service</Link> and{" "}
                <Link fontSize="0.75rem">Privacy Policy</Link>.
              </Text>
              <Button type="submit" onClick={handleSubmit}>
                Complete
              </Button>
              <Hr />
              <StyledLink fontSize="0.85rem" to="/login">
                Already have an account? Log In
              </StyledLink>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

export default Register;
