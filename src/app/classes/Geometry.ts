import {AABB} from './AABB';
import {Buffer} from './Buffer';
import {VertexArray} from './VertexArray';
import {context as gl} from './WebGL2';

export abstract class Geometry {
	protected colors!: Float32Array;
	protected vertices!: Float32Array;
	protected triangles!: Uint16Array;
	protected uvs!: Float32Array;

	protected vao: VertexArray;
	protected colorsBuffer: Buffer;
	protected verticesBuffer: Buffer;
	protected trianglesBuffer: Buffer;
	protected uvsBuffer: Buffer;

	Bounds!: AABB;

	constructor() {
		this.vao = new VertexArray();
		this.colorsBuffer = new Buffer({
			dataInfo: {
				bufferType: gl().ARRAY_BUFFER,
				dataType: gl().FLOAT,
				usage: gl().STATIC_DRAW,
				normalize: false,
				vertexSize: 4 * Float32Array.BYTES_PER_ELEMENT,
				attribute: [{elementsCount: 4, elementsOffset: 0}],
			},
		});
		this.verticesBuffer = new Buffer({
			dataInfo: {
				bufferType: gl().ARRAY_BUFFER,
				dataType: gl().FLOAT,
				usage: gl().STATIC_DRAW,
				normalize: false,
				vertexSize: 3 * Float32Array.BYTES_PER_ELEMENT,
				attribute: [{elementsCount: 3, elementsOffset: 0}],
			},
		});
		this.trianglesBuffer = new Buffer({
			dataInfo: {
				bufferType: gl().ELEMENT_ARRAY_BUFFER,
				dataType: gl().UNSIGNED_SHORT,
				usage: gl().STATIC_DRAW,
				normalize: true,
				vertexSize: 1 * Uint16Array.BYTES_PER_ELEMENT,
				attribute: [{elementsCount: 1, elementsOffset: 0}],
			},
		});
		this.uvsBuffer = new Buffer({
			dataInfo: {
				bufferType: gl().ARRAY_BUFFER,
				dataType: gl().FLOAT,
				usage: gl().STATIC_DRAW,
				normalize: false,
				vertexSize: 2 * Float32Array.BYTES_PER_ELEMENT,
				attribute: [{elementsCount: 2, elementsOffset: 0}],
			},
		});
		this.vao.setBuffers({
			buffers: new Set<Buffer>([
				this.colorsBuffer,
				this.verticesBuffer,
				this.trianglesBuffer,
				this.uvsBuffer,
			]),
		});
	}

	set Colors(value: Float32Array) {
		this.colors = value;
		this.colorsBuffer.setData({data: value});
	}

	get Colors() {
		return this.colors;
	}

	set Vertices(value: Float32Array) {
		this.vertices = value;
		this.verticesBuffer.setData({data: value});
	}

	get Vertices() {
		return this.vertices;
	}

	set Triangles(value: Uint16Array) {
		this.triangles = value;
		this.trianglesBuffer.setData({data: value});
	}

	get Triangles() {
		return this.triangles;
	}

	set Uvs(value: Float32Array) {
		this.uvs = value;
		this.uvsBuffer.setData({data: value});
	}

	get Uvs() {
		return this.uvs;
	}

	get VAO() {
		return this.vao;
	}

	get ColorsBuffer() {
		return this.colorsBuffer;
	}

	get VerticesBuffer() {
		return this.verticesBuffer;
	}

	get TrianglesBuffer() {
		return this.trianglesBuffer;
	}

	get UvsBuffer() {
		return this.uvsBuffer;
	}
}
