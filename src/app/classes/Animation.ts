import {TimeStruture} from './Time';

export class AnimationFrame {
	protected time: number;
	protected state?: () => void;
	constructor({state, time}: {state?: () => void; time: number}) {
		this.state = state;
		this.time = time;
	}
	get Time() {
		return this.time;
	}
	get State() {
		return this.state;
	}
}

/**
 * Representation for single animation
 */
export class Animation {
	protected name: string = '';
	protected data: AnimationFrame[] = [];
	protected index: number = 0;
	protected time: number = 0;
	protected framesCompleted: number = 0;
	repeat: boolean;
	atomic: boolean;

	/**
	 * Constructs animation
	 * @param {object} obj
	 * @param {string} obj.name Animation's name
	 * @param {AnimationFrame[]} obj.data Animation's frames data
	 */
	constructor({
		name,
		data = [],
		repeat = true,
		atomic = false,
	}: {
		name: string;
		data?: AnimationFrame[];
		repeat?: boolean;
		atomic?: boolean;
	}) {
		this.name = name;
		this.data = data;
		this.repeat = repeat;
		this.atomic = atomic;
	}

	/**
	 * Resets animation to first frame
	 */
	reset(): void {
		this.FrameIndex = 0;
		this.time = 0;
		this.framesCompleted = 0;
	}

	advance({time}: {time: TimeStruture}) {
		this.time += time.DeltaTime;
		if (this.Finished && this.repeat) {
			this.reset();
		}

		if (!this.Finished && this.time >= (this.Frame?.Time || 0)) {
			this.Frame?.State?.();
			this.framesCompleted++;
			this.FrameIndex++;
		}
	}

	get Name(): string {
		return this.name;
	}
	get Finished() {
		return this.framesCompleted >= this.data.length;
	}
	get Frame() {
		return this.data[this.index];
	}
	get FrameIndex(): number {
		return this.index;
	}
	set FrameIndex(value: number) {
		if (value >= this.data.length) {
			this.index = 0;
		} else if (value < 0) {
			this.index = this.data.length - 1;
		} else {
			this.index = value;
		}
	}
}
