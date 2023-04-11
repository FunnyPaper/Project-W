import { Behavior } from "./Behavior";
import { Animation } from "./Animation";

export interface ITransition {
	from: string;
	to: string;
	triggers: Map<string, boolean>;
	bools: Map<string, boolean>
}

/**
 * Abstarction for aniamtion managements
 */
class Animator extends Behavior {
    #animations: Map<string, Animation>  = new Map();
    #transitions: Map<string, ITransition> = new Map();
    #triggers: Map<string, boolean> = new Map();
    #bools: Map<string, boolean> = new Map();
    #currentAnimation: Animation | null = null;

    /**
     * Adds animation to animator
     * @param {object} obj 
     * @param {Anmation} obj.animation Animation to be added 
     * @param {boolean} obj.starting Is given animation "idle"
     */
    addAnimation({ animation, starting = false }: { animation: Animation, starting: boolean }): void {
        this.#animations.set(animation.name, animation);
        if (starting) {
            this.#currentAnimation = animation;
        }
    }

    /**
     * Adds trigger to animator
     * @param {object} obj 
     * @param {string} obj.name Trigger's name 
     */
    addTrigger({ name }: { name: string }): void {
        if (!this.#triggers.has(name)) {
            this.#triggers.set(name, false);
        }
    }

    /**
     * Adds bool to animator
     * @param {object} obj 
     * @param {string} obj.name Bool's name 
     */
    addBool({ name }: { name: string }): void {
        if (!this.#bools.has(name)) {
            this.#bools.set(name, false);
        }
    }

    /**
     * Attaches trigger to transition
     * @param {object} obj 
     * @param {string} obj.transition Transition getting trigger
     * @param {string} obj.trigger Trigger to be used
     * @param {boolean} obj.value Trigger's state to be looked
     */
    useTrigger({ transition, trigger, value }: { transition: string, trigger: string, value: boolean }): void {
        this.#transitions.get(transition)?.triggers.set(trigger, value);
    }

    /**
     * Attaches bool to transition
     * @param {object} obj 
     * @param {string} obj.transition Bool getting trigger
     * @param {string} obj.bool Bool to be used
     * @param {boolean} obj.value Bool's state to be looked
     */
    useBool({ transition, bool, value }: { transition: string, bool: string, value: boolean }): void {
        this.#transitions.get(transition)?.bools.set(bool, value);
    }

    /**
     * Sets trigger to true
     * @param {object} obj 
     * @param {string} obj.name Trigger to be set 
     */
    setTrigger({ name }: { name: string }): void {
        this.#triggers.set(name, true);
    }

    /**
     * Resets trigger to false
     * @param {object} obj 
     * @param {string} obj.name Trigger to be reset 
     */
    #resetTrigger({ name }: { name: string }): void {
        this.#triggers.set(name, false);
    }

    /**
     * Searches for specified trigger
     * @param {object} obj 
     * @param {string} obj.name Trigger to be returned
     * @returns {boolean | undefined} Trigger's current state
     */
    getTrigger({ name }: { name: string }): boolean | undefined {
        return this.#triggers.get(name);
    }

    /**
     * Sets bool to given value
     * @param {object} obj 
     * @param {string} obj.name Bool to be set
     * @param {boolean} obj.value Value to be assigned to bool 
     */
    setBool({ name, value }: { name: string, value: boolean }): void {
        this.#bools.set(name, value);
    }

    /**
     * Searches for specified trigger
     * @param {object} obj 
     * @param {string} obj.name Bool to be returned
     * @returns {boolean | undefined} Bool's current state 
     */
    getBool({ name }: { name: string }): boolean | undefined {
        return this.#bools.get(name);
    }
    
    /**
     * Adds transition between animations
     * @param {object} obj 
     * @param {string} obj.name Transition's name
     * @param {string} obj.from Current animation
     * @param {string} obj.to Next animation
     */
    addTransition({ name, from, to }: { name: string, from: string, to: string }): void {
        if (!this.#transitions.has(name)) {
            this.#transitions.set(name, { from, to, triggers: new Map(), bools: new Map() });
        }
    }
    
    /**
     * Deletes transition between animations
     * @param {object} obj 
     * @param {string} obj.name Transition's name 
     */
    removeTransition({ name }: { name: string }): void {
        this.#transitions.delete(name);
    }

    /**
     * Callback for animations' onFrameEndEvent
     */
    #onFrameEnd(): void {
        if (!this.#currentAnimation) {
            let triggers: [string, boolean][] = [];

            // Get next valid animation
            const next = this.#animations.get([...this.#transitions.values()]?.find(t => {
                // Store triggers for later use
                triggers = [...t.triggers.entries()];
                // Test for current animation's transition's triggers and bools
                const triggersPass = triggers.every(([key, value]) => this.#triggers.get(key) === value);
                const boolsPass = [...t.bools.entries()].every(([key, value]) => this.#bools.get(key) === value);
                // Next animation is valid if it's previous state is equal to current state and both triggers and bools pass
                return this.#animations.get(t.from) === this.#currentAnimation && triggersPass && boolsPass;
            })?.to!);

            if (next) {
                // Reset triggers of current animation 
                triggers?.forEach(([name, _]) => this.#resetTrigger({ name }));
                // Remove callback from current animation
                this.#currentAnimation!.frameEndEvent.splice(
                    this.#currentAnimation!.frameEndEvent.indexOf(
                        this.#onFrameEnd.bind(this), 1
                    )
                );
                this.#currentAnimation = next;
                // Set callback to next animation
                this.#currentAnimation.frameEndEvent.push(this.#onFrameEnd.bind(this));
            }
        }
    }

    /**
     * Method override
     */
    start(): void {
        // Set current animation if any was not specified
        this.#currentAnimation = 
            !this.#currentAnimation ? 
                [...this.#animations.values()][0] : 
                this.#currentAnimation;

        // Set callback to animation
        this.#currentAnimation.frameEndEvent.push(this.#onFrameEnd.bind(this));
    }

    /**
     * Method override
     */
    update(): void {
        this.#currentAnimation?.update();
    }
}
