export class Grid<T> {
	protected rows: number;
	protected columns: number;
	protected cellSize: {width: number; height: number};
	protected offset: {x: number; y: number};
	protected data: Array<Array<T | null>>;

	constructor({
		offset,
		rows,
		columns,
		cellSize,
	}: {
		offset: {x: number; y: number};
		rows: number;
		columns: number;
		cellSize: {width: number; height: number};
	}) {
		this.offset = offset;
		this.rows = rows;
		this.columns = columns;
		this.cellSize = cellSize;
		this.data = [...Array(this.rows).keys()].map(() =>
			new Array(this.columns).fill(null)
		);
	}

	setCell<N extends T>({
		row,
		column,
		value,
	}: {
		row: number;
		column: number;
		value: N;
	}) {
		this.data[row][column] = value;
	}

	getCell<N extends T>({
		row,
		column,
		type,
	}: {
		row: number;
		column: number;
		type: any;
	}): N | null {
		const data = this.data[row][column] as N;
		return data instanceof type ? data : null;
	}

	convertPoint({
		x,
		y,
		scale,
	}: {
		x: number;
		y: number;
		scale: {x: number; y: number};
	}): {x: number; y: number} {
		return {
			x: Math.round(
				(x - this.offset.x) / this.CellSize.width +
					(this.CellSize.width * this.columns - Math.abs(scale.x)) /
						(2 * this.CellSize.width)
			),
			y: Math.round(
				(y - this.offset.y) / this.CellSize.height +
					(this.CellSize.height * this.rows - Math.abs(scale.y)) /
						(2 * this.CellSize.height)
			),
		};
	}

	isCoordInRange({row, column}: {row: number; column: number}) {
		return (
			row >= 0 && row < this.rows && column >= 0 && column < this.columns
		);
	}

	isPointInRange({
		x,
		y,
		scale,
	}: {
		x: number;
		y: number;
		scale: {x: number; y: number};
	}): boolean {
		const coord = this.convertPoint({x, y, scale});
		return (
			coord.x < this.Columns &&
			coord.x >= 0 &&
			coord.y < this.Rows &&
			coord.y >= 0
		);
	}

	snapToGrid({
		x,
		y,
		scale,
	}: {
		x: number;
		y: number;
		scale: {x: number; y: number};
	}) {
		const coord = this.convertPoint({
			x,
			y,
			scale,
		});
		return {
			x:
				this.Offset.x +
				(coord.x - this.Columns / 2) * this.CellSize.width +
				Math.abs(scale.x) / 2,
			y:
				this.Offset.y +
				(coord.y - this.Rows / 2) * this.CellSize.height +
				Math.abs(scale.y) / 2,
		};
	}

	get Rows() {
		return this.rows;
	}

	get Columns() {
		return this.columns;
	}

	get CellSize() {
		return this.cellSize;
	}

	get Offset() {
		return this.offset;
	}

	get Width() {
		return this.columns * this.cellSize.width;
	}

	get Height() {
		return this.rows * this.cellSize.height;
	}
}
