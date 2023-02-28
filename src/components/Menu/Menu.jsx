import React from "react";
import { slide as BMenu } from "react-burger-menu";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  Alert,
  Form,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Save2, ClockHistory } from "react-bootstrap-icons";
import convert from "xml-js";
import { saveAs } from "file-saver";

var options = {
  compact: true,
  ignoreComment: true,
  spaces: 4,
  sanitize: false,
};
function Menu(props) {
  const [fileName, setFileName] = useState("");
  const handleSideBarMenu = () => {
    props.setShowSideBarMenu(props.showSideBarMenu ? false : true);
  };
  const handleSave = () => {
    //Convert JSON Array to string.
    var wrapper = { content: props.neurons };
    //console.log(neurons);
    var result = convert.json2xml(wrapper, options);
    //console.log(wrapper);
    var blob = new Blob([result], { type: "text/xml;charset=utf-8" });
    saveAs(blob, Date().toString() + "-Neurons.xmp");
    props.setPristine();
  };
  const handleLoad = (input) => {
    let file = input.files[0];
    props.setHasEnded(false);

    if (file.type && file.type.indexOf("text/xml") === -1) {
      props.showError("File is not a xml file");
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
      await props.setNeurons((draft) => (draft = result.content));
      await props.setNeurons((draft) => {
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
    props.setTime(0);
  };

  return (
    <BMenu
      id="side-bar-menu"
      isOpen={props.showSideBarMenu}
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
          disabled={props.time > 0 ? true : false}
          onClick={handleSave}
        >
          <Save2 /> Save
        </Button>
      </div>
      <div>
        <Button
          id="choice-history-btn"
          variant="primary"
          onClick={props.handleShowChoiceHistoryModal}
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
          onClick={props.handleTrueRestartTutorial}
        >
          Restart Tutorial
        </Button>
      </div>
      <div>
        <Form>
          <Form.Check
            type="checkbox"
            label="Display details when hovering"
            defaultChecked={props.isHover}
            onChange={() => {
              props.isHover = !props.isHover;
            }}
          />
        </Form>
      </div>
    </BMenu>
  );
}

export default Menu;
