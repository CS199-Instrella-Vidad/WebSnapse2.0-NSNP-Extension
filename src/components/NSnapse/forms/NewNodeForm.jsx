import { useState, useEffect } from "react";
import Select from "react-select";
import { Slider } from "@mui/material";
import './forms.css';
import { Modal,Button, ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
function NewNodeForm(props) {
  const [numVars, setNumVars] = useState(1);
  const [numFuncs, setNumFuncs] = useState(1);
  const [nodeOptions, setNodeOptions] = useState([]);

  const [inputVars, setInputVars] = useState([]);
  const [inputFuncs, setInputFuncs] = useState([]);
  const [inputSynOut, setInputSynOut] = useState([]);
  const [inputSynIn, setInputSynIn] = useState([]);

  //const neuronNumber = props.L[0].length + 1;

  //for modals
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);setNumVars(1);
    setNumFuncs(1);};
  function addNewNeuron() {
    // Add new neuron to the system

    

    setNumVars(1);
    setNumFuncs(1);
    setInputVars([]);
    setInputFuncs([]);
    setInputSynOut([]);
    setInputSynIn([]);
  }

  function handleAddVars(i, value) {
    let newVars = inputVars;
    newVars[i] = value;
    setInputVars(newVars);
  }

  function handleAddFuncs(i, j, e) {
    let newFuncs = inputFuncs;
    newFuncs[i][j] = e;
    setInputFuncs(newFuncs);
  }

  function handleAddSynOut(e) {
    setInputSynOut(e);
  }

  function handleAddSynIn(e) {
    setInputSynIn(e);
  }

  // Change size of inputVars when numVars changes
  useEffect(() => {
    let newInputVars = inputVars;
    if (inputVars.length < numVars) {
      for (let i = newInputVars.length; i < numVars; i++) {
        newInputVars.push(0);
      }
    } else if (inputVars.length > numVars) {
      for (let i = newInputVars.length; i > numVars; i--) {
        newInputVars.pop();
      }
    }

    setInputVars(newInputVars);
  }, [numVars]);

  // Change size of inputFuncs when numFuncs changes
  useEffect(() => {
    let newInputFuncs = inputFuncs;
    if (inputFuncs.length < numFuncs) {
      for (let i = newInputFuncs.length; i < numFuncs; i++) {
        newInputFuncs.push([]);
        for (let j = 0; j < numVars; j++) {
          newInputFuncs[i].push(0);
        }
      }
    } else if (inputFuncs.length > numFuncs) {
      for (let i = newInputFuncs.length; i > numFuncs; i--) {
        newInputFuncs.pop();
      }
    }

    setInputFuncs(newInputFuncs);
  }, [numFuncs]);

  // useEffect(() => {
  //   let newOptions = [];
  //   for (let i = 0; i < props.L[0].length; i++) {
  //     newOptions.push({ value: i, label: "Node " + (i + 1) });
  //   }
  //   setNodeOptions(newOptions);
  // }, []);

  return (
    <div>
       <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button>
      <Modal size='xl' backdrop='static' dialogclassName='modifiedModal'show={showModal} onHide={handleClose}>
      <ModalHeader closeButton>Create New Neuron</ModalHeader>
      <ModalBody>
      <div>
        <h2>Variables</h2>
        <div className="sliders">
          <label>Number of Variables:</label>
          <Slider track="normal"color='secondary' min={1} defaultValue={1} aria-label="Default" valueLabelDisplay="on" 
          onChangeCommitted={(e,v) => {
              // Set the number of variables to the value of the input
              console.log(v);
              setNumVars(parseInt(v));
            }}/>
        </div>
        <div className="vargrid">
          {Array.from(Array(numVars).keys()).map((i) => {
            return (
              <div>
                <label>Variable {i + 1}</label><br/>
                <input
                  type="number"
                  onChange={(e) => {
                    handleAddVars(i, parseInt(e.target.value));
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h2>Functions</h2>
        <div className="sliders">
          <label>Number of Functions</label>
          
        <Slider color='secondary' min={1} defaultValue={1} aria-label="Default" valueLabelDisplay="on" 
          onChangeCommitted={(e,v) => {
              // Set the number of variables to the value of the input
              console.log(v);
              setNumFuncs(parseInt(v));
            }}/>
        </div>
        <div>
          <div>
            {/* // Add a function selector based on the number of variables the neuron has */}

            <table>
              
              <tbody>
                {Array.from(Array(numFuncs).keys()).map((i) => {
                  return (
                    <tr>
                      <th>
                        <label className="h4">Function {i + 1}</label>
                      </th>
                      {Array.from(Array(numVars).keys()).map((j) => {
                        return (
                          <td>
                            <input
                              type="number"
                              onChange={(e) => {
                                handleAddFuncs(i, j, parseInt(e.target.value));
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h2>Connections</h2>
        <div>
          <label>Outgoing Connections</label>

          <Select
            options={nodeOptions}
            isMulti={true}
            onChange={(e) => {
              handleAddSynOut(e);
            }}
          />
        </div>
        <div>
          <label>Incoming Connections</label>
          <Select
            options={nodeOptions}
            isMulti={true}
            onChange={(e) => {
              handleAddSynIn(e);
            }}
          />
        </div>
      </div>
      <button onClick={addNewNeuron}>Add Neuron</button>
      </ModalBody>
      </Modal>
    </div>
  );
}

export default NewNodeForm;
