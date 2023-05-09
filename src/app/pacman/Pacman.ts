import {Wall} from './Wall';
import {vec2} from 'gl-matrix';
import {Animator} from '../classes/Animator';
import {TimeStruture} from '../classes/Time';
import {Component} from './../classes/Component';
import {GameObject} from '../classes/GameObject';
import {Coin} from './Coin';
import {Ghost} from './Ghost';
import {Grid} from './Grid';
import {AudioListener} from '../classes/AudioListener';
import * as Death from '../../assets/audio/death.wav';

export class Pacman extends Component {
	protected direction: {x: number; y: number} = {x: 1, y: 0};
	protected coins: number = 0;
	protected moveDelta: {x: number; y: number} = {x: 0, y: 0};
	protected animator!: Animator;
	protected speed: number = 0.075;
	protected grid!: Grid<Component>;
	protected audio!: AudioListener;
	protected lastDirection: {x: number; y: number} = {x: 1, y: 0};
	protected listener!: (event: any) => void;
	start({input}: {input: HTMLElement}): void {
		this.animator = this.Transform.getComponent<Animator>({
			type: Animator,
		})!;
		this.audio = this.Transform.getComponent<AudioListener>({
			type: AudioListener,
		});
		this.animator.setTrigger({name: 'walk'});
		this.listener = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'ArrowLeft':
					{
						this.direction = {x: -1, y: 0};
					}
					break;
				case 'ArrowRight':
					{
						this.direction = {x: 1, y: 0};
					}
					break;
				case 'ArrowUp':
					{
						this.direction = {x: 0, y: 1};
					}
					break;
				case 'ArrowDown':
					{
						this.direction = {x: 0, y: -1};
					}
					break;
			}
		};
		window.addEventListener('keydown', this.listener);
	}

	onFinalize(): void {
		window.removeEventListener('keydown', this.listener);
	}

	update({time}: {time: TimeStruture}): void {
		this.updateDirection({time});
		this.updateMoveDelta({time});
		this.updateMovement({time});
	}

	onIntersection({gameObject}: {gameObject: GameObject}): void {
		if (gameObject.getComponent<Coin>({type: Coin})) {
			this.coins++;
		}

		if (gameObject.getComponent<Ghost>({type: Ghost}) && this.enabled) {
			this.animator.setTrigger({
				name: 'death',
			});
			this.Transform.Rotation = 0;
			this.enabled = false;
			this.audio.loop = false;
			this.audio.volume = 0.1;
			this.audio.url = Death;
			this.audio.play();
		}
	}

	private updateMovement({time}: {time: TimeStruture}) {
		const lastMove = {
			x: this.lastDirection.x * time.DeltaTime * this.speed,
			y: this.lastDirection.y * time.DeltaTime * this.speed,
		};

		this.Transform.move({
			target: vec2.fromValues(lastMove.x, lastMove.y),
		});
		if (!this.validateDirection({x: 0, y: 0})) {
			this.Transform.move({
				target: vec2.fromValues(-lastMove.x, -lastMove.y),
			});
		}
		if (this.lastDirection.x == 1) {
			this.Transform.Rotation = 0;
		} else if (this.lastDirection.x == -1) {
			this.Transform.Rotation = 180;
		} else if (this.lastDirection.y == 1) {
			this.Transform.Rotation = 90;
		} else if (this.lastDirection.y == -1) {
			this.Transform.Rotation = 270;
		}
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

	private updateDirection({time}: {time: TimeStruture}) {
		const {x: deltaX, y: deltaY} = this.moveDelta;

		if (
			Math.abs(deltaX) >= this.grid.CellSize.width ||
			Math.abs(deltaY) >= this.grid.CellSize.height
		) {
			if (this.validateDirection({...this.direction})) {
				this.lastDirection = {...this.direction};
			}
			if (!this.validateDirection({...this.lastDirection})) {
				this.lastDirection = this.computeNewDirection();
				this.direction = {...this.lastDirection};
			}

			this.snapToGrid({time});
			this.moveDelta = {x: 0, y: 0};
		}
	}

	private negatePoint({x, y}: {x: number; y: number}): {
		x: number;
		y: number;
	} {
		return {
			x: -x,
			y: -y,
		};
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

	private validateDirection({x, y}: {x: number; y: number}): boolean {
		const coord = this.grid.convertPoint({
			...this.Transform.Position,
			scale: this.Transform.Scale,
		});
		const inRange = this.grid.isCoordInRange({
			row: coord.y,
			column: coord.x,
		});
		if (inRange) {
			return !this.grid.getCell<Wall>({
				row: coord.y + y,
				column: coord.x + x,
				type: Wall,
			});
		}
		return inRange;
	}

	private computeNewDirection(): {
		x: number;
		y: number;
	} {
		const direction = {
			x: this.lastDirection.y,
			y: this.lastDirection.x,
		};
		return this.validateDirection({...direction})
			? direction
			: this.negatePoint({...direction});
	}

	get LastDirection() {
		return this.lastDirection;
	}
}
