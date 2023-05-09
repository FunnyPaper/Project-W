/**
 * Time management
 */
export class Time {
	protected deltaTime: number = 0;
	protected lastUpdate: number = 0;
	protected now: number = 0;
	static scale: number = 1;

	init(): void {
		Time.scale = 1;
		this.deltaTime = 0;
		this.lastUpdate = Date.now();
		this.now = Date.now();
	}
	tick(): void {
		this.now = Date.now();
		this.deltaTime = this.now - this.lastUpdate;
		this.lastUpdate = this.now;
	}

	get DeltaTime(): number {
		return this.deltaTime * Time.scale;
	}
	get LastUpdate(): number {
		return this.lastUpdate;
	}
	get Now(): number {
		return this.now;
	}
}

export type TimeStruture = {
	DeltaTime: number;
	LastUpdate: number;
	Now: number;
};
