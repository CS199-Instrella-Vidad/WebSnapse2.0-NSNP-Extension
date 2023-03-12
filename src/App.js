import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import SNP from "./pages/SNP/SNP";
import LandingPage from "./pages/Landing/LandingPage.js";
import NSNP from "./components/NSnapse/forms/NewNodeForm.jsx";
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/websnapse_extended/SNP">
          <SNP />
        </Route>
        <Route path="/websnapse_extended/NSNP">
          <NSNP />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
