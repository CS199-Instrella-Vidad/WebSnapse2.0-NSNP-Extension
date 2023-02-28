import "./scss/custom.scss";
import "./App.css";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import SNP from "./pages/SNP/SNP";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <SNP />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
