import {AnimationFrame} from '../classes/Animation';
import {ResourceManager} from '../classes/ResourceManager';
import {SpriteRenderer} from '../classes/SpriteRenderer';
import {Animator} from './../classes/Animator';
import {Animation} from '../classes/Animation';
import {PacmanScene} from './PacmanScene';

export class CoinAnimator extends Animator {
	start({input}: {input: HTMLElement}): void {
		let atlas = ResourceManager.getAtlas({
			name: PacmanScene.ATLAS_NAME.coins,
		})!;
		let spriteRenderer = this.Transform.getComponent<SpriteRenderer>({
			type: SpriteRenderer,
		});
		this.addAnimation({
			animation: new Animation({
				name: 'shine',
				data: [
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.coins}0`,
							})!),
						time: 150,
					}),
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.coins}1`,
							})!),
						time: 300,
					}),
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.coins}2`,
							})!),
						time: 450,
					}),
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.coins}1`,
							})!),
						time: 600,
					}),
				],
			}),
		});
		this.addTrigger({name: 'idle'});
		this.addTrigger({name: 'shine'});

		this.addTransition({name: 'idle', to: 'idle'});
		this.addTransition({name: 'shine', to: 'shine'});

		this.useTrigger({transition: 'idle', trigger: 'idle', value: true});
		this.useTrigger({transition: 'shine', trigger: 'shine', value: true});

		super.start({input});
		this.setCurrentAnimation({name: 'shine'});
	}
}
