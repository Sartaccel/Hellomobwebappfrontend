import Register from "./pages/Register/Register";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home";
// import Navbar from "./components/Navbar/MainNavbar";
import Login from "./pages/Login/Login";
import Hero from "./components/Hero/Hero"
import OtpVerification from "./pages/OtpVerification/OtpVerification";
import CategoryProduct from "./pages/CategoryProduct/CategoryProduct";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
           <Route path="/category/:category" element={<CategoryProduct />} />
        </Routes>
    </Router>

  );
}

export default App;