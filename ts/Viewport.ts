import { FrameBuffer } from "./types";
import { AtomicBind } from "./AtomicBind";
import { AbstractBindlable } from "./AbstractBindable";

export class Viewport extends AbstractBindlable implements FrameBuffer {
  readonly gl: WebGLRenderingContext;
  width: number;
  height: number;
  readonly blend: boolean;
  constructor(gl: WebGLRenderingContext, atomicBind: AtomicBind, width: number, height: number, blend = false) {
    super(atomicBind);
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.blend = blend;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  clear(r = 0, g = 0, b = 0, a = 1) {
    this.bind();
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  _bind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.width, this.height);
    if (this.blend) {
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    } else {
      this.gl.disable(this.gl.BLEND);
    }
  }
}