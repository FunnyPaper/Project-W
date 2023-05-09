import {AABB} from './AABB';
import {Component} from './Component';
import {GameObject} from './GameObject';
import {Renderer} from './Renderer';
import {ResourceManager} from './ResourceManager';
import {Time} from './Time';
import {WebGL2} from './WebGL2';

export class Scene {
	protected gameObjects: GameObject[] = [];
	protected loop!: (() => void) | null;
	protected loopID: number = 0;
	protected running: boolean = false;
	static active?: Scene;
	protected context: WebGL2;
	protected time: Time;

	/**
	 * Constructs Scene object
	 * @param {object} obj
	 * @param {Renderer} obj.renderer Renderer to be used inside scene
	 * @param {number} obj.width Scene's width
	 * @param {number} obj.height Scene's height
	 * @param {HTMLImageElement} obj.backgroundUrl Scene's skybox
	 */
	constructor() {
		Scene.active = !Scene.active ? this : Scene.active;
		this.time = new Time();
		this.context = new WebGL2({css: '#gl-canvas'}).setColor({
			r: 1.0,
			g: 1.0,
			b: 1.0,
			a: 1.0,
		});
	}

	/**
	 * Adds given game objects to scene workflow
	 * @param {object} obj
	 * @param {GameObject[]} obj.gameObjects Game objects to be included in workflow
	 */
	addGameObjects({gameObjects}: {gameObjects: GameObject[]}) {
		this.gameObjects = [...new Set([...this.gameObjects, ...gameObjects])];
	}

	/**
	 * Starts inner game loop
	 */
	run() {
		if (!this.loop) {
			this.#start();
			this.running = true;
		}
		return this;
	}

	stop() {
		if (!!this.loop) {
			Time.scale = 0;
			this.running = false;
			cancelAnimationFrame(this.loopID);
		}
		return this;
	}

	resume() {
		if (!!this.loop) {
			Time.scale = 1;
			this.running = true;
			this.loopID = requestAnimationFrame(this.loop);
		}
		return this;
	}

	finalize() {
		if (this.running) {
			this.stop();
		}
		this.loop = null;
		this.gameObjects.forEach(o =>
			o.getComponents({type: Component}).forEach(c => c.onFinalize())
		);
		this.gameObjects = [];
		ResourceManager.clear();
		return this;
	}

	/**
	 * Actual start logic (initialization process)
	 */
	#start() {
		// Time needs to be initialized before use
		this.time.init();

		// Calls every objects start method
		this.gameObjects.forEach(o =>
			o
				.getComponents({type: Component})
				.forEach(c => c.start({input: this.context.Canvas!}))
		);

		const timeLoop = () => {
			this.time.tick();
			requestAnimationFrame(timeLoop);
		};
		timeLoop();

		// Define and run loop
		this.loop = () => {
			this.update().resolveCollisions().draw();
			if (this.loop) {
				this.loopID = requestAnimationFrame(this.loop!);
			}
		};
		this.loop();
		return this;
	}

	/**
	 * Update every object logic
	 */
	update() {
		this.gameObjects.forEach(o =>
			o
				.getComponents({type: Component})
				.filter(c => c.enabled)
				.forEach(c => c.update?.({time: this.time}))
		);
		return this;
	}

	/**
	 * Draw every object
	 */
	draw() {
		this.context.clear();
		this.gameObjects.forEach(o =>
			o
				.getComponents<Renderer>({type: Renderer})
				.filter(c => c.enabled)
				.forEach(c => c.render())
		);
		return this;
	}

	resolveCollisions() {
		const combinations = this.gameObjects.reduce((prev, curr) => {
			const aabb = curr.getComponent<AABB>({type: AABB});
			return aabb?.enabled ? [...prev, aabb] : prev;
		}, new Array<AABB>());
		combinations
			.flatMap((v, i) => combinations.slice(i + 1).map(s => [v, s]))
			.forEach(([a, b]) => {
				if (a.Intersects({other: b})) {
					a.object
						.getComponents<Component>({type: Component})
						.forEach(c => c.onIntersection({gameObject: b.object}));
					b.object
						.getComponents<Component>({type: Component})
						.forEach(c => c.onIntersection({gameObject: a.object}));
				}
			});

		return this;
	}

	get width() {
		return this.context.Width;
	}
	get height() {
		return this.context.Height;
	}
}
