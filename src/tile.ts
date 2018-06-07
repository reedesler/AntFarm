import Entity from './entity';
import { Colour } from './util';

export default class Tile {
  private covered: boolean = false;
  private entity?: Entity;

  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public render(): TileDisplay {
    const display: TileDisplay = {
      background: Colour.RED,
    };
    if ((this.x * this.x + this.y * this.y) < 100) {
      display.char = '.';
    }
    return display;
  }
}

export interface TileDisplay {
  background?: Colour;
  foreground?: Colour;
  char?: string;
}
