import './styles.scss';
import {PacmanScene} from './app/pacman/PacmanScene';
import * as Level_1 from './assets/levels/pacman/1.json';
import * as Level_2 from './assets/levels/pacman/1.json';
import * as Level_3 from './assets/levels/pacman/1.json';

window.addEventListener('load', async () => {
	let scene: PacmanScene;
	const canvas = document.querySelector('#gl-canvas')! as HTMLCanvasElement;
	const startElement = document.querySelector('#start')! as HTMLDivElement;
	const levelSelectionElement = document.querySelector('#level_selection')! as HTMLDivElement;
	const gameOverElement = document.querySelector('#game_over')! as HTMLDivElement;
	const gameWonElement = document.querySelector('#game_won')! as HTMLDivElement;
	const pauseElement = document.querySelector('#pause')! as HTMLDivElement;

	const allElements = [
		canvas,
		startElement,
		levelSelectionElement,
		gameOverElement,
		gameWonElement,
		pauseElement
	];

	canvas.style.display = 'none';
	levelSelectionElement.style.display = 'none';
	gameOverElement.style.display = 'none';
	gameWonElement.style.display = 'none';
	pauseElement.style.display = 'none';
	startElement.style.width = canvas.style.width;
	startElement.style.height = canvas.style.height;

	startElement.addEventListener('click', () => {
		allElements.forEach(e => e.style.display = 'none');
		levelSelectionElement.style.display = 'flex';
		levelSelectionElement.style.width = canvas.style.width;
		levelSelectionElement.style.height = canvas.style.height;
	});

	levelSelectionElement.querySelectorAll('.level').forEach((level, index) => {
		level.addEventListener('click', async () => {
			allElements.forEach(e => e.style.display = 'none');
			switch(index) {
				case 0: scene = await PacmanScene.loadFromFile({file: Level_1}).then(scene => scene.run());
					break;
				case 1: scene = await PacmanScene.loadFromFile({file: Level_2}).then(scene => scene.run());
					break;
				case 2: scene = await PacmanScene.loadFromFile({file: Level_3}).then(scene => scene.run());
					break;
			}
			canvas.style.display = 'flex';
		});
	});

	window.addEventListener('pause', () => {
		pauseElement.style.display = 'flex';
		pauseElement.style.width = canvas.style.width;
		pauseElement.style.height = canvas.style.height;
	});

	pauseElement.addEventListener('click', () => {
		pauseElement.style.display = 'none';
		window.dispatchEvent(new Event('resume'));
	});

	window.addEventListener('game_won', () => {
		gameWonElement.style.display = 'flex';
		gameWonElement.style.width = canvas.style.width;
		gameWonElement.style.height = canvas.style.height;
	})

	gameWonElement.addEventListener('click', () => {
		allElements.forEach(e => e.style.display = 'none');
		levelSelectionElement.style.display = 'flex';
		levelSelectionElement.style.width = canvas.style.width;
		levelSelectionElement.style.height = canvas.style.height;
	});

	window.addEventListener('game_over', () => {
		gameOverElement.style.display = 'flex';
		gameOverElement.style.width = canvas.style.width;
		gameOverElement.style.height = canvas.style.height;
	})

	gameOverElement.addEventListener('click', () => {
		allElements.forEach(e => e.style.display = 'none');
		levelSelectionElement.style.display = 'flex';
		levelSelectionElement.style.width = canvas.style.width;
		levelSelectionElement.style.height = canvas.style.height;
	});
});
