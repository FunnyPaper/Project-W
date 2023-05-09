import {context as gl} from './WebGL2';
import {Buffer} from './Buffer';

export class VertexArray {
	//
	// fields
	//

	#instance: WebGLVertexArrayObject | null;
	#buffers: Set<Buffer> = new Set();
	static #active: VertexArray | null;

	//
	// properties
	//

	/**
	 * Is this vertex array currently bound
	 * @readonly
	 * @returns {boolean}
	 */
	get isActive(): boolean {
		return VertexArray.#active === this;
	}

	//
	// methods
	//

	/**
	 * Constructs new VertexArray object
	 */
	constructor() {
		this.#instance = gl().createVertexArray()!;
	}

	/**
	 * Sets internal references to buffers data
	 * @param {Object} obj Config object
	 * @param {Set<Buffer>} obj.buffers Buffers to be assigned
	 * @returns {VertexArray} Reference to self
	 */
	setBuffers({buffers}: {buffers: Set<Buffer>}): VertexArray {
		this.bind();
		buffers.forEach(buffer => this.#buffers.add(buffer.bind()));
		this.unbind();
		return this;
	}

	/**
	 * Clears internal references to buffers data
	 * @returns {VertexArray} Reference to self
	 */
	clearBuffers(): VertexArray {
		this.bind();
		this.#buffers.forEach(buffer => buffer.unbind());
		this.#buffers.clear();
		this.unbind();
		return this;
	}

	/**
	 * Binds current vertex array to WebGL2's context
	 * @returns {VertexArray} Reference to self
	 */
	bind(): VertexArray {
		VertexArray.#active = this;
		gl().bindVertexArray(this.#instance);
		return this;
	}

	/**
	 * Unbinds current vertex array from WebGL2's context
	 * @returns {VertexArray} Reference to self
	 */
	unbind(): VertexArray {
		if (this.isActive) {
			VertexArray.#active = null;
			gl().bindVertexArray(null);
		}
		return this;
	}

	/**
	 * Deletes internal vertex array. After this operation vertex array is in invalid state.
	 */
	delete(): void {
		this.unbind();
		gl().deleteVertexArray(this.#instance);
	}
}
