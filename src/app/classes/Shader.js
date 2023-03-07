import { gl } from './WebGL2.js';

export class Shader {
    //
    // fields
    //

    /** @type {WebGLProgram} */
    #ID = 0;
    /** @type {Map<string, num>} */
    #vertexArrays = new Map();
    /** @type {Shader} */
    static #active = null;
    
    //
    // properties
    //

    /**
     * Get internal representation
     * @readonly
     * @returns {WebGLProgram}
     */
    get ID() {
        return this.#ID;
    }			
    
    /**
     * Is this shader currently bound
     * @readonly
     * @returns {boolean}
     */
    get isActive() {
        return this === Shader.#active;
    }
    
    //
    // methods
    //
    
    /**
     * Compile shader
     * @param {Object} obj Config object 
     * @param {ShaderStage[]} obj.stages Shader stages needed for compilation
     * @returns {Shader} Reference to self
     */
    compile({ stages }) {
        this.#ID = gl().createProgram();
        stages.forEach(stage => gl().attachShader(this.#ID, stage.ID));
        gl().linkProgram(this.#ID);
        this.logErrors({errorType: gl().LINK_STATUS});
        stages.forEach(stage => gl().detachShader(this.#ID, stage.ID));
        return this;
    }

    /**
     * Validate shader after compilation
     * @returns {Shader} Reference to self
     */
    validate() {
        gl().validateProgram(this.#ID);
        this.logErrors({errorType: gl().VALIDATE_STATUS});
        return this;
    }

    /**
     * Bind shader to WebGL2's context
     * @returns {Shader} Reference to self
     */
    bind() {
        Shader.#active = this;
        gl().useProgram(this.#ID);
        return this;
    }

    /**
     * Unbind shader from WebGL2's context
     * @returns {Shader} Reference to self
     */
    unbind() {
        if(this.isActive) {
            Shader.#active = null;
            gl().useProgram(null);
        }
        return this;
    }

    /**
     * Log specific shader errors
     * @param {Object} obj Config object
     * @param {number} obj.errorType GLEnum representing error type 
     * @returns {Shader} Reference to self
     */
    logErrors({ errorType }) {
        if(!gl().getProgramParameter(this.#ID, errorType)) {
            const infoLog = gl().getProgramInfoLog(this.#ID);
            this.delete();
            throw `Shader<error>:\n${infoLog}`;
        }
        return this;
    }

    /**
     * Deletes internal shader. After this operation shader is in invalid state.
     */
    delete() {
        this.unbind();
        gl().deleteProgram(this.#ID);
    }

    //
    // Uniforms
    //

    /**
     * Set specified uniform of type mat4
     * @param {Object} obj Config object
     * @param {string} obj.name Uniform name inside shader stage
     * @param {TypedArray} obj.value Value to be send to uniform
     * @returns {Shader} Reference to self
     */
    setUniformMatrix4f({name, value}) {
        if(!this.isActive) {
            this.bind();
        }
        gl().uniformMatrix4fv(gl().getUniformLocation(this.#ID, name), false, value);
        return this;
    };

    /**
     * Set specified uniform of type int
     * @param {Object} obj Config object
     * @param {string} obj.name Uniform name inside shader stage
     * @param {TypedArray} obj.value Value to be send to uniform
     * @returns {Shader} Reference to self
     */
    setUniform1i({ name, value }) {
        if(!this.isActive) {
            this.bind();
        }
        gl().uniform1i(gl().getUniformLocation(this.#ID, name), value);
        return this;
    }

    /**
     * Set specified vertex attribute
     * @param {Object} obj Config object
     * @param {string} obj.name Attribute name
     * @param {number} obj.elementsCount Number of elements constituting attribute (1-4)
     * @param {number} obj.dataType Type of transmitted data
     * @param {boolean} obj.normalize Does data needs to be normalized to range 0-1
     * @param {number} obj.vertexSize Size of single vertex inside buffer (sizeof vertex)
     * @param {number} obj.componentOffset Offset of specified attribute inside data (0 means start of vertex)
     */
    setAttribute({ name, elementsCount, dataType, normalize = false, vertexSize, componentOffset = 0 }) {
        let location = 0;
        if(this.#vertexArrays.has(name)) {
            location = this.#vertexArrays.get(name);
        } else {
            location = gl().getAttribLocation(this.#ID, name);
            this.#vertexArrays.set(name, location);
        }
        gl().enableVertexAttribArray(location);
        gl().vertexAttribPointer(
            location, 
            elementsCount, 
            dataType, 
            normalize, 
            vertexSize, 
            componentOffset
        );
    }
}