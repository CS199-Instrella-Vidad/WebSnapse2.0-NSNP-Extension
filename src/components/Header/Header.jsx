import React from "react";
import { useState, useEffect, useRef } from "react";

import Slider from "@mui/material/Slider";
import {
  Button,
  Container,
  Alert,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import {
  ArrowCounterclockwise,
  PlayFill,
  PauseFill,
  SkipForwardFill,
  SkipBackwardFill,
  QuestionCircle,
  ClockFill,
  ClockHistory,
  PlusSquare,
  Save2,
  Sliders,
  XCircle,
  PencilSquare,
  BoxArrowRight,
  BoxArrowInRight,
} from "react-bootstrap-icons";
import styled, { css, keyframes } from "styled-components";

var progBarRate = 3;

function MainHeader(props) {
  const [sld_value, setSldValue] = useState(1);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Pseudorandom mode will allow the system to decide which rule will be
      executed. Guided mode will let you be the one to decide.
    </Tooltip>
  );

  const handleSelect = (e) => {
    console.log(e);
    props.setMode(e);
  };

  const handlePlay = () => {
    if (!props.hasEnded) {
      props.setIsPlaying((p) => !p);
    } else {
      alert("Simulation has ended.");
    }
  };

  const onNullForward = async () => {
    if (props.time == 0) {
      //copy
      console.log("NULL_FORWARD");

      window.localStorage.setItem(
        "originalNeurons",
        JSON.stringify(JSON.parse(JSON.stringify(props.neurons)))
      );
    }
  };

  const handleSldChange = (event, newValue) => {
    if (props.isPlaying) {
      props.setIsPlaying(false);
    }
    setSldValue(newValue);
    var sim_spd = 3000 / newValue;
    progBarRate = sim_spd / 1000;
  };

  function resetSlider() {
    if (props.isPlaying) {
      props.setIsPlaying(false);
    }
    setSldValue(1);
  }

  useEffect(() => {
    var simu_speed = 3000 / sld_value;
    progBarRate = simu_speed / 1000;
    console.log("Simu speed", simu_speed);
    if (props.isPlaying) {
      var interval = setInterval(() => {
        props.onIntervalStepRef.current();
      }, simu_speed); /// simulation speed
    }
    return () => clearInterval(interval);
  }, [props.isPlaying, props.onIntervalStepRef]);

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontWeight: "700" }} className="websnapse-title">
          WebSnapse
        </h1>
      </div>

      <Row>
        <Col>
          <div>
            <Form>
              <Form.Group id="formGridCheckbox">
                <Row>
                  <Col sm={8}>
                    <div>
                      <DropdownButton
                        id="simu-mode"
                        title={"Simulation Mode: " + props.mode}
                        onSelect={handleSelect}
                      >
                        <Dropdown.Item
                          eventKey="GUIDED"
                          onClick={() => props.setIsRandom(false)}
                        >
                          GUIDED
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="PSEUDORANDOM"
                          onClick={() => props.setIsRandom(true)}
                        >
                          PSEUDORANDOM
                        </Dropdown.Item>
                      </DropdownButton>
                    </div>

                    {/* <Form.Check type="checkbox"
                              label="Pseudorandom Mode"
                              defaultChecked={isRandom}
                              onChange={() => {
                                setIsRandom(!isRandom)
                              }} /> */}
                  </Col>
                  {/* Question Mark Tooltip for Simulation Mode */}
                  <Col sm={8} style={{ textAlign: "left" }}>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <QuestionCircle />
                    </OverlayTrigger>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
            {props.time == 0 ? (
              <div></div>
            ) : (
              <div
                style={{
                  backgroundColor: "#778beb",
                  color: "white",
                  borderRadius: "10px",
                  padding: "0.5em",
                }}
              >
                <ClockFill color="white" size={30} /> <strong>Time:</strong>{" "}
                {props.time == 0 ? "Start playing!" : props.time}
              </div>
            )}
          </div>
        </Col>
        {/* Simulation Controls */}
        <Col>
          <div
            className="snapse-controls"
            style={{ textAlign: "center", marginBottom: "0.8em" }}
          >
            <Button variant="link" onClick={() => props.onBackward()}>
              <SkipBackwardFill />
            </Button>{" "}
            <div style={{ display: "inline-block" }}>
              <ProgressBar key={props.pBar} isPlaying={props.isPlaying} />
              <Button
                size="lg"
                className="snapse-controls-play"
                onClick={handlePlay}
              >
                {props.isPlaying ? <PauseFill /> : <PlayFill />}
              </Button>
            </div>{" "}
            <Button variant="link" onClick={() => props.onForward()}>
              <SkipForwardFill />
            </Button>{" "}
            <Button
              hidden={true}
              id="forwardBtn"
              variant="link"
              onClick={() => onNullForward()}
            >
              <SkipForwardFill />
            </Button>{" "}
          </div>
        </Col>

        {/* Speed Slider */}
        <Col style={{ textAlign: "right" }}>
          <div
            id="speed-slider"
            style={{
              backgroundColor: "#786fa6",
              borderRadius: "10px",
              padding: "0.5em",
            }}
          >
            <h6 className="slider-title" style={{ textAlign: "center" }}>
              <Sliders /> Simulation Speed
              <Button
                size="sm"
                variant="light"
                style={{ float: "right" }}
                onClick={resetSlider}
              >
                Reset to 1x
              </Button>{" "}
            </h6>

            <Slider
              aria-label="simuSpeed"
              color="secondary"
              min={0.1}
              max={3.0}
              step={0.1}
              defaultValue={1}
              value={sld_value}
              onChange={handleSldChange}
              valueLabelDisplay="auto"
              valueLabelFormat={sliderThumbLabelFormat}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
const shortening = keyframes`
from {
  transform: scaleX(100%);
}

to {
  transform: scaleX(0%);
}
`;

const ProgressBar = styled.div`
  ${(props) =>
    props.isPlaying &&
    css`
      animation: ${shortening} ${progBarRate}s linear;
    `}
  background-color: #c44569;
  height: 4px;
  transform-origin: left center;
  margin-bottom: 2px;
`;

function sliderThumbLabelFormat(value) {
  return `${value}x`;
}
export default MainHeader;
