import {Atlas} from './Atlas';

export class SpriteAtlas extends Atlas {
	/**
	 * Crops sprite sheet according to given parameters
	 * @param {object} obj
	 * @param {object} obj.prefix Sprites prefix
	 * @param {object} obj.spriteWidth Sprites width in pixels
	 * @param {object} obj.spriteHeight Sprites height in pixels
	 * @param {object} obj.rows Sprites count along x axis
	 * @param {object} obj.columns Sprites count along y axis
	 * @param {object} obj.spriteSpacing Space between consecutive sprites in pixels
	 * @param {object} obj.spriteSheetBorder Space between sprite sheet's edges and it's content
	 */
	cropEvenly({
		prefix = 'sprite_',
		spriteWidth = this.source.width,
		spriteHeight = this.source.height,
		rows = 1,
		columns = 1,
		spriteSpacing = 0,
		spriteSheetBorder = 0,
	}: {
		prefix?: string;
		spriteWidth?: number;
		spriteHeight?: number;
		rows?: number;
		columns?: number;
		spriteSpacing?: number;
		spriteSheetBorder?: number;
	} = {}) {
		const count = rows * columns;
		for (let i = 0, x = 0, y = 0; i < count; i++) {
			x =
				(i % columns) * (spriteWidth + spriteSpacing) +
				spriteSheetBorder;
			y =
				(rows - 1 - ~~(i / columns)) * (spriteHeight + spriteSpacing) +
				spriteSheetBorder;
			this.crop({name: `${prefix}${i}`, x, y, spriteWidth, spriteHeight});
		}
		return this;
	}
}
