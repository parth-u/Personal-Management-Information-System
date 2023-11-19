import "./App.css";
import Login from "./login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
