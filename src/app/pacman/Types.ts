export type PacmanSceneData = {
	size: {
		width: number;
		height: number;
	};
	// TODO: Include stats in scene creation
	stats: {
		offset: {
			x: number;
			y: number;
		};
		background: {
			image?: string;
			color: {r: number; g: number; b: number; a: number};
		};
	};
	grid: {
		offset: {
			x: number;
			y: number;
		};
		rows: number;
		columns: number;
		cells: {
			size: {
				width: number;
				height: number;
			};
			data: {
				position: {x: number; y: number};
				scale: {x: number; y: number};
				rotation: number;
				texture: string;
				color?: {r: number; g: number; b: number; a: number};
				type: string;
				additional: {
					[key: string]: any;
				};
			}[];
		};
		background: {
			image?: string;
			color: {r: number; g: number; b: number; a: number};
		};
	};
};
