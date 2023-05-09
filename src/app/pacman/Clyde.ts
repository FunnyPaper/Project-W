import {Ghost} from './Ghost';

export class Clyde extends Ghost {
	protected getGridTarget(): {x: number; y: number} {
		const pacmanCoord = this.grid.convertPoint({
			...this.pacman.Transform.Position,
			scale: this.pacman.Transform.Scale,
		});
		return !this.pacmanInRange ? pacmanCoord : this.scatterTarget;
	}
}
