import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import MatrixCanvas from "../../components/matrix/MatrixCanvas";

test("MatrixCanvas exposes an accessible visualizer", () => {
  const element = createElement(MatrixCanvas, { points: [{ id: "a", label: "A", x: 10, y: 10, balance: 20 }] });
  assert.equal(element.type, MatrixCanvas);
  assert.equal(element.props.points.length, 1);
});
