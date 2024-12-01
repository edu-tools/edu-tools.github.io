import { PenOptions } from "./PenOptions.js";
import { Point } from "./Point.js";

export class DrawnLine {
    start = new Point();
    end = new Point();
    penOptions = new PenOptions();

    constructor(start = new Point(), end = new Point(), penOptions = new PenOptions()) {
        this.start = start;
        this.end = end;
        this.penOptions = penOptions;
    }
}