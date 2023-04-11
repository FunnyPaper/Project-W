import { Behavior } from './Behavior';

/**
 * Abstraction for sound making behavior
 */
class AudioListener extends Behavior {
    #audio: HTMLAudioElement = new Audio();

    /**
     * Plays currently load music file
     */
    play() {
        this.#audio.play();
    }

    set url(value: string) { this.#audio.src = value; }
    set loop(value: boolean) { this.#audio.loop = value; }
    get loop(): boolean { return this.#audio.loop; }
}
