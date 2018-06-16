import { default as Tile, TileDisplay } from './world/tile';
import World from './world/world';

export default abstract class Entity {
  public tile: Tile | null;
  protected world: World;

  constructor(world: World) {
    this.world = world;
  }

  get x() {
    if (this.tile) {
      return this.tile.x;
    }
    return null;
  }

  get y() {
    if (this.tile) {
      return this.tile.y;
    }
    return null;
  }

  public render(): TileDisplay {
    return {};
  }

  public followingDisplay(x: number, y: number): TileDisplay {
    return {};
  }

  public destroy() {
    if (this.tile) this.tile.setEntity(null);
  }

  public isOpaque() {
    return false;
  }

  protected move(x: number, y: number) {
    if (Math.abs(x) > 1 || Math.abs(y) > 1 || !this.tile) return;
    const destTile = this.world.getTile(this.tile.x + x, this.tile.y + y);
    if (destTile && !destTile.getEntity()) {
      this.tile.setEntity(null);
      destTile.setEntity(this);
    }
  }
}
