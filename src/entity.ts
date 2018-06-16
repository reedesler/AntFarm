import { default as Tile, TileDisplay } from './world/tile';
import World from './world/world';

export default abstract class Entity {
  public tile: Tile;
  protected world: World;

  constructor(world: World) {
    this.world = world;
  }

  get x() {
    return this.tile.x;
  }

  get y() {
    return this.tile.y;
  }

  public render(): TileDisplay {
    return {};
  }

  public followingDisplay(x: number, y: number): TileDisplay {
    return {};
  }

  public destroy() {
    this.tile.setEntity(null);
  }

  public isOpaque() {
    return false;
  }

  protected move(x: number, y: number) {
    if (Math.abs(x) > 1 || Math.abs(y) > 1) return;
    const destTile = this.world.getTile(this.tile.x + x, this.tile.y + y);
    if (destTile && !destTile.getEntity()) {
      this.tile.setEntity(null);
      destTile.setEntity(this);
    }
  }
}
