import { vec2 } from 'gl-matrix';

import { Texture } from './Texture';

export class CanvasTexture extends Texture {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  constructor(gl: WebGLRenderingContext, width: number, height = width) {
    super(gl, width, height);

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  resize(width: number, height = width) {
    vec2.set(this.size, width, height);
    vec2.set(this.halfSize, width / 2, height / 2);
    vec2.set(this.inverseSize, 1 / width, 1 / height);

    this.canvas.width = width;
    this.canvas.height = height;

    this.update();
  }

  update() {
    this.bindTexture();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.canvas);
  }
}