import {Component} from './Component';
import {Shader} from './Shader';

export class Renderer extends Component {
	layerOrder: number = 0;
	protected shader?: Shader;
	render(): void {}
}
