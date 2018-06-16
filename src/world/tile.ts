import Entity from '../entity';
import { Colour } from '../util';

export default class Tile {
  public x: number;
  public y: number;

  private covered: boolean = false;
  private entity?: Entity | null;

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

  public setEntity(e: Entity | null) {
    if (e && this.entity) this.entity.destroy();
    this.entity = e;
    if (this.entity) this.entity.tile = this;
  }

  public getEntity() {
    return this.entity;
  }

  public setCovered(covered: boolean) {
    this.covered = covered;
  }

  public isOpaque() {
    return !!this.entity && this.entity.isOpaque();
  }
}

export interface TileDisplay {
  background?: Colour;
  foreground?: Colour;
  char?: string;
}
