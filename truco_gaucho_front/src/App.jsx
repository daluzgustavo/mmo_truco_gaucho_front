import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Salas from "./pages/Salas";
import Partida from "./pages/Partida";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/partida/:id" element={<Partida />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
