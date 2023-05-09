import {Wall} from './Wall';
import {vec2} from 'gl-matrix';
import {AABB} from '../classes/AABB';
import {GameObject} from '../classes/GameObject';
import {ResourceManager} from '../classes/ResourceManager';
import {Scene} from '../classes/Scene';
import {SpriteRenderer} from '../classes/SpriteRenderer';
import {Ambient} from './Ambient';
import {AudioListener} from './../classes/AudioListener';
import * as PacmansImg from '../../assets/textures/pacman/pacmans.png';
import * as WallsImg from '../../assets/textures/pacman/walls.png';
import * as GhostsImg from '../../assets/textures/pacman/ghosts.png';
import * as CoinsImg from '../../assets/textures/pacman/coins.png';
import * as BackgroundImg from '../../assets/textures/pacman/background.png';
import {Pacman} from './Pacman';
import {Ghost} from './Ghost';
import {Coin} from './Coin';
import {CoinAnimator} from './CoinAnimator';
import {GhostAnimator} from './GhostAnimator';
import {PacmanAnimator} from './PacmanAnimator';
import {PacmanSceneData} from './Types';
import {context as gl} from '../classes/WebGL2';
import * as fragment from '../../assets/shaders/sprite.fs.glsl';
import * as vertex from '../../assets/shaders/sprite.vs.glsl';
import {Component} from '../classes/Component';
import {Grid} from './Grid';
import {Portal} from './Portal';
import {Inky} from './Inky';
import {Pinky} from './Pinky';
import {Clyde} from './Clyde';
import {Blinky} from './Blinky';

export class PacmanScene extends Scene {
	static get ATLAS_NAME() {
		return {
			walls: 'walls',
			coins: 'coins',
			ghosts: 'ghosts',
			pacmans: 'pacmans',
			portals: 'portals',
			background: 'background',
		};
	}

	static get SPRITE_PREFIXES() {
		return {
			walls: 'walls_',
			coins: 'coins_',
			ghosts: 'ghosts_',
			pacmans: 'pacmans_',
			portals: 'portals_',
		};
	}

	private grid!: Grid<Component>;
	protected keydownListener: (event: any) => void;
	protected resumeListener: () => void;
	protected gameWonListener: () => void;
	protected gameOverListener: () => void;

	constructor() {
		super();
		this.keydownListener = event => {
			if (event.key == 'p') {
				this.stop();
				window.dispatchEvent(new Event('pause'));
			}
		};
		this.resumeListener = () => {
			this.resume();
		};
		this.gameWonListener = () => {
			this.finalize();
		};
		this.gameOverListener = () => {
			this.finalize();
		};
		window.addEventListener('keydown', this.keydownListener);
		window.addEventListener('resume', this.resumeListener);
		window.addEventListener('game_won', this.gameWonListener);
		window.addEventListener('game_over', this.gameOverListener);
	}

	finalize(): this {
		window.removeEventListener('keydown', this.keydownListener);
		window.removeEventListener('resume', this.resumeListener);
		window.removeEventListener('game_won', this.gameWonListener);
		window.removeEventListener('game_over', this.gameOverListener);
		return super.finalize();
	}

	private createWall({
		position,
		texture,
		scale,
		rotation,
		cellSize,
		offset,
		rows,
		columns,
		color = {r: 1.0, g: 1.0, b: 1.0, a: 1.0},
	}: {
		position: {x: number; y: number};
		texture: string;
		scale: {x: number; y: number};
		rotation: number;
		cellSize: {width: number; height: number};
		offset: {x: number; y: number};
		rows: number;
		columns: number;
		color?: {r: number; g: number; b: number; a: number};
	}): [GameObject, Wall] {
		let wall = new Wall();
		let spriteRenderer = new SpriteRenderer();
		spriteRenderer.sprite = ResourceManager.getAtlas({
			name: PacmanScene.ATLAS_NAME.walls,
		})!.getSprite({
			name: texture,
		});
		spriteRenderer.color = color;
		return [
			new GameObject({
				position: vec2.fromValues(
					offset.x +
						(position.x - columns / 2) * cellSize.width +
						Math.abs(scale.x) / 2,
					offset.y +
						(position.y - rows / 2) * cellSize.height +
						Math.abs(scale.y) / 2
				),
				scale: vec2.fromValues(scale.x, scale.y),
				rotation,
				components: [
					wall,
					spriteRenderer,
					new AABB({
						size: vec2.fromValues(
							Math.abs(scale.x),
							Math.abs(scale.y)
						),
					}),
				],
			}),
			wall,
		];
	}

	private createCoin({
		position,
		texture,
		scale,
		rotation,
		cellSize,
		offset,
		rows,
		columns,
		color = {r: 1.0, g: 1.0, b: 1.0, a: 1.0},
	}: {
		position: {x: number; y: number};
		texture: string;
		scale: {x: number; y: number};
		rotation: number;
		cellSize: {width: number; height: number};
		offset: {x: number; y: number};
		rows: number;
		columns: number;
		color?: {r: number; g: number; b: number; a: number};
	}): [GameObject, Coin] {
		let coin = new Coin();
		let spriteRenderer = new SpriteRenderer();
		spriteRenderer.sprite = ResourceManager.getAtlas({
			name: PacmanScene.ATLAS_NAME.coins,
		})!.getSprite({
			name: texture,
		});
		spriteRenderer.color = color;
		return [
			new GameObject({
				position: vec2.fromValues(
					offset.x +
						(position.x - columns / 2) * cellSize.width +
						Math.abs(scale.x) / 2,
					offset.y +
						(position.y - rows / 2) * cellSize.height +
						Math.abs(scale.y) / 2
				),
				scale: vec2.fromValues(scale.x, scale.y),
				rotation,
				components: [
					coin,
					spriteRenderer,
					new AABB({
						size: vec2.fromValues(
							Math.abs(scale.x * 0.6),
							Math.abs(scale.y * 0.6)
						),
					}),
					new CoinAnimator(),
					new AudioListener(),
				],
			}),
			coin,
		];
	}

	private createGhost({
		position,
		texture,
		scale,
		rotation,
		cellSize,
		offset,
		name,
		rows,
		columns,
		color = {r: 1.0, g: 1.0, b: 1.0, a: 1.0},
		range = 8,
	}: {
		position: {x: number; y: number};
		texture: string;
		scale: {x: number; y: number};
		rotation: number;
		cellSize: {width: number; height: number};
		offset: {x: number; y: number};
		name: string;
		rows: number;
		columns: number;
		color?: {r: number; g: number; b: number; a: number};
		range?: number;
	}): [GameObject, Ghost] {
		let ghost: Ghost;
		switch (name) {
			case 'inky':
				ghost = new Inky();
				break;
			case 'blinky':
				ghost = new Blinky();
				break;
			case 'pinky':
				ghost = new Pinky();
				break;
			case 'clyde':
				ghost = new Clyde();
				break;
			default:
				ghost = new Ghost();
		}
		ghost['name'] = name;
		ghost['range'] = range;
		let spriteRenderer = new SpriteRenderer();
		spriteRenderer.sprite = ResourceManager.getAtlas({
			name: PacmanScene.ATLAS_NAME.ghosts,
		})!.getSprite({
			name: texture,
		});
		spriteRenderer.color = color;
		return [
			new GameObject({
				position: vec2.fromValues(
					offset.x +
						(position.x - columns / 2) * cellSize.width +
						Math.abs(scale.x) / 2,
					offset.y +
						(position.y - rows / 2) * cellSize.height +
						Math.abs(scale.y) / 2
				),
				scale: vec2.fromValues(scale.x, scale.y),
				rotation,
				components: [
					new GhostAnimator(),
					ghost,
					spriteRenderer,
					new AABB({
						size: vec2.fromValues(
							Math.abs(scale.x * 0.9),
							Math.abs(scale.y * 0.9)
						),
					}),
					new AudioListener(),
				],
			}),
			ghost,
		];
	}

	private createPacman({
		position,
		texture,
		scale,
		rotation,
		cellSize,
		offset,
		rows,
		columns,
		color = {r: 1.0, g: 1.0, b: 1.0, a: 1.0},
	}: {
		position: {x: number; y: number};
		texture: string;
		scale: {x: number; y: number};
		rotation: number;
		cellSize: {width: number; height: number};
		offset: {x: number; y: number};
		rows: number;
		columns: number;
		color?: {r: number; g: number; b: number; a: number};
	}): [GameObject, Pacman] {
		let pacman = new Pacman();
		let spriteRenderer = new SpriteRenderer();
		spriteRenderer.sprite = ResourceManager.getAtlas({
			name: PacmanScene.ATLAS_NAME.pacmans,
		})!.getSprite({
			name: texture,
		});
		spriteRenderer.color = color;
		return [
			new GameObject({
				position: vec2.fromValues(
					offset.x +
						(position.x - columns / 2) * cellSize.width +
						Math.abs(scale.x) / 2,
					offset.y +
						(position.y - rows / 2) * cellSize.height +
						Math.abs(scale.y) / 2
				),
				scale: vec2.fromValues(scale.x, scale.y),
				rotation,
				components: [
					new PacmanAnimator(),
					pacman,
					spriteRenderer,
					new AABB({
						size: vec2.fromValues(
							Math.abs(scale.x * 0.8),
							Math.abs(scale.y * 0.8)
						),
					}),
					new AudioListener(),
				],
			}),
			pacman,
		];
	}

	private createPortal({
		position,
		texture,
		scale,
		rotation,
		cellSize,
		offset,
		rows,
		columns,
		color = {r: 1.0, g: 1.0, b: 1.0, a: 1.0},
	}: {
		position: {x: number; y: number};
		texture: string;
		scale: {x: number; y: number};
		rotation: number;
		cellSize: {width: number; height: number};
		offset: {x: number; y: number};
		rows: number;
		columns: number;
		color?: {r: number; g: number; b: number; a: number};
	}): [GameObject, Portal] {
		let portal = new Portal();
		let spriteRenderer = new SpriteRenderer();
		spriteRenderer.sprite = ResourceManager.getAtlas({
			name: PacmanScene.ATLAS_NAME.portals,
		})!.getSprite({
			name: texture,
		});
		spriteRenderer.color = color;
		return [
			new GameObject({
				position: vec2.fromValues(
					offset.x +
						(position.x - columns / 2) * cellSize.width +
						Math.abs(scale.x) / 2,
					offset.y +
						(position.y - rows / 2) * cellSize.height +
						Math.abs(scale.y) / 2
				),
				scale: vec2.fromValues(scale.x, scale.y),
				rotation,
				components: [
					portal,
					spriteRenderer,
					new AABB({
						size: vec2.fromValues(
							Math.abs(scale.x * 0.8),
							Math.abs(scale.y * 0.8)
						),
					}),
					new AudioListener(),
				],
			}),
			portal,
		];
	}

	private createBackground({
		position,
		texture,
		scale,
		rotation,
	}: {
		position: {x: number; y: number};
		texture?: string;
		scale: {x: number; y: number};
		rotation: number;
	}) {
		let components: Component[] = [new Ambient(), new AudioListener()];
		if (texture) {
			let spriteRenderer = new SpriteRenderer();
			spriteRenderer.sprite = ResourceManager.getAtlas({
				name: PacmanScene.ATLAS_NAME.background,
			})!.getSprite({
				name: texture,
			});
			components.push(spriteRenderer);
		}

		return new GameObject({
			position: vec2.fromValues(position.x, position.y),
			scale: vec2.fromValues(scale.x, scale.y),
			rotation,
			components,
		});
	}

	private async loadShaders() {
		const promises: Promise<any>[] = [];

		// Sprite shader
		promises.push(
			ResourceManager.createShaderFromFile({
				name: 'sprite-shader',
				validate: true,
				stages: [
					{
						name: 'sprite-vs',
						type: gl().VERTEX_SHADER,
						file: vertex,
					},
					{
						name: 'sprite-fs',
						type: gl().FRAGMENT_SHADER,
						file: fragment,
					},
				],
			})
		);

		return Promise.all(promises);
	}

	private async loadSpriteAtlases() {
		const promises: Promise<any>[] = [];

		// Background
		promises.push(
			ResourceManager.createSpriteAtlasFromFile({
				name: PacmanScene.ATLAS_NAME.background,
				source: BackgroundImg,
			}).then(atlas => atlas.crop({name: 'background'}))
		);

		// Pacman
		promises.push(
			ResourceManager.createSpriteAtlasFromFile({
				name: PacmanScene.ATLAS_NAME.pacmans,
				source: PacmansImg,
				alpha: true,
				premultiplyAlpha: true,
			}).then(atlas =>
				atlas.cropEvenly({
					prefix: PacmanScene.SPRITE_PREFIXES.pacmans,
					spriteWidth: 16,
					spriteHeight: 16,
					rows: 2,
					columns: 11,
				})
			)
		);

		// Walls
		promises.push(
			ResourceManager.createSpriteAtlasFromFile({
				name: PacmanScene.ATLAS_NAME.walls,
				source: WallsImg,
				alpha: true,
				premultiplyAlpha: true,
			}).then(atlas =>
				atlas.cropEvenly({
					prefix: PacmanScene.SPRITE_PREFIXES.walls,
					spriteWidth: 16,
					spriteHeight: 16,
					rows: 2,
					columns: 9,
				})
			)
		);

		// Coins
		promises.push(
			ResourceManager.createSpriteAtlasFromFile({
				name: PacmanScene.ATLAS_NAME.coins,
				source: CoinsImg,
				alpha: true,
				premultiplyAlpha: true,
			}).then(atlas =>
				atlas.cropEvenly({
					prefix: PacmanScene.SPRITE_PREFIXES.coins,
					spriteWidth: 16,
					spriteHeight: 16,
					rows: 1,
					columns: 4,
				})
			)
		);

		// Portals
		promises.push(
			ResourceManager.createSpriteAtlasFromFile({
				name: PacmanScene.ATLAS_NAME.portals,
				source: CoinsImg,
				alpha: true,
				premultiplyAlpha: true,
			}).then(atlas =>
				atlas.cropEvenly({
					prefix: PacmanScene.SPRITE_PREFIXES.portals,
					spriteWidth: 16,
					spriteHeight: 16,
					rows: 1,
					columns: 4,
				})
			)
		);

		// Ghosts
		promises.push(
			ResourceManager.createSpriteAtlasFromFile({
				name: PacmanScene.ATLAS_NAME.ghosts,
				source: GhostsImg,
				alpha: true,
				premultiplyAlpha: true,
			}).then(atlas =>
				atlas.cropEvenly({
					prefix: PacmanScene.SPRITE_PREFIXES.ghosts,
					spriteWidth: 16,
					spriteHeight: 16,
					rows: 1,
					columns: 8,
				})
			)
		);

		return Promise.all(promises);
	}

	private async loadResources() {
		return Promise.all([this.loadShaders(), this.loadSpriteAtlases()]);
	}

	static async loadFromFile({file}: {file: string}) {
		const scene = new PacmanScene();
		// First load all necessary resources...
		await scene.loadResources();
		// ...then process the level file structure
		const json = (await fetch(file).then(level =>
			level.json()
		)) as PacmanSceneData;

		scene.context
			.setSize({...json.size})
			.setColor({...json.grid.background.color});

		Coin['coins'] = 0;
		Ghost['ghosts'].clear();
		let pacman: Pacman | null = null;
		let ghosts: Ghost[] = [];
		let portals: Portal[] = [];
		scene.grid = new Grid<Component>({
			offset: json.grid.offset,
			rows: json.grid.rows,
			columns: json.grid.columns,
			cellSize: json.grid.cells.size,
		});
		scene.addGameObjects({
			gameObjects: [
				scene.createBackground({
					position: json.grid.offset,
					texture: json.grid.background.image,
					rotation: 0,
					scale: {
						x: json.grid.columns * json.grid.cells.size.width,
						y: json.grid.rows * json.grid.cells.size.height,
					},
				}),
			],
		});
		for (let {
			position,
			scale,
			rotation,
			texture,
			type,
			color,
			additional,
		} of json.grid.cells.data) {
			switch (type) {
				case 'wall':
					{
						let [object, ai] = scene.createWall({
							position,
							texture,
							scale,
							rotation,
							cellSize: json.grid.cells.size,
							offset: json.grid.offset,
							rows: json.grid.rows,
							columns: json.grid.columns,
							color,
						});
						scene.addGameObjects({
							gameObjects: [object],
						});
						scene.grid.setCell({
							row: position.y,
							column: position.x,
							value: ai,
						});
					}
					break;
				case 'coin':
					{
						let [object, ai] = scene.createCoin({
							position,
							texture,
							scale,
							rotation,
							cellSize: json.grid.cells.size,
							offset: json.grid.offset,
							rows: json.grid.rows,
							columns: json.grid.columns,
							color,
						});
						scene.addGameObjects({
							gameObjects: [object],
						});
						scene.grid.setCell({
							row: position.y,
							column: position.x,
							value: ai,
						});
					}
					break;
				case 'portal':
					{
						let [object, ai] = scene.createPortal({
							position,
							texture,
							scale,
							rotation,
							cellSize: json.grid.cells.size,
							offset: json.grid.offset,
							rows: json.grid.rows,
							columns: json.grid.columns,
							color,
						});
						scene.addGameObjects({
							gameObjects: [object],
						});
						scene.grid.setCell({
							row: position.y,
							column: position.x,
							value: ai,
						});
						ai['linkId'] = additional.linkId;
						portals.push(ai);
					}
					break;
				case 'ghost':
					{
						let [object, ai] = scene.createGhost({
							position,
							texture,
							scale,
							rotation,
							cellSize: json.grid.cells.size,
							offset: json.grid.offset,
							name: additional.name,
							rows: json.grid.rows,
							columns: json.grid.columns,
							color,
						});
						scene.addGameObjects({
							gameObjects: [object],
						});
						ghosts.push(ai);
						scene.grid.setCell({
							row: position.y,
							column: position.x,
							value: ai,
						});
						ai['grid'] = scene.grid;
						ai['scatterTarget'] = additional.scatterTarget;
					}
					break;
				case 'pacman':
					{
						if (pacman) {
							throw new Error(
								'More than one pacman is not allowed'
							);
						}
						let [object, ai] = scene.createPacman({
							position,
							texture,
							scale,
							rotation,
							cellSize: json.grid.cells.size,
							offset: json.grid.offset,
							rows: json.grid.rows,
							columns: json.grid.columns,
							color,
						});
						scene.addGameObjects({
							gameObjects: [object],
						});
						pacman = ai;
						scene.grid.setCell({
							row: position.y,
							column: position.x,
							value: ai,
						});
						ai['grid'] = scene.grid;
					}
					break;
				default:
					throw new Error('Unrecognized Entity type');
			}
		}
		if (!pacman) {
			throw new Error('Missing pacman');
		}
		ghosts.forEach(g => (g['pacman'] = pacman!));
		portals
			.flatMap((v, i) => portals.slice(i + 1).map(s => [v, s]))
			.forEach(([a, b]) => {
				if (a['linkId'] === b['linkId']) {
					a['targets'].push(b);
					b['targets'].push(a);
				}
			});

		return scene;
	}

	resolveCollisions(): this {
		// TODO: Fix scene resolve collisions
		// Hack for regaining performance
		const data = this.gameObjects.reduce(
			(prev, curr) => {
				const pacman = curr.getComponent<Pacman>({
					type: Pacman,
				})?.object;
				const ghost = curr.getComponent<Ghost>({type: Ghost})?.object;
				const coin = curr.getComponent<Coin>({type: Coin})?.object;
				const wall = curr.getComponent<Wall>({type: Wall})?.object;
				const portal = curr.getComponent<Portal>({
					type: Portal,
				})?.object;
				if (pacman) {
					prev.pacman = pacman.getComponent<AABB>({type: AABB});
				}
				if (ghost) {
					const aabb = ghost.getComponent<AABB>({type: AABB});
					if (aabb?.enabled) {
						prev.ghosts.push(aabb);
					}
				}
				if (coin) {
					const aabb = coin.getComponent<AABB>({type: AABB});
					if (aabb?.enabled) {
						prev.coins.push(aabb);
					}
				}
				if (wall) {
					const aabb = wall.getComponent<AABB>({type: AABB});
					if (aabb?.enabled) {
						prev.walls.push(aabb);
					}
				}
				if (portal) {
					const aabb = portal.getComponent<AABB>({type: AABB});
					if (aabb?.enabled) {
						prev.portals.push(aabb);
					}
				}
				return prev;
			},
			{
				ghosts: [],
				coins: [],
				walls: [],
				portals: [],
			} as {
				pacman?: AABB;
				ghosts: AABB[];
				coins: AABB[];
				walls: AABB[];
				portals: AABB[];
			}
		);

		for (let aabb of [
			...data.ghosts,
			...data.walls,
			...data.coins,
			...data.portals,
		]) {
			if (data.pacman?.Intersects({other: aabb})) {
				data.pacman.object
					.getComponents<Component>({type: Component})
					.forEach(c => c.onIntersection({gameObject: aabb.object}));
				aabb.object
					.getComponents<Component>({type: Component})
					.forEach(c =>
						c.onIntersection({gameObject: data.pacman!.object})
					);
			}
		}
		return this;
	}
}
