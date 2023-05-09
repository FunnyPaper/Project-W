import {Component} from '../classes/Component';
import {AudioListener} from '../classes/AudioListener';
import * as Start from '../../assets/audio/game_start.wav';
import * as Pause from '../../assets/audio/pause.wav';

/**
 * Custom behavior
 */
export class Ambient extends Component {
	protected listener!: () => void;
	protected audio!: AudioListener;
	/**
	 * Method override
	 */
	start() {
		this.audio = this.Transform.getComponent<AudioListener>({
			type: AudioListener,
		});
		this.audio.url = Start;
		this.audio.loop = false;
		this.audio.volume = 0.1;
		this.audio.play();
		this.listener = () => {
			this.audio.url = Pause;
			this.audio.loop = false;
			this.audio.volume = 0.1;
			this.audio.play();
		};
		window.addEventListener('pause', this.listener);
	}

	onFinalize(): void {
		window.removeEventListener('pause', this.listener);
	}
}
