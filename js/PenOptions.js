export class PenOptions {
    colour = 'rgb(0, 0, 0)';
    width = 1;

    constructor(colour = 'rgb(0, 0, 0)', width = 1) {
        this.colour = colour;
        this.width = width;
    }
}