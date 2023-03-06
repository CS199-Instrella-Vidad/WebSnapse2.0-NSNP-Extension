import './App.css';
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import snppic from './snp.png';
import nsnppic from './nsnp.png';
function LandingPage(){
  return(
    
      <div className="welcome">
        <div className="greet"><h1>Welcome to WebSnapse 2.0</h1><br/>
          <p>a visual simulator for Spiking Neural Networks:</p>
          <p>Please Hover on a side for specifications</p>
        </div>
        <div className='LinkContainer'>
             <div class='divide-lside'>
                SN P Simulation
                <Link to="/websnapse_extended/SNP">
                <img src={snppic} alt=''/><br/>
                <div class="SNP">
                  -Traditional<br/>
                  -1:1 Node to number of Spikes<br/>
                  -Linear rules
                </div>
                </Link>
            </div>
            <div class='divide-rside'>
              NSN P Simulation
              <Link to="/websnapse_extended/NSNP">
              <img src={nsnppic} alt=''/><br/>
              <div className="NSNP">
                -1:Many Node to number of Spikes<br/>
                -can contain non-linear rule functions<br/>
              </div>
              </Link>
            </div>
        </div>
    </div>

  )
}
export default LandingPage;