import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Inventory from "./Pages/Inventory";
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