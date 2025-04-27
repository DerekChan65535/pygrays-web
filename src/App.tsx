import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Inventory from "./pages/inventory/Inventory";
import Layout from "./Layout";

function App() {
  return (
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>
        </Routes>
      </Router>
  );
}

export default App;