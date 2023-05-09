import {mat4, vec2, glMatrix as utility} from 'gl-matrix';
import {GameObject} from './GameObject';
import {Component} from './Component';

export class Transform extends Component {
	protected position: vec2;
	protected rotation: number;
	protected scale: vec2;
	protected modelMatrix: mat4 = mat4.create();
	object!: GameObject;

	constructor({
		position = vec2.create(),
		rotation = 0,
		scale = vec2.fromValues(1, 1),
		object,
	}: {
		position?: vec2;
		rotation?: number;
		scale?: vec2;
		object: GameObject;
	}) {
		super();
		this.position = position;
		this.rotation = rotation;
		this.scale = scale;
		this.object = object;
		this.calculateModelMatrix();
	}

	move({target}: {target: vec2}) {
		this.Position = {
			x: this.position[0] + target[0],
			y: this.position[1] + target[1],
		};
	}
	moveTowards({target, maxDelta}: {target: vec2; maxDelta: number}) {
		let res = {
			x: target[0] - this.Position.x,
			y: target[1] - this.Position.y,
		};

		let magnitude = Math.sqrt(res.x * res.x + res.y * res.y);
		if (magnitude <= maxDelta || magnitude <= 0) {
			this.Position = {x: target[0], y: target[1]};
		} else {
			this.Position = {
				x: this.position[0] + (res.x / magnitude) * maxDelta,
				y: this.position[1] + (res.y / magnitude) * maxDelta,
			};
		}
	}

	get Position() {
		const [x, y] = this.position;
		return {x, y};
	}

	set Position(value: {x: number; y: number}) {
		this.position = vec2.fromValues(value.x, value.y);
		this.calculateModelMatrix();
	}

	get Rotation() {
		return this.rotation;
	}

	set Rotation(value: number) {
		this.rotation = value;
		this.calculateModelMatrix();
	}

	get Scale() {
		const [x, y] = this.scale;
		return {x, y};
	}

	set Scale(value: {x: number; y: number}) {
		this.position = vec2.fromValues(value.x, value.y);
		this.calculateModelMatrix();
	}

	get ModelMatrix(): mat4 {
		return this.modelMatrix;
	}

	private calculateModelMatrix() {
		this.modelMatrix = mat4.create();
		mat4.translate(this.modelMatrix, this.modelMatrix, [
			this.position[0],
			this.position[1],
			0,
		]);
		mat4.rotate(
			this.modelMatrix,
			this.modelMatrix,
			utility.toRadian(this.rotation),
			[0, 0, 1]
		);
		mat4.scale(this.modelMatrix, this.modelMatrix, [
			this.scale[0],
			this.scale[1],
			0,
		]);
	}
}
