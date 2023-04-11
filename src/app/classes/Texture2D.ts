import {gl} from './WebGL2';

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
		this.bind();
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
		gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_WRAP_S, this.wrapS);
		gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_WRAP_T, this.wrapT);
		this.unbind();
		return this;
	}

	/**
	 * Bind texture to WebGL2's context with given slot
	 * @param {Object} obj Config object
	 * @param {number} obj.slot Slot used for binding
	 * @returns {Texture2D} Reference to self
	 */
	bind({slot}: {slot: number} = {slot: 0}): Texture2D {
		Texture2D.#active = this;
		// every texture can go to 1 of at least 8 slots
		gl().activeTexture(gl().TEXTURE0 + slot);
		gl().bindTexture(gl().TEXTURE_2D, this.#ID);
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
