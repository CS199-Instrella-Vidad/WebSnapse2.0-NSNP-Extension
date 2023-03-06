import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import SNP from './SNP.js';
import LandingPage from './LandingPage.js';
function App(){
  return(
      <Router>
        <Switch>
          <Route path="/websnapse_extended/SNP"><SNP/></Route>
          <Route path="/websnapse_extended/NSNP"><SNP/></Route>
          <Route path="/"><LandingPage/></Route>
        </Switch>
      </Router>
  )
}
export default App;