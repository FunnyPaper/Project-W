import {Ghost} from './Ghost';

export class Pinky extends Ghost {
	protected getGridTarget(): {x: number; y: number} {
		return this.pacmanInRange
			? this.getGridTargetInFrontOfPacman({spaces: 4})
			: this.scatterTarget;
	}
}
