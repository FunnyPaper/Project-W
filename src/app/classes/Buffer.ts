import {gl} from './WebGL2';

/**
 * WebGL2's buffer representation
 */
export class Buffer {
	//
	// fields
	//

	#instance: WebGLBuffer | null;
	#data!: BufferSource | null;
	#usage: number = 0;
	#bufferType: number = 0;
	#dataType: number = 0;
	static #active: Map<number, Buffer | null> = new Map();

	//
	// properties
	//

	/**
	 * Buffer internal object
	 * @readonly
	 * @returns {WebGLBuffer | null}
	 */
	get instance(): WebGLBuffer | null {
		return this.#instance;
	}

	/**
	 * Is this buffer currently bound
	 * @readonly
	 * @returns {boolean}
	 */
	get isActive(): boolean {
		return Buffer.#active.get(this.#bufferType) === this;
	}

	/**
	 * Set buffer data
	 * @param {Object} obj Config object
	 * @param {BufferSource} obj.data Data inside typed array (ex Float32Array)
	 * @returns {Buffer} Reference to self
	 */
	setData({data}: {data: BufferSource}) {
		this.#data = data;
		this.bind();
		gl().bufferData(this.#bufferType, this.#data, this.#usage);
		this.unbind();
		return this;
	}

	/**
	 * Gets buffer data
	 * @returns {BufferSource | null} Internal data used by Buffer
	 */
	getData(): BufferSource | null {
		return this.#data;
	}

	/**
	 * Gets buffer's data type
	 * @returns {number} GLEnum representing buffer data type
	 */
	getDataType(): number {
		return this.#dataType;
	}

	/**
	 * Gets buffer type
	 * @returns {number} GLEnum representing buffer type
	 */
	getBufferType(): number {
		return this.#bufferType;
	}

	/**
	 * Gets buffer usage
	 * @returns {number} GLEnmu representing buffer usage
	 */
	getUsage(): number {
		return this.#usage;
	}

	/**
	 * Constructs new Buffer object
	 * @param {Object} obj Config object
	 * @param {number} obj.bufferType GLEnum representing buffer type
	 * @param {number} obj.dataType GLEnum representing data type
	 * @param {number} obj.usage GLEnum representing buffer usage
	 */
	constructor({
		bufferType,
		dataType,
		usage,
	}: {
		bufferType: number;
		dataType: number;
		usage: number;
	}) {
		this.#bufferType = bufferType;
		this.#dataType = dataType;
		this.#usage = usage;
		this.#instance = gl().createBuffer();
	}

	/**
	 * Binds current buffer to WebGL2's context
	 * @returns {Buffer} Reference to self
	 */
	bind() {
		Buffer.#active.set(this.#bufferType, this);
		gl().bindBuffer(this.#bufferType, this.#instance);
		return this;
	}

	/**
	 * Unbinds current buffer from WebGL2's context
	 * @returns {Buffer} Reference to self
	 */
	unbind() {
		if (this.isActive) {
			Buffer.#active.set(this.#bufferType, null);
			gl().bindBuffer(this.#bufferType, null);
		}
		return this;
	}

	/**
	 * Deletes internal buffer. After this operation buffer is in invalid state.
	 */
	delete() {
		this.unbind();
		gl().deleteBuffer(this.#instance);
	}
}
