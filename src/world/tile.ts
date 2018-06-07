import { Colour } from '../util';
import Entity from './entity';

export default class Tile {
  public x: number;
  public y: number;

  private covered: boolean = false;
  private entity?: Entity;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public render(): TileDisplay {
    let display: TileDisplay = {};
    if (this.entity) {
      display = {
        background: this.covered ? Colour.WHITE : Colour.DEFAULT,
        ...this.entity.render(),
      };
    }
    return display;
  }

  public setEntity(e: Entity) {
    this.entity = e;
  }

  public setCovered(covered: boolean) {
    this.covered = covered;
  }
}

export interface TileDisplay {
  background?: Colour;
  foreground?: Colour;
  char?: string;
}
