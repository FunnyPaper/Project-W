import {Component} from './Component';
import {vec2} from 'gl-matrix';

export class AABB extends Component {
	private center: vec2;
	private size: vec2;
	constructor({
		center = vec2.create(),
		size = vec2.create(),
	}: {center?: vec2; size?: vec2} = {}) {
		super();
		this.center = center;
		this.size = size;
	}

	ClosestPoint({point}: {point: vec2}): {x: number; y: number} {
		const [max, min] = [this.Max, this.Min];
		return {
			x: Math.min(Math.max(point[0], max.x), min.x),
			y: Math.min(Math.max(point[1], max.y), min.y),
		};
	}

	Contains({point}: {point: vec2}): boolean {
		const closest = this.ClosestPoint({point});
		return closest.x === point[0] && closest.y === point[1];
	}

	Encapsulate({point}: {point: vec2}): void {
		if (!this.Contains({point})) {
			this.size[0] = Math.abs(point[0] - this.Center.x);
			this.size[1] = Math.abs(point[1] - this.Center.y);
		}
	}

	Expand({amount}: {amount: number}): void {
		this.size[0] += amount;
		this.size[1] += amount;
	}

	Intersects({other}: {other: AABB}): boolean {
		const a = {min: this.Min, max: this.Max};
		const b = {min: other.Min, max: other.Max};
		return (
			a.min.x < b.max.x &&
			a.max.x > b.min.x &&
			a.min.y < b.max.y &&
			a.max.y > b.min.y
		);
	}

	Collides({point}: {point: vec2}): boolean {
		const self = {min: this.Min, max: this.Max};
		return (
			point[0] <= self.max.x &&
			point[0] >= self.min.x &&
			point[1] <= self.max.y &&
			point[1] >= self.min.y
		);
	}

	get Center(): {x: number; y: number} {
		return {
			x: this.center[0] + this.Transform.Position.x,
			y: this.center[1] + this.Transform.Position.y,
		};
	}
	get Size(): {x: number; y: number} {
		return {x: this.size[0], y: this.size[1]};
	}
	get Extents(): {x: number; y: number} {
		return {x: this.size[0] / 2, y: this.size[1] / 2};
	}
	get Max(): {x: number; y: number} {
		return {
			x: this.Center.x + this.Extents.x,
			y: this.Center.y + this.Extents.y,
		};
	}
	get Min(): {x: number; y: number} {
		return {
			x: this.Center.x - this.Extents.x,
			y: this.Center.y - this.Extents.y,
		};
	}
}
