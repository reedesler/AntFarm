import { default as Tile, TileDisplay } from './world/tile';
import World from './world/world';

export default abstract class Entity {
  public tile: Tile;
  protected world: World;

  constructor(world: World) {
    this.world = world;
  }

  public render(): TileDisplay {
    return {};
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
