import {PacmanScene} from './PacmanScene';
import {AnimationFrame} from '../classes/Animation';
import {ResourceManager} from '../classes/ResourceManager';
import {SpriteRenderer} from '../classes/SpriteRenderer';
import {Animator} from './../classes/Animator';
import {Animation} from './../classes/Animation';

export class GhostAnimator extends Animator {
	start({input}: {input: HTMLElement}): void {
		let atlas = ResourceManager.getAtlas({
			name: PacmanScene.ATLAS_NAME.ghosts,
		})!;
		let spriteRenderer = this.Transform.getComponent<SpriteRenderer>({
			type: SpriteRenderer,
		});
		this.addAnimation({
			animation: new Animation({
				name: 'walk_bottom',
				data: [
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.ghosts}6`,
							})!),
						time: 100,
					}),
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.ghosts}7`,
							})!),
						time: 200,
					}),
				],
			}),
		});
		this.addAnimation({
			animation: new Animation({
				name: 'walk_top',
				data: [
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.ghosts}2`,
							})!),
						time: 100,
					}),
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.ghosts}3`,
							})!),
						time: 200,
					}),
				],
			}),
		});
		this.addAnimation({
			animation: new Animation({
				name: 'walk_left',
				data: [
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.ghosts}4`,
							})!),
						time: 100,
					}),
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.ghosts}5`,
							})!),
						time: 200,
					}),
				],
			}),
		});
		this.addAnimation({
			animation: new Animation({
				name: 'walk_right',
				data: [
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.ghosts}0`,
							})!),
						time: 100,
					}),
					new AnimationFrame({
						state: () =>
							(spriteRenderer.sprite = atlas.getSprite({
								name: `${PacmanScene.SPRITE_PREFIXES.ghosts}1`,
							})!),
						time: 200,
					}),
				],
			}),
		});
		this.addTrigger({name: 'idle'});
		this.addTrigger({name: 'walk_left'});
		this.addTrigger({name: 'walk_right'});
		this.addTrigger({name: 'walk_top'});
		this.addTrigger({name: 'walk_bottom'});

		this.addTransition({name: 'idle', to: 'idle'});
		this.addTransition({name: 'walk_left', to: 'walk_left'});
		this.addTransition({name: 'walk_right', to: 'walk_right'});
		this.addTransition({name: 'walk_top', to: 'walk_top'});
		this.addTransition({name: 'walk_bottom', to: 'walk_bottom'});

		this.useTrigger({transition: 'idle', trigger: 'idle', value: true});
		this.useTrigger({
			transition: 'walk_left',
			trigger: 'walk_left',
			value: true,
		});
		this.useTrigger({
			transition: 'walk_right',
			trigger: 'walk_right',
			value: true,
		});
		this.useTrigger({
			transition: 'walk_top',
			trigger: 'walk_top',
			value: true,
		});
		this.useTrigger({
			transition: 'walk_bottom',
			trigger: 'walk_bottom',
			value: true,
		});

		super.start({input});
	}
}
