import {Colour} from "../util";
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
    if (this.entity) return this.entity.render();
    else return {};
  }

  public setEntity(e: Entity) {
    this.entity = e;
  }
}

export interface TileDisplay {
  background?: Colour;
  foreground?: Colour;
  char?: string;
}
