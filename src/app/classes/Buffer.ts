import {context as gl} from './WebGL2';

export interface IBufferDataInfo {
	bufferType: number;
	dataType: number;
	usage: number;
	normalize: boolean;
	vertexSize: number;
	attribute: {
		elementsCount: number;
		elementsOffset: number;
	}[];
}

/**
 * WebGL2's buffer representation
 */
export class Buffer {
	//
	// fields
	//

	#instance: WebGLBuffer | null;
	protected data!: BufferSource | null;
	#dataInfo!: IBufferDataInfo;
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
		return Buffer.#active.get(this.#dataInfo.bufferType) === this;
	}

	/**
	 * Set buffer data
	 * @param {Object} obj Config object
	 * @param {BufferSource} obj.data Data inside typed array (ex Float32Array)
	 * @returns {Buffer} Reference to self
	 */
	setData({data}: {data: BufferSource}) {
		if (this.data !== data) {
			this.data = data;
			this.bind();
			gl().bufferData(
				this.#dataInfo.bufferType,
				this.data,
				this.#dataInfo.usage
			);
			this.unbind();
		}
		return this;
	}

	allocateSpace({bytes}: {bytes: number}) {
		this.bind();
		gl().bufferData(this.#dataInfo.bufferType, bytes, this.#dataInfo.usage);
		this.unbind();
		return this;
	}

	updateData({data}: {data: BufferSource}) {
		if (this.data !== data) {
			this.data = data;
			this.bind();
			gl().bufferSubData(this.#dataInfo.bufferType, 0, this.data);
			this.unbind();
		}
		return this;
	}

	/**
	 * Gets buffer data
	 * @returns {BufferSource | null} Internal data used by Buffer
	 */
	getData(): BufferSource | null {
		return this.data;
	}

	getBufferDataInfo(): IBufferDataInfo {
		return this.#dataInfo;
	}

	/**
	 * Constructs new Buffer object
	 */
	constructor({dataInfo}: {dataInfo: IBufferDataInfo}) {
		this.#dataInfo = dataInfo;
		this.#instance = gl().createBuffer();
	}

	/**
	 * Binds current buffer to WebGL2's context
	 * @returns {Buffer} Reference to self
	 */
	bind() {
		Buffer.#active.set(this.#dataInfo.bufferType, this);
		gl().bindBuffer(this.#dataInfo.bufferType, this.#instance);
		return this;
	}

	/**
	 * Unbinds current buffer from WebGL2's context
	 * @returns {Buffer} Reference to self
	 */
	unbind() {
		if (this.isActive) {
			Buffer.#active.set(this.#dataInfo.bufferType, null);
			gl().bindBuffer(this.#dataInfo.bufferType, null);
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
