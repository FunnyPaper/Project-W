import {Ghost} from './Ghost';

export class Inky extends Ghost {
	protected getGridTarget(): {x: number; y: number} {
		const blinky = Ghost.ghosts.get('blinky')!;
		const blinkyGridPosition = this.grid.convertPoint({
			...blinky.Transform.Position,
			scale: blinky.Transform.Scale,
		});
		const pivotPoint = this.getGridTargetInFrontOfPacman({spaces: 2});
		return this.pacmanInRange
			? {
					x: pivotPoint.x + (pivotPoint.x - blinkyGridPosition.x),
					y: pivotPoint.y + (pivotPoint.y - blinkyGridPosition.y),
			  }
			: this.scatterTarget;
	}
}
