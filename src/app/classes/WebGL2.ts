/**
 * Must be initialized before any usage by call to WebGL2.init method
 */
class WebGL2 {
	//
	// fields
	//

	static #content: WebGL2RenderingContext | null;
	static #canvas: HTMLCanvasElement | null;
	static #initialized: boolean = false;

	//
	// properties
	//

	static get content(): WebGL2RenderingContext | null {
		return WebGL2.#content;
	}

	static get canvas(): HTMLCanvasElement | null {
		return WebGL2.#canvas;
	}

	//
	// methods
	//

	/**
	 * Constructs new WebGL2 object
	 * @param {Object} configObj Object with configurations
	 * @param {string} configObj.css CSS tag pointing to *single* HTMLCanvasElement
	 * @returns {typeof WebGL2} Reference to self
	 */
	static init({css}: {css: string}): typeof WebGL2 {
		if (!WebGL2.#initialized) {
			// Search for canvas with given css
			WebGL2.#canvas = document.querySelector(css);
			if (!WebGL2.#canvas) {
				throw new TypeError(
					`WebGL2: ${css} doesn't point to valid HTML tag`
				);
			}

			// Retrieve webgl2 context from given HTMLCanvasElement
			WebGL2.#content = WebGL2.#canvas.getContext('webgl2')!;
			if (!WebGL2.#content) {
				throw new TypeError(
					`WebGL2: webgl2 context isn't valid in given browser`
				);
			}

			// Register callbacks
			WebGL2.#canvas.addEventListener('resize', () => {
				WebGL2.#content?.viewport(
					0,
					0,
					WebGL2.#canvas?.width!,
					WebGL2.#canvas?.height!
				);
			});

			WebGL2.#initialized = true;
		}
		return WebGL2;
	}

	/**
	 * Sets color used with WebGL2 clear function
	 * @param {{r: number, g: number, b: number, a: number}} colorObj Color in RGBA format
	 * @returns {typeof WebGL2} Reference to self
	 */
	static setColor(
		{r, g, b, a}: {r: number; g: number; b: number; a: number} = {
			r: 1.0,
			g: 1.0,
			b: 1.0,
			a: 1.0,
		}
	): typeof WebGL2 {
		WebGL2.#content?.clearColor(r, g, b, a);
		return WebGL2;
	}

	/**
	 * Determines if images should be flipped
	 * @param {Object} configObj Object with configurations
	 * @param {boolean} configObj.flipImages Whenever images should be flipped by Y axis
	 * @returns {typeof WebGL2} Reference to self
	 */
	static setFlipY(
		{flipImages}: {flipImages: boolean} = {flipImages: true}
	): typeof WebGL2 {
		WebGL2.#content?.pixelStorei(
			WebGL2.#content.UNPACK_FLIP_Y_WEBGL,
			flipImages
		);
		return WebGL2;
	}

	/**
	 * Sets context (and canvas) size
	 * @param {Object} configObj Object with configurations
	 * @param {number} configObj.width New width of WebGL2's window
	 * @param {number} configObj.height New height of WebGL2's window
	 * @returns {typeof WebGL2} Reference to self
	 */
	static setSize({
		width,
		height,
	}: {
		width: number;
		height: number;
	}): typeof WebGL2 {
		// Set HTMLCanvasElement's properties
		WebGL2.#canvas!.width = width;
		WebGL2.#canvas!.height = height;
		// Set HTMLCanvasElement style's properties
		WebGL2.#canvas!.style!.width = `${width}px`;
		WebGL2.#canvas!.style!.height = `${height}px`;
		// Set webgl2 context's size
		WebGL2.#content?.viewport(0, 0, width, height);
		return WebGL2;
	}

	/**
	 * Clears screen
	 * @returns {typeof WebGL2} Reference to self
	 */
	static clear(): typeof WebGL2 {
		WebGL2.#content?.clear(
			WebGL2.#content!.COLOR_BUFFER_BIT |
				WebGL2.#content!.DEPTH_BUFFER_BIT
		);
		return WebGL2;
	}
}
/**
 * Shortcut to WebGL2.content.
 * WebGL2 instance must be initialized before any usage.
 */
const gl: () => WebGL2RenderingContext = () => WebGL2.content!;
export {WebGL2, gl};
