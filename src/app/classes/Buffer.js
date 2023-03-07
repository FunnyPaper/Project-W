import { gl } from './WebGL2.js';

/**
 * WebGL2's buffer representation
 */
export class Buffer {
    //
    // fields 
    //

    /** @type {WebGLBuffer} */
    #instance = null;
    /** @type {TypedArray} */
    #data = null;
    /** @type {number} */
    #usage = 0;
    /** @type {number} */
    #bufferType = 0;
    /** @type {number} */
    #dataType = 0;
    /** @type {Map<number, Buffer>} */
    static #active = new Map();

    //
    // properties
    //

    /**
     * Buffer internal object
     * @readonly
     * @returns {WebGLBuffer}
     */
    get instance() {
        return this.#instance;
    }

    /**
     * Is this buffer currently bound
     * @readonly
     * @returns {boolean}
     */
    get isActive() {
        return Buffer.#active.get(this.#bufferType) === this;
    }

    /**
     * Set buffer data
     * @param {Object} obj Config object 
     * @param {TypedArray} obj.data Data inside typed array (ex Float32Array) 
     * @returns {Buffer} Reference to self
     */
    setData({ data }) {
        this.#data = data;
        this.bind();
        gl().bufferData(this.#bufferType, this.#data, this.#usage);
        this.unbind();
        return this;
    }

    /**
     * Gets buffer data
     * @returns {TypedArray} Internal data used by Buffer
     */
    getData() {
        return this.#data;
    }

    /**
     * Gets buffer's data type
     * @returns {number} GLEnum representing buffer data type
     */
    getDataType() {
        return this.#dataType;
    }

    /**
     * Gets buffer type
     * @returns {number} GLEnum representing buffer type
     */
    getBufferType() {
        return this.#bufferType;
    }

    /**
     * Gets buffer usage
     * @returns {number} GLEnmu representing buffer usage
     */
    getUsage() {
        return this.#usage;
    }

    /**
     * Constructs new Buffer object
     * @param {Object} obj Config object 
     * @param {number} obj.bufferType GLEnum representing buffer type
     * @param {number} obj.dataType GLEnum representing data type
     * @param {number} obj.usage GLEnum representing buffer usage
     */
    constructor({ bufferType, dataType, usage }) {
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
        if(this.isActive) {
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