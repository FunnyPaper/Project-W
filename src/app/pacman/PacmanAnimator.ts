import {AnimationFrame} from '../classes/Animation';
import {Animator} from '../classes/Animator';
import {Animation} from '../classes/Animation';
import {ResourceManager} from '../classes/ResourceManager';
import {SpriteRenderer} from '../classes/SpriteRenderer';
import {PacmanScene} from './PacmanScene';

export class PacmanAnimator extends Animator {
	start({input}: {input: HTMLElement}): void {
		let atlas = ResourceManager.getAtlas({
			name: PacmanScene.ATLAS_NAME.pacmans,
		})!;
		let spriteRenderer = this.Transform.getComponent<SpriteRenderer>({
			type: SpriteRenderer,
		});
		const walkData = [...Array(4).keys()].map(
			(a, index) =>
				new AnimationFrame({
					state: () =>
						(spriteRenderer.sprite = atlas.getSprite({
							name: `${PacmanScene.SPRITE_PREFIXES.pacmans}${
								index + 11
							}`,
						})!),
					time: 100 * (index + 1),
				})
		);
		this.addAnimation({
			animation: new Animation({
				name: 'walk',
				data: walkData,
			}),
		});
		const deathData = [...Array(11).keys()].map(
			(a, index) =>
				new AnimationFrame({
					state: () =>
						(spriteRenderer.sprite = atlas.getSprite({
							name: `${PacmanScene.SPRITE_PREFIXES.pacmans}${index}`,
						})!),
					time: 100 * (index + 1),
				})
		);
		deathData.push(
			new AnimationFrame({
				state: () => (spriteRenderer.sprite = undefined),
				time: 100 * 12,
			})
		);
		deathData.push(
			new AnimationFrame({
				state: () => window.dispatchEvent(new Event('game_over')),
				time: 100 * 13,
			})
		);
		this.addAnimation({
			animation: new Animation({
				name: 'death',
				data: deathData,
				repeat: false,
			}),
		});
		this.addTrigger({name: 'idle'});
		this.addTrigger({name: 'walk'});
		this.addTrigger({name: 'death'});

		this.addTransition({name: 'idle', to: 'idle'});
		this.addTransition({name: 'walk', to: 'walk'});
		this.addTransition({name: 'death', to: 'death'});

		this.useTrigger({transition: 'idle', trigger: 'idle', value: true});
		this.useTrigger({transition: 'walk', trigger: 'walk', value: true});
		this.useTrigger({transition: 'walk', trigger: 'death', value: false});
		this.useTrigger({transition: 'death', trigger: 'death', value: true});

		super.start({input});
	}
}
