import NewNodeForm from "../../components/NSnapse/forms/NewNodeForm";
import NewInputForm from "../../components/NSnapse/forms/NewInputForm";
import { Button } from "react-bootstrap";
import { useState } from "react";
import Menu from "../../components/Menu/Menu";
import './NSNP.css';

function NSNP(){
    // modals
    const [showNewNodeModal, setShowNewNodeModal] = useState(false);
    const [showNewInputNodeModal, setShowNewInputNodeModal] = useState(false);

    //handles
    const handleClose = () => setShowNewNodeModal(false);
    const handleShow = () => setShowNewNodeModal(true);
    const handleNewInputClose=()=>setShowNewInputNodeModal(false);
    const handleNewInputShow= () => setShowNewInputNodeModal(true);
    return(<>
        <Menu/>
        <div className="body">
            <div className="nsnpheader">
                <center><h1>NSN P Simulator</h1></center>
                <div className='actionselector'>
                    <NewNodeForm handleCloseModal={handleClose}/>
                    <NewInputForm handleCloseModal={handleNewInputClose}/>
                    {/* place holders */}
                    
                    <Button variant='c5'>New Output Neuron</Button>
                    <Button variant='c2'>Edit Neuron</Button>
                    <Button variant='c1'>Delete Neuron</Button>
                </div>
            </div>
            
            
        </div>
        
    </>);
}
export default NSNP;