import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Trips from "./pages/Trips";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trip-details" element={<Trips />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
