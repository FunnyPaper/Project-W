import {mat4} from 'gl-matrix';
import {Renderer} from './Renderer';
import {ResourceManager} from './ResourceManager';
import {context as gl} from './WebGL2';
import {Sprite} from './Atlas';

export class SpriteRenderer extends Renderer {
	sprite?: Sprite;
	color: {r: number; g: number; b: number; a: number} = {
		r: 1.0,
		g: 1.0,
		b: 1.0,
		a: 1.0,
	};
	protected viewMatrix: mat4 = mat4.create();
	protected projectionMatrix: mat4 = mat4.create();
	constructor() {
		super();
		mat4.lookAt(this.viewMatrix, [0, 0, 0], [0, 0, 0], [0, 1, 0]);
		mat4.ortho(
			this.projectionMatrix,
			-gl().canvas.width / 2,
			gl().canvas.width / 2,
			-gl().canvas.height / 2,
			gl().canvas.height / 2,
			-1,
			1
		);
		this.shader = ResourceManager.getShader({name: 'sprite-shader'});
	}

	render(): void {
		if (!this.shader || !this.sprite) return;

		const mvp = mat4.create();
		mat4.multiply(mvp, mvp, this.projectionMatrix);
		mat4.multiply(mvp, mvp, this.viewMatrix);
		mat4.multiply(mvp, mvp, this.Transform.ModelMatrix);

		this.shader
			.bind()
			.setUniform1i({
				name: 'uTexture',
				value: 0,
			})
			.setUniformMatrix4f({
				name: 'mvp',
				value: mvp,
			})
			.setUniform4fv({
				name: 'uColor',
				value: new Float32Array([
					this.color.r,
					this.color.g,
					this.color.b,
					this.color.a,
				]),
			});

		const {quad, texture} = this.sprite;
		if (texture) {
			this.shader.setUniform1i({name: 'textureSet', value: 1});
		}
		texture.bind();
		quad.VAO.bind();

		// Populate vertex attributes with data
		const ColorsBUffer = quad.ColorsBuffer.bind();
		this.shader.setAttribute({
			name: 'aColors',
			elementsCount:
				ColorsBUffer.getBufferDataInfo().attribute[0].elementsCount,
			dataType: ColorsBUffer.getBufferDataInfo().dataType,
			vertexSize: ColorsBUffer.getBufferDataInfo().vertexSize,
		});
		const VerticesBUffer = quad.VerticesBuffer.bind();
		this.shader.setAttribute({
			name: 'aVertices',
			elementsCount:
				VerticesBUffer.getBufferDataInfo().attribute[0].elementsCount,
			dataType: VerticesBUffer.getBufferDataInfo().dataType,
			vertexSize: VerticesBUffer.getBufferDataInfo().vertexSize,
		});
		const UvsBuffer = quad.UvsBuffer.bind();
		this.shader.setAttribute({
			name: 'aUvs',
			elementsCount:
				UvsBuffer.getBufferDataInfo().attribute[0].elementsCount,
			dataType: UvsBuffer.getBufferDataInfo().dataType,
			vertexSize: UvsBuffer.getBufferDataInfo().vertexSize,
		});

		gl().drawElements(
			gl().TRIANGLES,
			quad.Triangles.length,
			gl().UNSIGNED_SHORT,
			0
		);
	}
}
