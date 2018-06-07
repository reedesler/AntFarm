import { Colour } from '../util';
import Entity from './entity';
import { TileDisplay } from './tile';

export default class Block extends Entity {
  public render(): TileDisplay {
    return {
      char: '#',
      foreground: Colour.BLACK,
    };
  }
}
