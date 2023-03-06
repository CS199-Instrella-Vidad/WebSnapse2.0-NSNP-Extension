import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import {
  ArrowCounterclockwise,
  PlusSquare,
  XCircle,
  PencilSquare,
  BoxArrowRight,
  BoxArrowInRight,
} from "react-bootstrap-icons";

function ComputingControls(props) {
  return (
    <div>
      <Row>
        <Col sm={8}>
          <Button
            variant="outline-dark"
            size="md"
            id="new-node-btn"
            className="node-actions text-primary"
            onClick={props.handleShow}
            style={{ textAlign: "center", marginRight: "0.3em" }}
            disabled={props.time > 0 ? true : false}
          >
            <PlusSquare /> New Node
          </Button>
          <Button
            variant="outline-dark"
            size="md"
            id="new-input-btn"
            className="node-actions text-primary"
            onClick={props.handleShowNewInputModal}
            style={{ textAlign: "center", marginRight: "0.3em" }}
            disabled={props.time > 0 ? true : false}
          >
            <BoxArrowInRight /> New Input Node
          </Button>
          <Button
            variant="outline-dark"
            size="md"
            id="new-output-btn"
            className="node-actions text-primary"
            onClick={props.handleShowNewOutputModal}
            style={{ textAlign: "center", marginRight: "0.3em" }}
            disabled={props.time > 0 ? true : false}
          >
            <BoxArrowRight /> New Output Node
          </Button>
          <Button
            variant="outline-primary"
            size="md"
            id="del-node-btn"
            className="node-actions text-danger"
            onClick={props.handleShowDeleteModal}
            style={{ textAlign: "center", marginRight: "0.3em" }}
            disabled={props.time > 0 ? true : false}
          >
            <XCircle /> Delete Node
          </Button>
          <Button
            variant="outline-primary"
            size="md"
            id="edit-node-btn"
            className="node-actions text-success"
            onClick={props.handleShowEditModal}
            style={{ textAlign: "center", marginRight: "0.3em" }}
            disabled={props.time > 0 ? true : false}
          >
            <PencilSquare /> Edit Regular Node
          </Button>

          <Button
            variant="outline-primary"
            size="md"
            id="edit-inp-node-btn"
            className="node-actions text-success"
            onClick={props.handleShowEditInputModal}
            style={{ textAlign: "center", marginRight: "0.3em" }}
            disabled={props.time > 0 ? true : false}
          >
            <PencilSquare /> Edit Input Node
          </Button>
        </Col>
        <Col sm={4} style={{ textAlign: "right" }}>
          <Button
            id="res-btn"
            variant="danger"
            onClick={props.handleReset}
            style={{ textAlign: "center", marginTop: "0.4em" }}
          >
            <ArrowCounterclockwise /> Restart Simulation
          </Button>{" "}
        </Col>
      </Row>
    </div>
  );
}

export default ComputingControls;
