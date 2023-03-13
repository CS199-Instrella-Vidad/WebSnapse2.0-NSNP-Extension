import NewNodeForm from "../../components/NSnapse/forms/NewNodeForm";
import { Button } from "react-bootstrap";
import { useState } from "react";
import Menu from "../../components/Menu/Menu";
import './NSNP.css';
function NSNP(){
    // modals
    const [showNewNodeModal, setShowNewNodeModal] = useState(false);

    //handles
    const handleClose = () => setShowNewNodeModal(false);
  const handleShow = () => setShowNewNodeModal(true);
    return(<>
        <Menu/>
        <div className="body">
            <div className="nsnpheader">
                <center><h1>NSN P Simulator</h1></center>
                <div className='actionselector'>
                    <NewNodeForm visible={showNewNodeModal} handleCloseModal={handleClose}/>
                    {/* place holders */}
                    <Button variant='c5'>New Input Neuron</Button>
                    <Button variant='c5'>New Output Neuron</Button>
                    <Button variant='c2'>Edit Neuron</Button>
                    <Button variant='c1'>Delete Neuron</Button>
                </div>
            </div>
            
            
        </div>
        
    </>);
}
export default NSNP;