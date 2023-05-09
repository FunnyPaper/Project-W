import {Component} from './Component';

/**
 * Abstraction for sound making behavior
 */
export class AudioListener extends Component {
	private audio: HTMLAudioElement = new Audio();

	/**
	 * Plays currently load music file
	 */
	play() {
		this.audio.play();
	}

	/**
	 * Pause currently load music file
	 */
	pause() {
		this.audio.pause();
	}

	/**
	 * Resets currently load music file
	 */
	reset() {
		this.pause();
		this.audio.currentTime = 0;
	}

	set volume(value: number) {
		this.audio.volume = value;
	}
	set url(value: string) {
		this.audio.src = value;
	}
	set loop(value: boolean) {
		this.audio.loop = value;
	}
	get loop(): boolean {
		return this.audio.loop;
	}
}
