import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home/Home";
import Contact from "./pages/ContactPage/Contact";
import About from "./pages/AboutPage/About";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";
import Login from "./components/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Menu" element={<Menu />} />
      <Route path="/About" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />\

      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;
