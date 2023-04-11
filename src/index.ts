import {WebGL2, gl} from './app/classes/WebGL2';
import {ResourceManager} from './app/classes/ResourceManager';
import {mat4, glMatrix as utility} from 'gl-matrix';

import './styles.scss';
import * as fragment from './assets/shaders/fragment.fs.glsl';
import * as vertex from './assets/shaders/vertex.vs.glsl';
import * as Img from './assets/textures/1.png';

window.addEventListener('load', async () => {
	// Init WebGL2 context
	WebGL2.init({css: '#gl-canvas'})
		.setFlipY({flipImages: true})
		.setColor({r: 1.0, g: 1.0, b: 1.0, a: 1.0})
		.setSize({width: 640, height: 480});

	// Create shader program
	const program = await ResourceManager.createShaderFromFile({
		name: 'program',
		validate: true,
		stages: [
			{
				name: 'vertex-shader',
				type: gl().VERTEX_SHADER,
				file: vertex,
			},
			{
				name: 'fragment-shader',
				type: gl().FRAGMENT_SHADER,
				file: fragment,
			},
		],
	});

	// Init and set buffer data
	const vertices = new Float32Array([
		-0.5, -0.5, 0, 0, 0, -0.5, 0.5, 0, 0, 1, 0.5, 0.5, 0, 1, 1, 0.5, -0.5,
		0, 1, 0,
	]);
	const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

	// Create and bind buffers (+VAO)
	ResourceManager.createVertexArray({
		name: 'VAO',
		buffers: new Set([
			ResourceManager.createBuffer({
				name: 'VBO',
				bufferType: gl().ARRAY_BUFFER,
				dataType: gl().FLOAT,
				usage: gl().STATIC_DRAW,
			}).setData({
				data: vertices,
			}),
			ResourceManager.createBuffer({
				name: 'EBO',
				bufferType: gl().ELEMENT_ARRAY_BUFFER,
				dataType: gl().UNSIGNED_SHORT,
				usage: gl().STATIC_DRAW,
			}).setData({
				data: indices,
			}),
		]),
	}).bind();

	// Init mvp data
	const model = mat4.create();
	const view = mat4.create();
	const projection = mat4.create();
	const mvp = mat4.create();

	mat4.translate(model, model, [50, 50, 0]);
	mat4.rotate(model, model, utility.toRadian(0), [0, 0, 1]);
	mat4.scale(model, model, [100, 100, 0]);

	mat4.lookAt(view, [0, 0, 0], [0, 0, 0], [0, 1, 0]);
	mat4.ortho(projection, 0, gl().canvas.width, 0, gl().canvas.height, -1, 1);

	mat4.multiply(mvp, mvp, projection);
	mat4.multiply(mvp, mvp, view);
	mat4.multiply(mvp, mvp, model);

	// Set program attributes and/or uniforms
	program
		.bind()
		.setUniformMatrix4f({
			name: 'mvp',
			value: mvp,
		})
		.setUniform1i({
			name: 'sampler',
			value: 0,
		});

	// Populate vertex attributes with data
	const VBO = ResourceManager.getBuffer({name: 'VBO'});
	program.setAttribute({
		name: 'aPosition',
		elementsCount: 3,
		dataType: VBO.getDataType(),
		vertexSize: 5 * Float32Array.BYTES_PER_ELEMENT,
	});

	program.setAttribute({
		name: 'aTexture',
		elementsCount: 2,
		dataType: VBO.getDataType(),
		vertexSize: 5 * Float32Array.BYTES_PER_ELEMENT,
		componentOffset: 3 * Float32Array.BYTES_PER_ELEMENT,
	});

	// Loading image
	(
		await ResourceManager.createTexture2DFromFile({
			name: 'Image',
			source: Img,
			alpha: false,
		})
	).bind();

	// Gameloop
	requestAnimationFrame(function loop() {
		// input()
		// update()
		// render()
		WebGL2.clear();
		gl().drawElements(
			gl().TRIANGLES,
			indices.length,
			gl().UNSIGNED_SHORT,
			0
		);
		requestAnimationFrame(loop);
	});

	// Reclaim resources
	// ResourceManager.clear();
});
