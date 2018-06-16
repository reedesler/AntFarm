import LiveEntity from './liveEntity';
import ShadowCaster from './shadowcaster/shadowcaster';
import { Colour, getRandomInt } from './util';
import Tile, { TileDisplay } from './world/tile';
import World from './world/world';

export default class Ant extends LiveEntity {
  private dead = false;
  private fov: Array<Array<Tile | null>>;

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
    if (this.fov[y] && this.fov[y][x]) {
      return {
        background: Colour.YELLOW,
      };
    }
    return {};
  }

  public tick() {
    if (Math.random() < 0.0001) {
      return this.destroy();
    }
    if (this.dead) return;
    this.move(getRandomInt(-1, 1), getRandomInt(-1, 1));
    if (Math.random() < 0.001) {
      this.dead = true;
    }
    this.fov = this.getFov();
  }

  private getFov() {
    const fov: Array<Array<Tile | null>> = [];
    const VIEW_LIMIT = 20;
    for (let y = -VIEW_LIMIT; y <= VIEW_LIMIT; y++) {
      fov[y] = [];
      for (let x = -VIEW_LIMIT; x <= VIEW_LIMIT; x++) {
        fov[y][x] = this.world.getTile(this.x + x, this.y + y);
      }
    }
    const isOpaque = (x: number, y: number) => {
      const tile = fov[y][x];
      return !tile || tile.isOpaque();
    };
    const lineOfSightFov: Array<Array<Tile | null>> = [];
    const setFov = (x: number, y: number) => {
      if (!lineOfSightFov[y]) {
        lineOfSightFov[y] = [];
      }
      lineOfSightFov[y][x] = fov[y][x];
    };
    ShadowCaster.computeFieldOfViewWithShadowCasting(0, 0, VIEW_LIMIT, isOpaque, setFov);
    return lineOfSightFov;
  }

  public destroy() {
    super.destroy();
    this.world.removeAnt(this);
  }
}
