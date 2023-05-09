import {AABB} from '../classes/AABB';
import {GameObject} from '../classes/GameObject';
import {SpriteRenderer} from '../classes/SpriteRenderer';
import {Component} from './../classes/Component';
import {Pacman} from './Pacman';
import {AudioListener} from '../classes/AudioListener';
import * as Picked from '../../assets/audio/coin.wav';

export class Coin extends Component {
	protected renderer!: SpriteRenderer;
	protected aabb!: AABB;
	protected static coins: number = 0;
	protected audio!: AudioListener;

	start({input}: {input: HTMLElement}): void {
		this.renderer = this.Transform.getComponent<SpriteRenderer>({
			type: SpriteRenderer,
		})!;
		this.aabb = this.Transform.getComponent<AABB>({type: AABB})!;
		this.audio = this.Transform.getComponent<AudioListener>({
			type: AudioListener,
		});
		Coin.coins++;
	}

	onIntersection({gameObject}: {gameObject: GameObject}): void {
		if (gameObject.getComponent<Pacman>({type: Pacman})) {
			this.renderer.enabled = false;
			this.enabled = false;
			this.aabb.enabled = false;

			this.audio.loop = false;
			this.audio.volume = 0.1;
			this.audio.url = Picked;
			this.audio.play();

			Coin.coins--;
			if (Coin.coins <= 0) {
				window.dispatchEvent(new Event('game_won'));
			}
		}
	}
}
