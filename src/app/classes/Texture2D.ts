import {context as gl} from './WebGL2';

export class Texture2D {
	//
	// fields
	//

	format: number = gl().RGB;
	internalFormat: number = gl().RGB;
	minFilter: number = gl().LINEAR;
	magFilter: number = gl().LINEAR;
	wrapS: number = gl().CLAMP_TO_EDGE;
	wrapT: number = gl().CLAMP_TO_EDGE;
	mipmaps: boolean = false;
	flipY: boolean = true;
	premultiplyAlpha: boolean = false;

	get width() {
		return this.source.width;
	}
	get height() {
		return this.source.height;
	}
	source!: HTMLCanvasElement | HTMLImageElement;
	#ID: WebGLTexture | null;
	static #active: Texture2D | null;

	//
	// properties
	//

	/**
	 * Get internal representation
	 * @readonly
	 * @returns {WebGLTexture | null}
	 */
	get ID(): WebGLTexture | null {
		return this.#ID;
	}

	/**
	 * Is this Texture currently bound
	 * @readonly
	 * @returns {boolean}
	 */
	get isActive(): boolean {
		return this === Texture2D.#active;
	}

	//
	// methods
	//

	/**
	 * Constructs new Texture2D object
	 */
	constructor() {
		this.#ID = gl().createTexture();
	}

	/**
	 * Generate new data for current Texture2D object
	 * @param {Object} obj Config object
	 * @param {HTMLCanvasElement | HTMLImageElement} obj.source Texture source
	 * @returns {Texture2D} Reference to self
	 */
	generate({
		source,
	}: {
		source: HTMLCanvasElement | HTMLImageElement;
	}): Texture2D {
		this.source = source;
		this.bind();
		gl().pixelStorei(gl().UNPACK_FLIP_Y_WEBGL, this.flipY);
		gl().pixelStorei(
			gl().UNPACK_PREMULTIPLY_ALPHA_WEBGL,
			this.premultiplyAlpha
		);
		gl().texImage2D(
			gl().TEXTURE_2D,
			0,
			this.internalFormat,
			this.format,
			gl().UNSIGNED_BYTE,
			source
		);
		gl().texParameteri(
			gl().TEXTURE_2D,
			gl().TEXTURE_MIN_FILTER,
			this.minFilter
		);
		gl().texParameteri(
			gl().TEXTURE_2D,
			gl().TEXTURE_MAG_FILTER,
			this.magFilter
		);
		gl().texParameteri(
			gl().TEXTURE_2D,
			gl().TEXTURE_MAG_FILTER,
			gl().NEAREST
		);
		gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_WRAP_S, this.wrapS);
		gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_WRAP_T, this.wrapT);
		if (this.mipmaps) {
			gl().generateMipmap(gl().TEXTURE_2D);
		}
		this.unbind();
		return this;
	}

	/**
	 * Bind texture to WebGL2's context with given slot
	 * @param {Object} obj Config object
	 * @param {number} obj.slot Slot used for binding
	 * @returns {Texture2D} Reference to self
	 */
	bind({slot = 0}: {slot?: number} = {}): Texture2D {
		Texture2D.#active = this;
		// every texture can go to 1 of at least 8 slots
		gl().activeTexture(gl().TEXTURE0 + slot);
		gl().bindTexture(gl().TEXTURE_2D, this.#ID);
		if (this.format == gl().RGBA) {
			gl().enable(gl().BLEND);
			gl().blendFunc(gl().SRC_ALPHA, gl().ONE_MINUS_SRC_ALPHA);
		}
		return this;
	}

	/**
	 * Unbind texture drom WebGL2's context
	 * @returns {Texture2D} Reference to self
	 */
	unbind(): Texture2D {
		if (this.isActive) {
			Texture2D.#active = null;
			gl().bindTexture(gl().TEXTURE_2D, null);
		}
		return this;
	}

	/**
	 * Deletes internal texture. After this operation texture is in invalid state.
	 */
	delete(): void {
		this.unbind();
		gl().deleteTexture(this.#ID);
	}
}
