import "../../scss/custom.scss";
import "./SNP.css";
import { slide as Menu } from "react-burger-menu";
import { useState, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import {
  Button,
  Container,
  Alert,
  Form,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { ClockHistory, Save2 } from "react-bootstrap-icons";
import Snapse from "../../components/Snapse/Snapse";
import { step, backStep, parseRule, null_step } from "../../utils/automata";
import ElementPopUp from "../../components/forms/ElementPopUp";
import ChooseRuleForm from "../../components/forms/ChooseRuleForm";
import NewNodeForm from "../../components/forms/NewNodeForm";
import AddSynapseWeightForm from "../../components/forms/AddSynapseWeightForm";
import NewOutputNodeForm from "../../components/forms/NewOutputNodeForm";
import NewInputNodeForm from "../../components/forms/NewInputNodeForm";
import EditNodeForm from "../../components/forms/EditNodeForm";
import EditInputNodeForm from "../../components/forms/EditInputNodeForm";
import EditSynapseForm from "../../components/forms/EditSynapseForm";
import DeleteNodeForm from "../../components/forms/DeleteNodeForm";
import DeleteAllForm from "../../components/forms/DeleteAllForm";
import DeleteSynapseForm from "../../components/forms/DeleteSynapseForm";

import ChoiceHistory from "../../components/ChoiceHistory/ChoiceHistory";
import convert from "xml-js";
import { saveAs } from "file-saver";
import useUnsavedChanges from "../../components/useUnsavedChanges/useUnsavedChanges";
import MainHeader from "../../components/Header/Header";
import ComputingControls from "../../components/Header/ComputingControls";
import Tour from "../../components/Tour/Tour";

var options = {
  compact: true,
  ignoreComment: true,
  spaces: 4,
  sanitize: false,
};
var isClickedSynapse = false;
var isHover = true;
var srcDel = "";
var dstDel = "";

function useKey(key, cb) {
  const isFocus = useRef(false);
  const callbackRef = useRef(cb);

  const inputs = document.getElementsByTagName("input");

  // if user is typing in input elements, isFocus = true, and keybinds should not work
  useEffect(() => {
    for (let input of inputs) {
      input.addEventListener("focusin", () => {
        isFocus.current = true;
        console.log("fOCUS ON ME");
      });
      input.addEventListener("input", () => {
        isFocus.current = true;
        console.log("fOCUS ON ME 2");
      });
      input.addEventListener(
        "focus",
        () => {
          isFocus.current = true;
          console.log("fOCUS ON ME 3");
        },
        true
      );
      input.addEventListener("focusout", () => {
        isFocus.current = false;
      });
    }
  });

  useEffect(() => {
    callbackRef.current = cb;
  });
  useEffect(() => {
    function debounced(delay, fn) {
      let timerId;
      return function (...args) {
        if (timerId) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
          fn(...args);
          timerId = null;
        }, delay);
      };
    }

    function handleKeyDown(event) {
      console.log(`isFocus ${isFocus.current}`);
      if (event.code === key && isFocus.current == false) {
        console.log(`handleKeyDown isFocus: ${isFocus.current}`);
        //event.preventDefault();
        console.log("Key pressed: " + event.code);
        callbackRef.current(event);
      }
    }

    document.addEventListener("keydown", (event) => {
      if (event.code === "Space" && isFocus == false) {
        event.preventDefault();
      }
    });
    document.addEventListener("keydown", debounced(300, handleKeyDown));
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key]);
}

function SNP() {
  const [neurons, setNeurons] = useImmer(
    window.localStorage.getItem("originalNeurons") != null
      ? JSON.parse(window.localStorage.getItem("originalNeurons"))
      : {
          n1: {
            id: "n1",
            position: { x: 50, y: 50 },
            rules: "a+/a->a;2",
            startingSpikes: 1,
            delay: 0,
            spikes: 1,
            isOutput: false,
            isInput: false,
            out: ["n2"],
            outWeights: { n2: 1 },
          },
          n2: {
            id: "n2",
            position: { x: 200, y: 50 },
            rules: "a/a->a;1",
            startingSpikes: 0,
            delay: 0,
            spikes: 0,
            isOutput: false,
            isInput: false,
            out: ["n3"],
            outWeights: { n3: 1 },
          },
          n3: {
            id: "n3",
            position: { x: 400, y: 50 },
            rules: "a/a->a;0",
            startingSpikes: 1,
            delay: 0,
            spikes: 1,
            isOutput: false,
            isInput: false,
            out: ["n4"],
            outWeights: { n4: 1 },
          },
          n4: {
            id: "n4",
            position: { x: 400, y: 200 },
            isOutput: true,
            isInput: false,
            spikes: 0,
            bitstring: " ",
          },
        }
  );

  // States

  const [srce, setSrce] = useState("");
  const [dest, setDest] = useState("");
  const [time, setTime] = useState(0);
  const [nodeID, setNeuronID] = useState("");
  const [nodeType, setNeuronType] = useState("");
  const [nodeSRules, setNeuronSRules] = useState("");
  const [nodeFRules, setNeuronFRules] = useState("");
  const [nodeSpikes, setNeuronSpikes] = useState("");
  const [nodeBitstring, setNeuronBitstring] = useState("");
  const [weight_main, setWeight] = useState(1);
  const [isPressedDel, setIsPressedDel] = useState(false);
  const [isRandom, setIsRandom] = useState(true);
  const [fileName, setFileName] = useState("");
  const [Prompt, setDirty, setPristine] = useUnsavedChanges();
  // Modal Booleans
  const [showElementPopup, setShowElementPopup] = useState(false);
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [showNewNodeModal, setShowNewNodeModal] = useState(false);
  const [showNewOutputModal, setShowNewOutputModal] = useState(false);
  const [showNewInputModal, setShowNewInputModal] = useState(false);
  const [showChooseRuleModal, setShowChooseRuleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditInputModal, setShowEditInputModal] = useState(false);
  const [showEditSynapseModal, setShowEditSynapseModal] = useState(false);
  const [showChoiceHistoryModal, setShowChoiceHistoryModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSynapseModal, setShowDeleteSynapseModal] = useState(false);
  // Menu Booleans
  const [showDropdownBasic, setShowDropdownBasic] = useState(false);
  const [showSideBarMenu, setShowSideBarMenu] = useState(false);
  // Simulation Booleans
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [error, setError] = useState("");
  const [pBar, setPBar] = useState(0);
  const headless = process.env.NODE_ENV === "test";
  const [sld_value, setSldValue] = useState(1);

  const handleSldOver = () => console.log("slide over");
  const handleClose = () => setShowNewNodeModal(false);
  const handleShow = () => setShowNewNodeModal(true);
  const handleCloseElementPopup = () => setShowElementPopup(false);
  const handleShowElementPopup = () => setShowElementPopup(true);
  const handleCloseAddWeightModal = () => setShowAddWeightModal(false);
  const handleShowAddWeightModal = () => setShowAddWeightModal(true);
  const handleCloseNewOutputModal = () => setShowNewOutputModal(false);
  const handleShowNewOutputModal = () => setShowNewOutputModal(true);
  const handleCloseNewInputModal = () => setShowNewInputModal(false);
  const handleShowNewInputModal = () => setShowNewInputModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditInputModal = () => setShowEditInputModal(true);
  const handleCloseEditInputModal = () => setShowEditInputModal(false);
  const handleCloseEditSynapseModal = () => setShowEditSynapseModal(false);
  const handleShowEditSynapseModal = () => setShowEditSynapseModal(true);
  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseDeleteAllModal = () => setShowDeleteAllModal(false);
  const handleShowDeleteAllModal = () => setShowDeleteAllModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteSynapseModal = () => setShowDeleteSynapseModal(false);
  const handleShowDeleteSynapseModal = () => {
    console.log("SHOW DELSYN");
    setShowDeleteSynapseModal(true);
  };
  const handleCloseChooseRuleModal = () => setShowChooseRuleModal(false);

  const [mode, setMode] = useState("PSEUDORANDOM");

  const handleSelect = (e) => {
    console.log(e);
    setMode(e);
  };

  // Menu Handles
  const handleShowDropdownBasic = () => setShowDropdownBasic(true);
  const handleCloseDropdownBasic = () => setShowDropdownBasic(false);
  const handleDropDownBasic = () => {
    setShowDropdownBasic(showDropdownBasic ? false : true);
  };
  const handleShowSideBarMenu = () => setShowSideBarMenu(true);
  const handleCloseSideBarMenu = () => setShowSideBarMenu(false);
  const handleSideBarMenu = () => {
    setShowSideBarMenu(showSideBarMenu ? false : true);
  };

  const [restartTutorial, setRestartTutorial] = useState(false);
  const handleTrueRestartTutorial = () => setRestartTutorial(true);
  const handleFalseRestartTutorial = () => setRestartTutorial(false);

  const handleShowChoiceHistoryModal = () => {
    setShowChoiceHistoryModal(true);
    setShowSideBarMenu(false);
  };
  const handleCloseHoiceHistoryModal = () => setShowChoiceHistoryModal(false);

  const handleSimulationEnd = () => {
    setHasEnded(true);
    setIsPlaying(false);
    console.log("alert from simulationEnd");
    alert("Simulation has ended.");
  };

  const showError = (text) => {
    setError(text);
    setTimeout(() => {
      setError("");
    }, 3000);
  };
  const handleSave = () => {
    //Convert JSON Array to string.
    var wrapper = { content: neurons };
    //console.log(neurons);
    var result = convert.json2xml(wrapper, options);
    //console.log(wrapper);
    var blob = new Blob([result], { type: "text/xml;charset=utf-8" });
    saveAs(blob, Date().toString() + "-Neurons.xmp");
    setPristine();
  };
  const handleLoad = (input) => {
    let file = input.files[0];
    setHasEnded(false);

    if (file.type && file.type.indexOf("text/xml") === -1) {
      showError("File is not a xml file");
      return;
    }
    const reader = new FileReader();
    function nativeType(value) {
      var nValue = Number(value);
      if (!isNaN(nValue)) {
        return nValue;
      }
      var bValue = value.toLowerCase();
      if (bValue === "true") {
        return true;
      } else if (bValue === "false") {
        return false;
      }
      return value;
    }
    var removeJsonTextAttribute = async function (value, parentElement) {
      try {
        const pOpKeys = Object.keys(parentElement._parent);
        const keyNo = pOpKeys.length;
        const keyName = pOpKeys[keyNo - 1];
        const arrOfKey = parentElement._parent[keyName];
        const arrOfKeyLen = arrOfKey.length;

        if (arrOfKeyLen > 0) {
          const arr = arrOfKey;
          const arrIndex = arrOfKey.length - 1;
          arr[arrIndex] = value;
        } else if (keyName == "out") {
          parentElement._parent[keyName] = [value];
        } else if (keyName == "bitstring") {
          parentElement._parent[keyName] = value;
        } else {
          parentElement._parent[keyName] = nativeType(value);
        }
      } catch (e) {}
    };
    reader.addEventListener("load", async (event) => {
      var options = {
        compact: true,
        trim: true,
        ignoreDeclaration: true,
        ignoreInstruction: true,
        ignoreAttributes: true,
        ignoreComment: true,
        ignoreCdata: true,
        ignoreDoctype: true,
        textFn: removeJsonTextAttribute,
      };
      var result = await convert.xml2js(event.target.result, options);
      await setNeurons((draft) => (draft = result.content));
      await setNeurons((draft) => {
        for (var k in draft) {
          if (draft[k].bitstring) {
            // console.log("loaded string", draft[k].bitstring);
            // draft[k].bitstring = " ";
          }
          if (!draft[k].isOutput && !draft[k].out) {
            draft[k].out = [];
          }
        }
      });
      window.localStorage.setItem(
        "originalNeurons",
        JSON.stringify(result.content)
      );
      setFileName(file.name);
    });
    reader.readAsText(file);
    setTime(0);
  };

  /// add weight argument
  /// make array of objects (neuron ID, weight)
  const onEdgeCreate = (src, dst) => {
    setSrce(src); // srce = src
    setDest(dst); // dest = dst
    console.log("newEdge", src, dst);

    setNeurons((draft) => {
      var outCopy = [...draft[src].out];
      var weightsDict = { ...draft[src].outWeights };
      var currWeight = parseInt(weightsDict[dst]);

      if (outCopy.includes(dst)) {
        handleAddWeight(src, dst, currWeight + 1, 1);
      } else {
        handleShowAddWeightModal();

        // outCopy.push(dst)
        // console.log(outCopy);
        // draft[src].out = outCopy;
      }
    });

    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );
  };

  async function handleEditSynapse(src_id, dst_id, new_weight) {
    await setNeurons((draft) => {
      console.log("NEW WEIGHT", new_weight);

      var weightsDict = { ...draft[src_id].outWeights };
      weightsDict[dst_id] = new_weight;
      draft[src_id].outWeights = weightsDict;
    });
    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );
    handleNullForward();
  }

  async function handleDeleteSynapse(srcID, dstID) {
    await setNeurons((draft) => {
      var origoutArr = [...draft[srcID].out];
      // console.log("OLD OUT DETAILS ", origoutArr);

      var weightsDict = { ...draft[srcID].outWeights };
      // console.log("WEIGHTS DETAILS", weightsDict);

      if (weightsDict[dstID] > 1) {
        draft[srcID].outWeights[dstID] = weightsDict[dstID] - 1;
      } else {
        // remove dstID in out
        let arr = draft[srcID].out.filter(function (item) {
          return item !== dstID;
        });
        draft[srcID].out = arr;

        // remove dstID in outWeights
        delete draft[srcID].outWeights[dstID];
      }

      var newoutArr = [...draft[srcID].out];
      console.log("NEW OUT DETAILS ", newoutArr);

      var newweightsDict = { ...draft[srcID].outWeights };
      console.log("WEIGHTS DETAILS", newweightsDict);

      console.log("DELETED SYNAPSE");
    });
    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );

    handleNullForward();
  }

  async function handleAddWeight(src, dst, weight, flag) {
    await setNeurons((draft) => {
      var weightsDict = { ...draft[src].outWeights };
      weightsDict[dst] = weight;
      draft[src].outWeights = weightsDict;
      console.log("WEIGHTS", weightsDict);

      if (flag == 0) {
        console.log("FLAG IS ZERO");
        var outCopy = [...draft[src].out];
        outCopy.push(dst);
        draft[src].out = outCopy;
      }
    });
    setSrce("");
    setDest("");
    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );

    handleNullForward();
  }

  const handleNewPosition = async (position, id) => {
    setNeurons((draft) => {
      draft[id].position = position;
    });
    setDirty(true);
    handleNullForward();
  };

  async function handleNewNode(newNeuron) {
    await setNeurons((draft) => {
      draft[newNeuron.id] = newNeuron;
    });
    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );
    handleNullForward();
  }
  async function handleNewOutput(newOutput) {
    await setNeurons((draft) => {
      draft[newOutput.id] = newOutput;
    });
    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );
    handleNullForward();
  }

  async function handleNewInput(newInput) {
    await setNeurons((draft) => {
      draft[newInput.id] = newInput;
    });
    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );
    handleNullForward();
  }

  async function handleShowDeleteAll() {
    handleShowDeleteAllModal();
  }

  async function handleEditNode(id, rules, spikes) {
    //console.log("handleEditNode")
    await setNeurons((draft) => {
      draft[id].startingSpikes = spikes;
      draft[id].spikes = spikes;
      draft[id].rules = rules;
    });
    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );
    handleNullForward();
  }

  async function handleEditInputNode(id, bitstring) {
    //console.log("handleEditNode")
    await setNeurons((draft) => {
      draft[id].bitstring = bitstring;
    });
    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );
    handleNullForward();
  }

  /// list all neurons connected to a neuron (delete ID to delete connected synapse)
  async function handleDeleteNode(neuronId) {
    console.log("handleDeleteNode", neuronId);
    await setNeurons((draft) => {
      for (var k in draft) {
        //first delete edges connected to neuron
        var neuron = draft[k];
        if (!neuron.isOutput && neuron.out) {
          //const neuronOutKeys = neuron.out;
          let arr = neuron.out.filter(function (item) {
            return item !== neuronId;
          });
          draft[k].out = arr;
        }
      }
      //delete neuron
      delete draft[neuronId];
    });

    setDirty(true);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );
    handleNullForward();
  }

  async function handleDeleteAll() {
    setNeurons((draft) => {
      for (var k in draft) {
        delete draft[k];
      }
    });
    setDirty(true);
    console.log("ALL DELETED", neurons);
    window.localStorage.setItem(
      "originalNeurons",
      JSON.stringify(JSON.parse(JSON.stringify(neurons)))
    );
    handleNullForward();
  }

  function setIsClickedSynapse(click_flag, srcID, dstID) {
    isClickedSynapse = click_flag;
    srcDel = srcID;
    dstDel = dstID;
    let curr_weight;

    if (isClickedSynapse) {
      setNeurons((draft) => {
        let weightsDict = { ...draft[srcID].outWeights };
        curr_weight = parseInt(weightsDict[dstID]);
      });

      setWeight(curr_weight);
    }
  }

  const handleReset = () => {
    if (time != 0) {
      var currNeurons = JSON.parse(
        window.localStorage.getItem("originalNeurons")
      );

      for (var k in currNeurons) {
        var neuron = currNeurons[k];
        if (!neuron.isOutput && !neuron.isInput) {
          delete currNeurons[neuron.id].chosenRule;
          delete currNeurons[neuron.id].currentRule;
        }
      }
      window.localStorage.setItem(
        "originalNeurons",
        JSON.stringify(currNeurons)
      );

      setNeurons(
        (draft) =>
          (draft = JSON.parse(window.localStorage.getItem("originalNeurons")))
      );
      setTime(0);
      setIsPlaying(false);
      setHasEnded(false);
      var tempNeurons = window.localStorage.getItem("originalNeurons");

      window.localStorage.clear();
      window.localStorage.setItem("originalNeurons", tempNeurons);
    }
  };

  const [guidedRules, setGuidedRules] = useState({});
  const handleStartGuidedMode = async (rules) => {
    await setGuidedRules(rules);
    setShowChooseRuleModal(true);
    if (setShowChooseRuleModal) {
      setIsPlaying(false); //pauses the graph playing while choosing rule
    }
  };
  const handleChosenRules = (data) => {
    handleCloseChooseRuleModal();
    setNeurons((draft) => {
      for (var j in draft) {
        for (var k in data) {
          if (j == k) {
            var [requires, grouped, symbol, consumes, produces, delay] =
              parseRule(data[k]);
            draft[j].delay = delay;
            //console.log(data[k]);
            draft[j].currentRule = data[k];
            draft[j].chosenRule = data[k];
          }
        }
      }
    });
    //setIsPlaying(true); // continue playing after choosing rule
  };

  const onForward = async () => {
    if (time == 0) {
      //copy
      console.log("FORWARD");
      console.log("Time is: " + time);
      window.localStorage.setItem(
        "originalNeurons",
        JSON.stringify(JSON.parse(JSON.stringify(neurons)))
      );
      window.localStorage.setItem("shouldTimeStep", "1");
      console.log(
        "Original neurons on time = 1 ",
        window.localStorage.getItem("originalNeurons")
      );
    }
    if (!hasEnded) {
      console.log("Time is: " + time);
      await setNeurons((neurons) =>
        step(
          neurons,
          time,
          isRandom,
          handleStartGuidedMode,
          handleSimulationEnd
        )
      );
      if (window.localStorage.getItem("shouldTimeStep") == "1") {
        setTime((time) => time + 1);
      }
      console.log(
        `Local storage space used: ${JSON.stringify(localStorage).length * 2}`
      );
    } else {
      alert("Simulation has ended.");
    }
  };

  const onBackward = async () => {
    if (time > 1) {
      var tempTime = time.valueOf();
      setHasEnded(false);
      await setNeurons((neurons) => backStep(tempTime - 2));
      await setTime((time) => time - 1);
    } else if (time == 1) {
      handleReset();
    }
  };
  const neuronsRef = useRef(neurons);
  neuronsRef.current = neurons;
  const onIntervalStepRef = useRef(onForward);
  onIntervalStepRef.current = () => {
    onForward();
    setPBar((p) => p + 1);
  };

  useEffect(() => {
    if (showChooseRuleModal) {
      console.log("showChooseRuleModal is true");
    }
  }, []);

  // Key Bindings
  function handleSpace() {
    console.log("Space Pressed");
    setIsPlaying((p) => !p);
  }

  function handleRightKey() {
    console.log("Right Key Pressed");
    if (!hasEnded) {
      onIntervalStepRef.current();
    }
  }

  function handleLeftKey() {
    console.log("Left Key Pressed");
    onBackward();
  }

  function handleDelBackspaceKey() {
    if (isClickedSynapse) {
      handleDeleteSynapse(srcDel, dstDel);
    } else {
      console.log("No edge clicked.");
    }
    console.log("Delete/Bspace Pressed");
  }

  useKey("Space", handleSpace);
  useKey("ArrowLeft", handleLeftKey);
  useKey("ArrowRight", handleRightKey);
  useKey("Delete", handleDelBackspaceKey);
  useKey("Backspace", handleDelBackspaceKey);

  /// handle backspace key for deleting neurons/synapses
  function splitRules(rules) {
    const testRe =
      /([0-9]*)a\(*([0-9]*)(a*)\)*(\+?|\*?)\/([0-9]*)a->([0-9]*)a;([0-9]+)/;
    const forgetRe = /([0-9]*)a\(*([0-9]*)(a*)\)*(\+?|\*?)\/([0-9]*)a->(0);(0)/;

    var spikeRules = [];
    var forgRules = [];

    var splitRules = rules.split(" ");
    for (var i = 0; i < splitRules.length; i++) {
      var testRes = testRe.exec(splitRules[i]);
      var forgetRes = forgetRe.exec(splitRules[i]);

      if (testRes) {
        spikeRules.push(splitRules[i]);
      } else if (forgetRes) {
        forgRules.push(splitRules[i]);
      }
    }

    return [spikeRules, forgRules];
  }

  function checkIsHover() {
    //await setIsHover(isHover);
    console.log("isHover is", isHover);
    return isHover;
  }

  function handleNullForward() {
    document.getElementById("forwardBtn").click();
  }

  return (
    <>
      {/* <Tour
        handleShowDropdownBasic={handleShowDropdownBasic}
        handleCloseDropdownBasic={handleCloseDropdownBasic}
        handleShowSideBarMenu={handleShowSideBarMenu}
        handleCloseSideBarMenu={handleCloseSideBarMenu}
        restartTutorial={restartTutorial}
        handleFalseRestartTutorial={handleFalseRestartTutorial}
      /> */}
      <Container>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Hamburger Side Menu */}
        <Menu
          id="side-bar-menu"
          isOpen={showSideBarMenu}
          onClick={handleSideBarMenu}
          disableCloseOnEsc
          disableOverlayClick
          noOverlay
        >
          <Form>
            <Form.File
              id="custom-file"
              label={fileName ? fileName : "Load file..."}
              custom
              onChange={(e) => {
                handleLoad(e.target);
              }}
            />
          </Form>
          <div>
            <Button
              id="save-btn"
              variant="primary"
              disabled={time > 0 ? true : false}
              onClick={handleSave}
            >
              <Save2 /> Save
            </Button>
          </div>
          <div>
            <Button
              id="choice-history-btn"
              variant="primary"
              onClick={handleShowChoiceHistoryModal}
            >
              <ClockHistory /> Choice History
            </Button>
          </div>
          <div>
            <DropdownButton id="file-dropdown" title="Download samples">
              <Dropdown.Item href="./samples/ex1 - 3k+3 spiker.xmp" download>
                Ex1 - 3k+3 Spiker
              </Dropdown.Item>
              <Dropdown.Item href="./samples/ex2 - bitadder.xmp" download>
                Ex2 - Bitadder
              </Dropdown.Item>
              <Dropdown.Item
                href="./samples/ex3 - increasing comparator.xmp"
                download
              >
                Ex3 - Increasing Comparator
              </Dropdown.Item>
              <Dropdown.Item href="./samples/ex4 - naturally even.xmp" download>
                Ex4 - Naturally Even
              </Dropdown.Item>
              <Dropdown.Item
                href="./samples/ex5 - naturally greater one.xmp"
                download
              >
                Ex5 - Naturally Greater Than One
              </Dropdown.Item>
            </DropdownButton>
          </div>
          <div>
            <Button
              id="restart-tour"
              variant="primary"
              onClick={handleTrueRestartTutorial}
            >
              Restart Tutorial
            </Button>
          </div>
          <div>
            <Form>
              <Form.Check
                type="checkbox"
                label="Display details when hovering"
                defaultChecked={isHover}
                onChange={() => {
                  isHover = !isHover;
                }}
              />
            </Form>
          </div>
        </Menu>

        {/* Main App Header */}
        <MainHeader
          setMode={setMode}
          mode={mode}
          setIsRandom={setIsRandom}
          time={time}
          setTime={setTime}
          onBackward={onBackward}
          onForward={onForward}
          pBar={pBar}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          hasEnded={hasEnded}
          neurons={neurons}
          onIntervalStepRef={onIntervalStepRef}
          sld_value={sld_value}
          setSldValue={setSldValue}
        />
        <ComputingControls
          handleShow={handleShow}
          handleShowNewInputModal={handleShowNewInputModal}
          handleShowNewOutputModal={handleShowNewOutputModal}
          handleShowDeleteModal={handleShowDeleteModal}
          handleShowEditModal={handleShowEditModal}
          handleShowEditInputModal={handleShowEditInputModal}
          handleReset={handleReset}
        />

        <hr />
        <Snapse
          neurons={neurons}
          onEdgeCreate={(src, dst, addedEles) => {
            onEdgeCreate(src.id(), dst.id());
            addedEles.remove();
          }}
          handleChangePosition={handleNewPosition}
          handleDeleteSynapse={handleDeleteSynapse}
          setIsClickedSynapse={setIsClickedSynapse}
          handleShowDeleteAll={handleShowDeleteAll}
          headless={headless}
          setNeurons={setNeurons}
          splitRules={splitRules}
          checkIsHover={checkIsHover}
          handleShowEditSynapseModal={handleShowEditSynapseModal}
          handleShowDeleteSynapseModal={handleShowDeleteSynapseModal}
          time={time}
        />

        {/* Pop-ups Windows: Modals, Etc */}
        <ChoiceHistory
          time={time}
          showChoiceHistoryModal={showChoiceHistoryModal}
          handleCloseHoiceHistoryModal={handleCloseHoiceHistoryModal}
        />
        <ElementPopUp
          showElementPopup={showElementPopup}
          handleCloseElementPopup={handleCloseElementPopup}
          handleError={showError}
          nodeID={nodeID}
          nodeType={nodeType}
          nodeSRules={nodeSRules}
          nodeFRules={nodeFRules}
          nodeSpikes={nodeSpikes}
          nodeBitstring={nodeBitstring}
        />
        <AddSynapseWeightForm
          showAddWeightModal={showAddWeightModal}
          handleCloseAddWeightModal={handleCloseAddWeightModal}
          handleAddWeight={handleAddWeight}
          handleError={showError}
          srce={srce}
          dest={dest}
        />
        <NewNodeForm
          showNewNodeModal={showNewNodeModal}
          handleCloseModal={handleClose}
          handleNewNode={handleNewNode}
          handleError={showError}
        />
        <NewOutputNodeForm
          showNewOutputModal={showNewOutputModal}
          handleCloseNewOutputModal={handleCloseNewOutputModal}
          handleNewOutput={handleNewOutput}
          handleError={showError}
        />
        <NewInputNodeForm
          showNewInputModal={showNewInputModal}
          handleCloseNewInputModal={handleCloseNewInputModal}
          handleNewInput={handleNewInput}
          handleError={showError}
        />
        <EditNodeForm
          showEditModal={showEditModal}
          handleCloseEditModal={handleCloseEditModal}
          handleEditNode={handleEditNode}
          handleError={showError}
          neurons={neurons}
        />
        <EditInputNodeForm
          showEditInputModal={showEditInputModal}
          handleCloseEditInputModal={handleCloseEditInputModal}
          handleEditInputNode={handleEditInputNode}
          handleError={showError}
          neurons={neurons}
        />
        <EditSynapseForm
          showEditSynapseModal={showEditSynapseModal}
          handleCloseEditSynapseModal={handleCloseEditSynapseModal}
          handleEditSynapse={handleEditSynapse}
          handleError={showError}
          neurons={neurons}
          isClickedSynapse={isClickedSynapse}
          srcID={srcDel}
          dstID={dstDel}
          setWeight={setWeight}
          weight_main={weight_main}
          setNeurons={setNeurons}
          handleDeleteSynapse={handleDeleteSynapse}
        />
        <DeleteAllForm
          showDeleteAllModal={showDeleteAllModal}
          handleCloseDeleteAllModal={handleCloseDeleteAllModal}
          handleDeleteAll={handleDeleteAll}
          handleError={showError}
        />
        <DeleteNodeForm
          showDeleteModal={showDeleteModal}
          handleCloseDeleteModal={handleCloseDeleteModal}
          handleDeleteNode={handleDeleteNode}
          handleError={showError}
          neurons={neurons}
        />
        <DeleteSynapseForm
          showDeleteSynapseModal={showDeleteSynapseModal}
          handleCloseDeleteSynapseModal={handleCloseDeleteSynapseModal}
          handleDeleteSynapse={handleDeleteSynapse}
          handleError={showError}
          setNeurons={setNeurons}
          isClickedSynapse={isClickedSynapse}
          srcID={srcDel}
          dstID={dstDel}
        />
        <ChooseRuleForm
          showChooseRuleModal={showChooseRuleModal}
          handleCloseChooseRuleModal={handleCloseChooseRuleModal}
          rules={guidedRules}
          handleChosenRules={handleChosenRules}
        />
        {Prompt}
      </Container>
    </>
  );
}
export default SNP;
