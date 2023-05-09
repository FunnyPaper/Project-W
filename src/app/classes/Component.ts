import {Transform} from './Transform';
import {GameObject} from './GameObject';
import {TimeStruture} from './Time';

/**
 * Part of objects identity
 */
export class Component {
	object!: GameObject;
	enabled: boolean = true;
	protected transform!: Transform;

	/**
	 * Starting method called inside scene
	 */
	start({input}: {input: HTMLElement}) {}

	/**
	 * Updating method called inside scene
	 */
	update({time}: {time: TimeStruture}) {}

	/**
	 * Called after AABBs' collision
	 */
	onIntersection({gameObject}: {gameObject: GameObject}) {}

	/**
	 * Called during scene finalization
	 */
	onFinalize() {}

	getComponent<T extends Component>({type}: {type: new () => T}) {
		return this.object.getComponent<T>({type});
	}

	getComponents<T extends Component>({type}: {type: new () => T}) {
		return this.object.getComponents<T>({type});
	}

	get Transform() {
		return this.object.Transform;
	}
}
