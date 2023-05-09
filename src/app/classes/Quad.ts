import {vec2} from 'gl-matrix';
import {AABB} from './AABB';
import {Geometry} from './Geometry';

export class Quad extends Geometry {
	constructor() {
		super();
		this.Colors = new Float32Array([
			1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0,
		]);

		this.Vertices = new Float32Array([
			-0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0,
		]);

		this.Triangles = new Uint16Array([0, 1, 2, 0, 2, 3]);

		this.Uvs = new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]);

		this.Bounds = new AABB({
			center: vec2.create(),
			size: vec2.fromValues(1, 1),
		});
	}
}
