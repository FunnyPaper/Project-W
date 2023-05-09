export type GlyphInfo = Map<
	string,
	{x: number; y: number; width: number; height: number}
>;

export type FontInfo = {
	spaceWidth: number;
	spacing: number;
	glyphsInfo: GlyphInfo;
};

export class FontAtlas {
	protected fontInfo: FontInfo;
	protected source: HTMLCanvasElement | HTMLImageElement;
	constructor({
		source,
		fontInfo,
	}: {
		source: HTMLCanvasElement | HTMLImageElement;
		fontInfo: FontInfo;
	}) {
		this.source = source;
		this.fontInfo = fontInfo;
	}

	composeText({text}: {text: string}) {
		let positions: Float32Array = new Float32Array(text.length * 6 * 2);
		let uvs: Float32Array = new Float32Array(text.length * 6 * 2);
		let bufferOffset = 0;
		let verticalOffset = 0;
		let maxX = this.source.width;
		let maxY = this.source.height;
		for (let i = 0; i < text.length; i++) {
			let letter = text[i];
			let glyphInfo = this.fontInfo.glyphsInfo.get(letter);
			if (glyphInfo) {
				let x2 = verticalOffset + glyphInfo.width;
				let u1 = glyphInfo.x / maxX;
				let v1 = (glyphInfo.y + glyphInfo.height - 1) / maxY;
				let u2 = (glyphInfo.x + glyphInfo.width - 1) / maxX;
				let v2 = glyphInfo.y / maxY;
				// Sets positions
				positions[bufferOffset + 0] = verticalOffset;
				positions[bufferOffset + 1] = 0;
				uvs[bufferOffset + 0] = u1;
				uvs[bufferOffset + 1] = v1;

				positions[bufferOffset + 2] = x2;
				positions[bufferOffset + 3] = 0;
				uvs[bufferOffset + 2] = u2;
				uvs[bufferOffset + 3] = v1;

				positions[bufferOffset + 4] = verticalOffset;
				positions[bufferOffset + 5] = glyphInfo.height;
				uvs[bufferOffset + 4] = u1;
				uvs[bufferOffset + 5] = v2;

				positions[bufferOffset + 6] = verticalOffset;
				positions[bufferOffset + 7] = glyphInfo.height;
				uvs[bufferOffset + 6] = u1;
				uvs[bufferOffset + 7] = v2;

				positions[bufferOffset + 8] = x2;
				positions[bufferOffset + 9] = 0;
				uvs[bufferOffset + 8] = u2;
				uvs[bufferOffset + 9] = v1;

				positions[bufferOffset + 10] = x2;
				positions[bufferOffset + 11] = glyphInfo.height;
				uvs[bufferOffset + 10] = u2;
				uvs[bufferOffset + 11] = v2;

				bufferOffset += 12;
				verticalOffset += glyphInfo.width + this.fontInfo.spacing;
			} else {
				verticalOffset += this.fontInfo.spaceWidth;
			}
		}
		// Return arrays of sprites
		return {
			positions: new Float32Array(positions.buffer, 0, bufferOffset),
			uvs: new Float32Array(uvs.buffer, 0, bufferOffset),
			verticesCount: bufferOffset / 2,
		};
	}
}
