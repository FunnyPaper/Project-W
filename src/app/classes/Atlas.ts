import {Quad} from './Quad';
import {Texture2D} from './Texture2D';
import {context as gl} from './WebGL2';

export class Sprite {
	quad!: Quad;
	texture!: Texture2D;

	updateTexture({texture}: {texture: HTMLCanvasElement | HTMLImageElement}) {
		this.texture.generate({source: texture});
	}
}

export abstract class Atlas {
	protected sprites = new Map<string, Sprite>();
	protected source: HTMLCanvasElement | HTMLImageElement;
	protected texture: Texture2D = new Texture2D();

	/**
	 * Constructs manager for sprite sheet
	 * @param {object} obj
	 * @param {HTMLCanvasElement | HTMLImageElement} obj.source Loaded Image object
	 */
	constructor({
		source,
		alpha = false,
		premultiplyAlpha = false,
	}: {
		source: HTMLCanvasElement | HTMLImageElement;
		alpha?: boolean;
		premultiplyAlpha?: boolean;
	}) {
		this.source = source;
		this.texture = new Texture2D();
		this.texture.premultiplyAlpha = premultiplyAlpha;
		if (alpha) {
			this.texture.format = gl().RGBA;
			this.texture.internalFormat = gl().RGBA;
		}
		this.texture.generate({source: this.source});
	}

	/**
	 * Crops single sprite from sprite sheet
	 * @param {object} obj
	 * @param {string} obj.name Sprite's name
	 * @param {number} obj.x Sprite's x texture coordinate
	 * @param {number} obj.y Sprite's y texture coordinate
	 */
	crop({
		name = 'sprite',
		x = 0,
		y = 0,
		spriteWidth = this.source.width,
		spriteHeight = this.source.height,
	}: {
		name?: string;
		x?: number;
		y?: number;
		spriteWidth?: number;
		spriteHeight?: number;
	} = {}) {
		const sprite = new Sprite();
		sprite.texture = this.texture;
		sprite.quad = new Quad();
		// calculate new uvs
		const uvs = [
			x / this.source.width,
			(x + spriteWidth) / this.source.width,
			y / this.source.height,
			(y + spriteHeight) / this.source.height,
		];
		sprite.quad.Uvs = new Float32Array([
			uvs[0],
			uvs[2],
			uvs[0],
			uvs[3],
			uvs[1],
			uvs[3],
			uvs[1],
			uvs[2],
		]);
		this.sprites.set(name, sprite);
		return this;
	}

	/**
	 * Searches for specified sprite
	 * @param {object} obj
	 * @param {string} obj.name Sprite's name
	 * @returns Specified sprite instance
	 */
	getSprite({name}: {name: string}) {
		return this.sprites.get(name);
	}

	/**
	 * Searches for specified sprites
	 * @param {object} obj
	 * @param {string[]} obj.names Array of sprite's names
	 * @returns Specified sprite instances
	 */
	getSprites({names}: {names: string[]}) {
		return [...this.sprites.entries()]
			.filter(([key, _]) => names.includes(key))
			.map(([_, value]) => value);
	}

	delete() {
		this.texture.delete();
	}
}
