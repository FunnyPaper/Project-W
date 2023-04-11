import { GameObject } from "./GameObject";

/**
 * Part of objects identity
 */
export class Component {
    parent: GameObject | null = null;

    /**
     * Starting method called inside scene
     */
    start() {}

    /**
     * Updating method called inside scene
     */
    update() {}
}
