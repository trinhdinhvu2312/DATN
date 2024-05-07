import Index from "./pages/IndexPage/Index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/LoginPage/Login";
import Register from "./pages/Auth/RegisterPage/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
