import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
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
