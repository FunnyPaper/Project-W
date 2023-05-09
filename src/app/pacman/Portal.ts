import {AudioListener} from '../classes/AudioListener';
import {Component} from '../classes/Component';
import {GameObject} from '../classes/GameObject';
import {TimeStruture} from '../classes/Time';
import {Pacman} from './Pacman';
import * as Teleport from '../../assets/audio/portal.wav';
import {Ghost} from './Ghost';

export class Portal extends Component {
	protected targets: Portal[] = [];
	protected linkId!: number;
	protected audio!: AudioListener;
	protected intersectionFrames: {prev: boolean; curr: boolean} = {
		prev: false,
		curr: false,
	};

	start({input}: {input: HTMLElement}): void {
		this.audio = this.Transform.getComponent<AudioListener>({
			type: AudioListener,
		})!;
	}

	update({time}: {time: TimeStruture}): void {
		this.intersectionFrames.prev = this.intersectionFrames.curr;
		this.intersectionFrames.curr = false;
	}

	onIntersection({gameObject}: {gameObject: GameObject}): void {
		if (
			gameObject.Transform.getComponent<Pacman>({type: Pacman}) ||
			gameObject.Transform.getComponent<Ghost>({type: Ghost})
		) {
			const portal =
				this.targets[~~(Math.random() * this.targets.length)];
			this.intersectionFrames.curr = true;
			// Next portal's intersections are continuation to current portal's intersection
			portal.intersectionFrames.curr = true;
			portal.intersectionFrames.prev = true;
			if (
				this.intersectionFrames.curr !== this.intersectionFrames.prev &&
				this.intersectionFrames.curr
			) {
				gameObject.Transform.Position = {...portal.Transform.Position};
				this.audio.loop = false;
				this.audio.volume = 0.1;
				this.audio.url = Teleport;
				this.audio.play();
			}
		}
	}
}
