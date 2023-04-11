/**
 * Global Time structure for time management
 */
class _Time {
	#deltaTime: number = 0;
	#lastUpdate: number = 0;
	#now: number = 0;

	init(): void {
		this.#deltaTime = 0;
		this.#lastUpdate = Date.now();
		this.#now = Date.now();
	}
	tick(): void {
		this.#now = Date.now();
        this.#deltaTime = this.#now - this.#lastUpdate;
        this.#lastUpdate = this.#now;
	}

	get deltaTime(): number { return this.#deltaTime; }
	get lastUpdate(): number { return this.#lastUpdate; }
	get now(): number { return this.#now; }
}

export const Time = new _Time();
