import {context as gl} from './WebGL2';

/**
 * GLSL's shader stage representation
 */
export class ShaderStage {
	//
	// fields
	//

	#ID!: WebGLShader | null;
	#src: string = '';

	//
	// properties
	//

	/**
	 * Get internal representation
	 * @readonly
	 * @returns {WebGLShader | null}
	 */
	get ID(): WebGLShader | null {
		return this.#ID;
	}

	/**
	 * Get source code
	 * @readonly
	 * @returns {string}
	 */
	get Source(): string {
		return this.#src;
	}

	//
	// methods
	//

	/**
	 * Compile shader stage
	 * @param {Object} obj Config object
	 * @param {number} obj.stageType GLEnum representing shader stage type
	 * @param {string} obj.stageSource String representing shader stage source code
	 * @returns {ShaderStage} Reference to self
	 */
	compile({
		stageType,
		stageSource,
	}: {
		stageType: number;
		stageSource: string;
	}): ShaderStage {
		this.#ID = gl().createShader(stageType);
		this.#src = stageSource;
		gl().shaderSource(this.#ID!, stageSource);
		gl().compileShader(this.#ID!);
		this.logErrors({errorType: gl().COMPILE_STATUS});
		return this;
	}

	/**
	 * Log specific shader stage errors
	 * @param {Object} obj Config object
	 * @param {number} obj.errorType GLEnum representing error type
	 * @returns {ShaderStage} Reference to self
	 */
	logErrors({errorType}: {errorType: number}): ShaderStage {
		if (!gl().getShaderParameter(this.#ID!, errorType)) {
			const infoLog = gl().getShaderInfoLog(this.#ID!);
			this.delete();
			throw `ShaderStage<error>:\n${infoLog}\n\nShaderStage<stage source>:\n${
				this.#src
			}`;
		}
		return this;
	}

	/**
	 * Deletes internal shader stage. After this operation shader stage is in invalid state.
	 */
	delete(): void {
		gl().deleteShader(this.#ID);
	}
}
