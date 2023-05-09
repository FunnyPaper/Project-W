class WebGL2 {
	//
	// fields
	//

	protected content: WebGL2RenderingContext | null;
	protected canvas: HTMLCanvasElement | null;
	static active?: WebGL2;

	//
	// properties
	//

	get Content(): WebGL2RenderingContext | null {
		return this.content;
	}

	get Canvas(): HTMLCanvasElement | null {
		return this.canvas;
	}

	get Width(): number {
		return this.canvas?.width!;
	}

	get Height(): number {
		return this.canvas?.height!;
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
	constructor({css}: {css: string}) {
		WebGL2.active = this;
		// Search for canvas with given css
		this.canvas = document.querySelector(css);
		if (!this.canvas) {
			throw new TypeError(
				`WebGL2: ${css} doesn't point to valid HTML tag`
			);
		}

		// Retrieve webgl2 context from given HTMLCanvasElement
		this.content = this.canvas.getContext('webgl2')!;
		if (!this.content) {
			throw new TypeError(
				`WebGL2: webgl2 context isn't valid in given browser`
			);
		}

		// Register callbacks
		this.canvas.addEventListener('resize', () => {
			this.content?.viewport(
				0,
				0,
				this.canvas?.width!,
				this.canvas?.height!
			);
		});
	}

	/**
	 * Sets color used with WebGL2 clear function
	 * @param {{r: number, g: number, b: number, a: number}} colorObj Color in RGBA format
	 * @returns {typeof WebGL2} Reference to self
	 */
	setColor(
		{r, g, b, a}: {r: number; g: number; b: number; a: number} = {
			r: 1.0,
			g: 1.0,
			b: 1.0,
			a: 1.0,
		}
	): WebGL2 {
		this.content?.clearColor(r, g, b, a);
		return this;
	}

	/**
	 * Determines if images should be flipped
	 * @param {Object} configObj Object with configurations
	 * @param {boolean} configObj.flipImages Whenever images should be flipped by Y axis
	 * @returns {typeof WebGL2} Reference to self
	 */
	setFlipY({flipImages = true}: {flipImages?: boolean} = {}): WebGL2 {
		this.content?.pixelStorei(this.content.UNPACK_FLIP_Y_WEBGL, flipImages);
		return this;
	}

	/**
	 * Sets context (and canvas) size
	 * @param {Object} configObj Object with configurations
	 * @param {number} configObj.width New width of WebGL2's window
	 * @param {number} configObj.height New height of WebGL2's window
	 * @returns {typeof WebGL2} Reference to self
	 */
	setSize({width, height}: {width: number; height: number}): WebGL2 {
		// Set HTMLCanvasElement's properties
		this.canvas!.width = width;
		this.canvas!.height = height;
		// Set HTMLCanvasElement style's properties
		this.canvas!.style!.width = `${width}px`;
		this.canvas!.style!.height = `${height}px`;
		// Set webgl2 context's size
		this.content?.viewport(0, 0, width, height);
		return this;
	}

	/**
	 * Clears screen
	 * @returns {typeof WebGL2} Reference to self
	 */
	clear(): WebGL2 {
		this.content?.clear(
			this.content!.COLOR_BUFFER_BIT | this.content!.DEPTH_BUFFER_BIT
		);
		return this;
	}
}

/**
 * Shortcut to WebGL2.content.
 * WebGL2 instance must be initialized before any usage.
 */
const context = () => WebGL2.active?.Content!;
export {WebGL2, context};
