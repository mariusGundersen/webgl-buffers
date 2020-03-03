import * as NdArray from 'ndarray';

import { VertexBuffer, FrameBuffer } from './types';
import { AtomicBind } from "./AtomicBind";
import AbstractBindlable from './AbstractBindable';

export interface Point {
  readonly x: number,
  readonly y: number,
  readonly s: number,
  readonly t: number
}

export default class PointList extends AbstractBindlable implements VertexBuffer {
  private readonly gl: WebGLRenderingContext;
  private size: number;
  private vertices: Float32Array;
  private readonly vertexBuffer: WebGLBuffer;
  private readonly indexBuffer: WebGLBuffer;
  private readonly map: NdArray;
  private count: number;
  constructor(gl: WebGLRenderingContext, atomicBind: AtomicBind) {
    super(atomicBind);
    this.gl = gl;
    this.size = 1;
    this.vertices = new Float32Array(this.size * 4);
    this.vertexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.indexBuffer = gl.createBuffer() || (() => { throw new Error("Could not make buffer") })();
    this.bind();
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(createPoints(this.size)), this.gl.STATIC_DRAW);
    this.map = NdArray(this.vertices, [this.size, 4]);
    this.count = 0;
  }

  set(points: Point[]) {
    if (points.length > this.size) {
      this.size = points.length;
      const old = this.vertices;
      this.vertices = new Float32Array(this.size * 4);
      this.vertices.set(old, 0);
      this.map.data = this.vertices;
    } else if (points.length < this.size) {
      this.size = points.length;
      this.vertices = new Float32Array(this.vertices.buffer, 0, this.size * 4);
      this.map.data = this.vertices;
    }

    this.count = 0;
    for (const { x, y, s, t } of points) {
      this.map.set(this.count, 0, x);
      this.map.set(this.count, 1, y);
      this.map.set(this.count, 2, s);
      this.map.set(this.count, 3, t);
      this.count++;
    }

    this.update();
  }

  _bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(0, 4, this.gl.FLOAT, false, 0, 0);
  }

  update() {
    this.bind();
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(createPoints(this.size)), this.gl.STATIC_DRAW);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
  }

  draw(output: FrameBuffer) {
    output.bind();
    this.bind();
    this.gl.drawElements(this.gl.POINTS, this.count, this.gl.UNSIGNED_SHORT, 0);
  }
}

export function* createPoints(size: number) {
  for (let i = 0; i < size; i++) {
    yield i;
  }
}