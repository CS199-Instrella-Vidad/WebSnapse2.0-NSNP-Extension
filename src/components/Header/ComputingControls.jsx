import React from "react";

function ComputingControls([props]) {
  return (
    <div>
      <Row>
        <Col sm={8}>
          <Button
            variant="outline-dark"
            size="md"
            id="new-node-btn"
            className="node-actions text-primary"
            onClick={handleShow}
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
            onClick={handleShowNewInputModal}
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
            onClick={handleShowNewOutputModal}
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
            onClick={handleShowDeleteModal}
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
            onClick={handleShowEditModal}
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
            onClick={handleShowEditInputModal}
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
            onClick={handleReset}
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
