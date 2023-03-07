import { gl } from './WebGL2.js';

export class Texture2D {
    //
    // fields
    //

    /** @type {number} */
    format = gl().RGB;
    /** @type {number} */
    internalFormat = gl().RGB;
    /** @type {number} */
    minFilter = gl().LINEAR;
    /** @type {number} */
    magFilter = gl().LINEAR;
    /** @type {number} */
    wrapS = gl().CLAMP_TO_EDGE;
    /** @type {number} */
    wrapT = gl().CLAMP_TO_EDGE;
    /** @type {WebGLTexture} */			
    #ID = null;
    /** @type {Texture2D} */
    static #active = null;
    
    //
    // properties
    //

    /**
     * Get internal representation
     * @readonly
     * @returns {WebGLTexture}
     */
    get ID() {
        return this.#ID;
    }

    /**
     * Is this Texture currently bound
     * @readonly
     * @returns {boolean}
     */
    get isActive() {
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
    generate({source}) {
        this.bind();
        gl().texImage2D(gl().TEXTURE_2D, 0, this.internalFormat, this.format, gl().UNSIGNED_BYTE, source);
        gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_MIN_FILTER, this.minFilter);
        gl().texParameteri(gl().TEXTURE_2D, gl().TEXTURE_MAG_FILTER, this.magFilter);
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
    bind({slot = 0} = {}) {
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
    unbind() {
        if(this.isActive) {
            Texture2D.#active = null;
            gl().bindTexture(gl().TEXTURE_2D, null);
        }
        return this;
    }

    /**
     * Deletes internal texture. After this operation texture is in invalid state.
     */
    delete() {
        this.unbind();
        gl().deleteTexture(this.#ID);
    }
}