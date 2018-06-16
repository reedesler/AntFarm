import LiveEntity from './liveEntity';
import { Colour, getRandomInt } from './util';
import { TileDisplay } from './world/tile';
import World from './world/world';

export default class Ant extends LiveEntity {
  private dead = false;

  constructor(world: World) {
    super(world);
    world.addAnt(this);
  }

  public render() {
    return {
      char: '•',
      foreground: this.dead ? Colour.BLACK : Colour.RED,
    };
  }

  public followingDisplay(x: number, y: number): TileDisplay {
    if (x === 0 && y === 1) {
      return {
        char: '‼',
        foreground: Colour.BRIGHTRED,
      };
    }
    return {};
  }

  public tick() {
    if (this.dead) return;
    this.move(getRandomInt(-1, 1), getRandomInt(-1, 1));
    if (Math.random() < 0.001) {
      this.dead = true;
    }
    if (Math.random() < 0.0001) {
      this.destroy();
    }
  }

  public destroy() {
    super.destroy();
    this.world.removeAnt(this);
  }
}
