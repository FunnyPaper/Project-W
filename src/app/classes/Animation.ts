import {Time} from './Time';

export interface IAnimationData {
	state(): void;
	time: number;
}

export type FrameEndCallback = () => void;

/**
 * Representation for single animation
 */
export class Animation {
	//TODO: animationEndEvent
	//TODO: looping
	#name: string = '';
	#data: IAnimationData[] = [];
	#index: number = 0;
	#time: number = 0;
	#stop: boolean = false;
	frameEndEvent: FrameEndCallback[] = [];

	/**
	 * Constructs animation
	 * @param {object} obj
	 * @param {string} obj.name Animation's name
	 * @param {IAnimationData[]} obj.data Animation's frames data
	 */
	constructor({name, data}: {name: string; data: IAnimationData[]}) {
		this.#name = name;
		this.#data = data;
	}

	/**
	 * Update animation state
	 */
	update(): void {
		if (!this.#stop) {
			if (this.#time >= this.#data[this.frameIndex].time) {
				this.#onFrameEnd();
			}
			this.#time += Time.deltaTime;
		}
	}

	/**
	 * Prevents animations updating
	 */
	stop(): void {
		this.#stop = true;
	}

	/**
	 * Resumes animations
	 */
	play(): void {
		this.#stop = false;
	}

	/**
	 * Resets animation to first frame
	 */
	reset(): void {
		this.frameIndex = 0;
	}

	/**
	 * Instruction called after frame end
	 */
	#onFrameEnd(): void {
		this.frameEndEvent.forEach(func => func());
		this.#data[this.frameIndex].state();
		this.#time = 0;
		this.frameIndex++;
	}

	get name(): string {
		return this.#name;
	}
	get frameIndex(): number {
		return this.#index;
	}
	set frameIndex(value: number) {
		if (value >= this.#data.length) {
			this.#index = 0;
		} else if (value < 0) {
			this.#index = this.#data.length - 1;
		} else {
			this.#index = value;
		}
	}
}
