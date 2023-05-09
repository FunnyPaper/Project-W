import {TimeStruture} from './Time';
import {Animation} from './Animation';
import {Component} from './Component';

export class Transition {
	protected from?: string;
	protected to: string;
	protected triggers: Map<string, boolean>;
	protected bools: Map<string, boolean>;
	constructor({
		from,
		to,
		triggers = new Map<string, boolean>(),
		bools = new Map<string, boolean>(),
	}: {
		from?: string;
		to: string;
		triggers?: Map<string, boolean>;
		bools?: Map<string, boolean>;
	}) {
		this.from = from;
		this.to = to;
		this.triggers = triggers;
		this.bools = bools;
	}
	get From() {
		return this.from;
	}
	get To() {
		return this.to;
	}
	get Triggers() {
		return this.triggers;
	}
	get Bools() {
		return this.bools;
	}
}

/**
 * Abstarction for aniamtion managements
 */
export class Animator extends Component {
	protected animations: Map<string, Animation> = new Map();
	protected transitions: Map<string, Transition> = new Map();
	protected triggers: Map<string, boolean> = new Map();
	protected bools: Map<string, boolean> = new Map();
	protected currentAnimation?: Animation;

	/**
	 * Adds animation to animator
	 * @param {object} obj
	 * @param {Anmation} obj.animation Animation to be added
	 * @param {boolean} obj.starting Is given animation "idle"
	 */
	addAnimation({animation}: {animation: Animation}): void {
		this.animations.set(animation.Name, animation);
	}

	/**
	 * Adds trigger to animator
	 * @param {object} obj
	 * @param {string} obj.name Trigger's name
	 */
	addTrigger({name}: {name: string}): void {
		this.triggers.set(name, false);
	}

	/**
	 * Adds bool to animator
	 * @param {object} obj
	 * @param {string} obj.name Bool's name
	 */
	addBool({name}: {name: string}): void {
		this.bools.set(name, false);
	}

	/**
	 * Attaches trigger to transition
	 * @param {object} obj
	 * @param {string} obj.transition Transition getting trigger
	 * @param {string} obj.trigger Trigger to be used
	 * @param {boolean} obj.value Trigger's state to be looked
	 */
	useTrigger({
		transition,
		trigger,
		value,
	}: {
		transition: string;
		trigger: string;
		value: boolean;
	}): void {
		this.transitions.get(transition)?.Triggers.set(trigger, value);
	}

	/**
	 * Attaches bool to transition
	 * @param {object} obj
	 * @param {string} obj.transition Bool getting trigger
	 * @param {string} obj.bool Bool to be used
	 * @param {boolean} obj.value Bool's state to be looked
	 */
	useBool({
		transition,
		bool,
		value,
	}: {
		transition: string;
		bool: string;
		value: boolean;
	}): void {
		this.transitions.get(transition)?.Bools.set(bool, value);
	}

	/**
	 * Sets trigger to true
	 * @param {object} obj
	 * @param {string} obj.name Trigger to be set
	 */
	setTrigger({name}: {name: string}): void {
		this.triggers.set(name, true);
	}

	/**
	 * Resets trigger to false
	 * @param {object} obj
	 * @param {string} obj.name Trigger to be reset
	 */
	protected resetTrigger({name}: {name: string}): void {
		this.triggers.set(name, false);
	}

	/**
	 * Searches for specified trigger
	 * @param {object} obj
	 * @param {string} obj.name Trigger to be returned
	 * @returns {boolean | undefined} Trigger's current state
	 */
	getTrigger({name}: {name: string}): boolean | undefined {
		return this.triggers.get(name);
	}

	/**
	 * Sets bool to given value
	 * @param {object} obj
	 * @param {string} obj.name Bool to be set
	 * @param {boolean} obj.value Value to be assigned to bool
	 */
	setBool({name, value}: {name: string; value: boolean}): void {
		this.bools.set(name, value);
	}

	/**
	 * Searches for specified trigger
	 * @param {object} obj
	 * @param {string} obj.name Bool to be returned
	 * @returns {boolean | undefined} Bool's current state
	 */
	getBool({name}: {name: string}): boolean | undefined {
		return this.bools.get(name);
	}

	/**
	 * Adds transition between animations
	 * @param {object} obj
	 * @param {string} obj.name Transition's name
	 * @param {string} obj.from Current animation
	 * @param {string} obj.to Next animation
	 */
	addTransition({
		name,
		from,
		to,
	}: {
		name: string;
		from?: string;
		to: string;
	}): void {
		this.transitions.set(
			name,
			new Transition({
				from,
				to,
			})
		);
	}

	/**
	 * Deletes transition between animations
	 * @param {object} obj
	 * @param {string} obj.name Transition's name
	 */
	removeTransition({name}: {name: string}): void {
		this.transitions.delete(name);
	}

	removeAnimation({name}: {name: string}) {
		this.animations.delete(name);
	}

	removeTrigger({name}: {name: string}) {
		this.triggers.delete(name);
	}

	removeBool({name}: {name: string}) {
		this.bools.delete(name);
	}

	setCurrentAnimation({name}: {name: string}) {
		this.currentAnimation = this.animations.get(name);
	}

	start({input}: {input: HTMLElement}) {
		this.addAnimation({animation: new Animation({name: 'idle'})});
		this.setCurrentAnimation({name: 'idle'});
	}

	/**
	 * Method override
	 */
	update({time}: {time: TimeStruture}) {
		if (
			!this.currentAnimation?.atomic ||
			(this.currentAnimation?.atomic && this.currentAnimation?.Finished)
		) {
			let triggers!: [string, boolean][];

			// Get next valid animation
			const next = this.animations.get(
				[...this.transitions.values()].find(t => {
					// Store triggers for later use
					triggers = [...t.Triggers.entries()];
					// Test for current animation's transition's triggers and bools
					const triggersPass = triggers.every(
						([key, value]) => this.triggers.get(key) === value
					);
					const boolsPass = [...t.Bools.entries()].every(
						([key, value]) => this.bools.get(key) === value
					);
					// Next animation is valid if it's previous state is equal to current state and both triggers and bools pass
					return (
						(!t.From ||
							this.animations.get(t.From) ===
								this.currentAnimation) &&
						triggersPass &&
						boolsPass
					);
				})?.To!
			);

			if (next) {
				// Reset triggers of current animation
				triggers?.forEach(([name, ...rest]) =>
					this.resetTrigger({name})
				);
				this.currentAnimation = next;
			}
		}

		this.currentAnimation?.advance({time});
	}
}
