import Entity from '../entity';
import { Colour } from '../util';
import { TileDisplay } from './tile';

export default class Block extends Entity {
  public render(): TileDisplay {
    return {
      char: '#',
      foreground: Colour.BLACK,
    };
  }
}
