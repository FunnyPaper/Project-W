import {vec2} from 'gl-matrix';
import {Transform} from './Transform';
import {Component} from './Component';

export class GameObject {
	private transform: Transform;
	private components: Component[] = [];
	constructor({
		position = vec2.create(),
		rotation = 0,
		scale = vec2.create(),
		components = [],
	}: {
		position?: vec2;
		rotation?: number;
		scale?: vec2;
		components?: Component[];
	} = {}) {
		this.transform = new Transform({
			position,
			rotation,
			scale,
			object: this,
		});
		this.addComponent({components});
	}

	/**
	 * Adds components to object
	 * @param {object} obj
	 * @param {Component[]} obj.components Components to be added to object
	 */
	addComponent({components = []}: {components: Component[]}) {
		this.components = [...this.components, ...components];
		components.forEach((c: Component) => (c.object = this));
	}

	/**
	 * Removes components from object
	 * @param {object} obj
	 * @param {Component[]} obj.components Components to be removed from object
	 */
	removeComponent({components}: {components: Component[]}) {
		components.forEach(c =>
			this.components.splice(this.components.indexOf(c), 1)
		);
	}

	/**
	 * Searches for specified component
	 * @param {object} obj
	 * @param {Component} obj.type Searched component
	 * @returns Component instance
	 */
	getComponent<T extends Component>({type}: {type: new () => T}): T {
		return this.components.find(c => c instanceof type) as T;
	}

	/**
	 * Searches for specified component
	 * @param {object} obj
	 * @param {Component} obj.type Searched component
	 * @returns Component instance
	 */
	getComponents<T extends Component>({type}: {type: new () => T}): T[] {
		return this.components.filter(c => c instanceof type) as T[];
	}

	get Transform() {
		return this.transform;
	}
}
