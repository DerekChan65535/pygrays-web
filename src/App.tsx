import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import Inventory from "./pages/inventory/Inventory";
import Layout from "./Layout";
import AgingReport from "./pages/aging-report/AgingReport";
import PaymentExtract from "./pages/payment-extract/PaymentExtract";
import BankStatement from "./pages/bank-statement/BankStatement";

function App() {
  return (
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="inventory" element={<Inventory />} />
              <Route path={"aging-report"} element={<AgingReport/>}/>
            <Route path="payment-extract" element={<PaymentExtract/>}/>
            <Route path="bank-statement" element={<BankStatement/>}/>
          </Route>
        </Routes>
      </Router>
  );
}

export default App;