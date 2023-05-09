import {Animator} from './../classes/Animator';
import {Pacman} from './Pacman';
import {Component} from './../classes/Component';
import {TimeStruture} from '../classes/Time';
import {SpriteRenderer} from '../classes/SpriteRenderer';
import {Grid} from './Grid';
import {Wall} from './Wall';
import {vec2} from 'gl-matrix';

export class Ghost extends Component {
	protected static ghosts: Map<string, Ghost> = new Map();
	protected speed: number = 0.03;
	protected name!: string;
	protected pacman!: Pacman;
	protected renderer!: SpriteRenderer;
	protected animator!: Animator;
	protected grid!: Grid<Component>;
	protected range!: number;
	protected scatterTarget!: {x: number; y: number};
	protected direction: {x: number; y: number} = {x: 0, y: 0};
	protected moveDelta: {x: number; y: number} = {x: 0, y: 0};

	start({input}: {input: HTMLElement}): void {
		this.renderer = this.Transform.getComponent<SpriteRenderer>({
			type: SpriteRenderer,
		})!;
		this.animator = this.Transform.getComponent<Animator>({
			type: Animator,
		})!;
		this.animator.setTrigger({name: 'walk_right'});
		Ghost.ghosts.set(this.name, this);
		this.setDirection();
	}

	update({time}: {time: TimeStruture}): void {
		this.move({time});
	}

	protected getGridTarget(): {x: number; y: number} {
		return this.pacmanInRange
			? this.getGridTargetInFrontOfPacman({spaces: 0})
			: this.scatterTarget;
	}

	protected getGridTargetInFrontOfPacman({spaces}: {spaces: number}) {
		const pacmanGridPosition = this.grid.convertPoint({
			...this.pacman.Transform.Position,
			scale: this.pacman.Transform.Scale,
		});
		const pacmanLastDirection = this.pacman.LastDirection;
		const propToChange = pacmanLastDirection.y ? 'y' : 'x';
		pacmanGridPosition[propToChange] +=
			spaces * pacmanLastDirection[propToChange];
		return pacmanGridPosition;
	}

	protected getGridNeighbour({x, y}: {x: number; y: number}) {
		const coords = [
			{x: x + 1, y},
			{x: x - 1, y},
			{x, y: y + 1},
			{x, y: y - 1},
		].filter(coord => {
			const inRange = this.grid.isCoordInRange({
				row: coord.y,
				column: coord.x,
			});
			if (inRange) {
				return !this.grid.getCell<Wall>({
					row: coord.y,
					column: coord.x,
					type: Wall,
				});
			}
			return inRange;
		});
		return coords;
	}

	protected getPossibleMoves() {
		const gridPosition = this.grid.convertPoint({
			...this.Transform.Position,
			scale: this.Transform.Scale,
		});
		const possibleMoves = this.getGridNeighbour({...gridPosition});
		return possibleMoves.filter(
			m =>
				!(
					m.x + this.direction.x == gridPosition.x &&
					m.y + this.direction.y == gridPosition.y
				)
		);
	}

	protected getBestMove({
		possibleMoves,
	}: {
		possibleMoves: {x: number; y: number}[];
	}) {
		const target = this.getGridTarget();
		let bestDistance = Infinity;
		let bestMove: {x: number; y: number} | undefined;
		possibleMoves.forEach(m => {
			const distance = this.getDistance({first: m, second: target});
			const betterMove = distance < bestDistance;
			if (betterMove) {
				bestDistance = distance;
				bestMove = m;
			}
		});
		return bestMove;
	}

	protected updateDirection({time}: {time: TimeStruture}) {
		const {x: deltaX, y: deltaY} = this.moveDelta;

		if (
			Math.abs(deltaX) >= this.grid.CellSize.width ||
			Math.abs(deltaY) >= this.grid.CellSize.height
		) {
			this.setDirection();
			this.snapToGrid({time});
			this.moveDelta = {x: 0, y: 0};
		}
	}

	private setDirection() {
		let newDirection: any = {...this.direction};
		const possibleMoves = this.getPossibleMoves();

		if (possibleMoves.length === 1) {
			newDirection = possibleMoves[0];
		} else if (possibleMoves.length > 1) {
			newDirection = this.getBestMove({possibleMoves});
		}
		const coord = this.grid.convertPoint({
			...this.Transform.Position,
			scale: this.Transform.Scale,
		});

		this.direction = {
			x: newDirection.x - coord.x,
			y: newDirection.y - coord.y,
		};

		if (this.direction.x == 1) {
			this.animator.setTrigger({name: 'walk_right'});
		} else if (this.direction.x == -1) {
			this.animator.setTrigger({name: 'walk_left'});
		} else if (this.direction.y == 1) {
			this.animator.setTrigger({name: 'walk_top'});
		} else if (this.direction.y == -1) {
			this.animator.setTrigger({name: 'walk_bottom'});
		}
	}

	private snapToGrid({time}: {time: TimeStruture}) {
		const snapped = this.grid.snapToGrid({
			...this.Transform.Position,
			scale: this.Transform.Scale,
		});
		this.Transform.moveTowards({
			target: vec2.fromValues(snapped.x, snapped.y),
			maxDelta: time.DeltaTime * this.speed * 3,
		});
	}

	private updateMovement({time}: {time: TimeStruture}) {
		const lastMove = {
			x: this.direction.x * time.DeltaTime * this.speed,
			y: this.direction.y * time.DeltaTime * this.speed,
		};

		this.Transform.move({
			target: vec2.fromValues(lastMove.x, lastMove.y),
		});
	}

	private updateMoveDelta({time}: {time: TimeStruture}) {
		this.moveDelta = {
			x:
				this.moveDelta.x +
				this.direction.x * time.DeltaTime * this.speed,
			y:
				this.moveDelta.y +
				this.direction.y * time.DeltaTime * this.speed,
		};
	}

	protected move({time}: {time: TimeStruture}) {
		this.updateDirection({time});
		this.updateMoveDelta({time});
		this.updateMovement({time});
	}

	protected getDistance({
		first,
		second,
	}: {
		first: {x: number; y: number};
		second: {x: number; y: number};
	}) {
		return ((second.x - first.x) ** 2 + (second.y - first.y) ** 2) ** 0.5;
	}

	get pacmanInRange() {
		const second = this.grid.convertPoint({
			...this.pacman.Transform.Position,
			scale: this.pacman.Transform.Scale,
		});
		const first = this.grid.convertPoint({
			...this.Transform.Position,
			scale: this.Transform.Scale,
		});
		return this.getDistance({first, second}) <= this.range;
	}
}
