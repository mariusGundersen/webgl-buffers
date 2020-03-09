import { vec2 } from 'gl-matrix';

import { TextureBuffer } from './types';

export interface TextureParameters {
  /**
   * default: 'LINEAR'
   */
  readonly MagnificationFilter?: 'LINEAR' | 'NEAREST'

  /**
   * default: 'NEAREST_MIPMAP_LINEAR'
   */
  readonly MinificationFilter?: 'LINEAR' | 'NEAREST' | 'NEAREST_MIPMAP_NEAREST' | 'LINEAR_MIPMAP_NEAREST' | 'NEAREST_MIPMAP_LINEAR' | 'LINEAR_MIPMAP_LINEAR'

  /**
   * default: 'REPEAT'
   */
  readonly WrapS?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT'

  /**
   * default: 'REPEAT'
   */
  readonly WrapT?: 'REPEAT' | 'CLAMP_TO_EDGE' | 'MIRRORED_REPEAT'
}

export class Texture implements TextureBuffer {
  readonly gl: WebGLRenderingContext;
  readonly texture: WebGLTexture;
  readonly size: vec2;
  readonly halfSize: vec2;
  readonly inverseSize: vec2;
  constructor(gl: WebGLRenderingContext, width = 0, height = width, parameters: TextureParameters = {}) {
    this.gl = gl;
    this.texture = gl.createTexture() || (() => { throw new Error("Could not make texture") })();

    this.size = vec2.fromValues(width, height);
    this.halfSize = vec2.fromValues(width / 2, height / 2);
    this.inverseSize = vec2.fromValues(1 / width, 1 / height);

    this.bindTexture();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl[parameters.MagnificationFilter || "LINEAR"]);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl[parameters.MinificationFilter || "NEAREST_MIPMAP_LINEAR"]);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl[parameters.WrapS || "REPEAT"]);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl[parameters.WrapT || "REPEAT"]);
  }

  get width() {
    return this.size[0];
  }

  get height() {
    return this.size[1];
  }

  bindTexture() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }

  sampler2D(target: number) {
    this.gl.activeTexture(target + this.gl.TEXTURE0);
    this.bindTexture();
    return target;
  }

  resize(width: number, height = width) {
    vec2.set(this.size, width, height);
    vec2.set(this.halfSize, width / 2, height / 2);
    vec2.set(this.inverseSize, 1 / width, 1 / height);
  }
}
